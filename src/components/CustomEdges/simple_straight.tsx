import React from 'react';
import {
  BaseEdge,
  useInternalNode,
  type EdgeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

// 边缘路径计算参数类型
interface LEdgeParams {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  nodeRadius: number;
}

function getStraightLEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  nodeRadius,
}: LEdgeParams): string {
  const deltaX = targetX - sourceX +2*nodeRadius;
  const deltaY = targetY - sourceY;

  const startX = sourceX - nodeRadius

  // console.log("deltaX", deltaX, deltaY);
  const hypotenuseSimplified = Math.hypot(deltaX, deltaY);
  // console.log('hypotenuseSimplified', hypotenuseSimplified);

  const cosA = deltaX/hypotenuseSimplified;
  const sinA = deltaY/hypotenuseSimplified;
  // console.log('cosA', cosA);

  const endX = targetX + nodeRadius -nodeRadius*cosA;
  const endY = targetY - nodeRadius*sinA;

 return `M ${startX} ${sourceY} L ${endX} ${endY}`;
}

export default function CustomEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  source,
  style = {},
  markerEnd,
}: EdgeProps) {
  // 获取源节点尺寸
  const sourceNode = useInternalNode(source);
  // 计算节点半径（考虑默认值）
  const nodeRadius = ((sourceNode.measured?.width || 40) / 2) + 4;
  // console.log('sourceNode:', nodeRadius);

  // 生成路径数据
  const path = getStraightLEdge({
    sourceX,
    sourceY,
    targetX,
    targetY,
    nodeRadius,
  });

  return <BaseEdge path={path} markerEnd={markerEnd} style={style} />;
}