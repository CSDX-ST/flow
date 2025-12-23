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

/**
 * 直角L型路径生成器
 * 处理三种连接情况：
 * 1. 横向接近：水平直线连接
 * 2. 纵向接近：垂直直线连接
 * 3. 常规L型：先垂直后水平的直角路径
 */
function getStraightLEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  nodeRadius,
}: LEdgeParams): string {
  // 计算坐标差异
  const deltaX = targetX - sourceX;
  const deltaY = targetY - sourceY;

  // 判断极小距离情况阈值
  const horizontalThreshold = 20;
  const verticalThreshold = 30;

  // 情况1：水平直接连接
  if (Math.abs(deltaY) < horizontalThreshold) {
    const adjustedX = deltaX > 0 ? targetX : targetX + 2 * nodeRadius;
    return `M ${sourceX},${sourceY} H ${adjustedX}`;
  }

  // 情况2：垂直直接连接
  if (Math.abs(deltaX + 2 * nodeRadius) < verticalThreshold) {
    const adjustedY = deltaY > 0
      ? targetY - nodeRadius
      : targetY + nodeRadius;
    return `M ${sourceX - nodeRadius},${sourceY} V ${adjustedY}`;
  }

  // 情况3：标准直角L型路径
  const startX = sourceX - nodeRadius;
  let endX = targetX;

  // 处理向左连接的情况
  if (deltaX <= -nodeRadius) {
    endX += 2 * nodeRadius;
  }

  // 生成直角路径：先垂直到底，再水平到目标
  return `
    M ${startX},${sourceY}
    V ${targetY}
    H ${endX}
  `;
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
  const nodeRadius = ((sourceNode.measured?.width || 40) / 2) + 3;
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