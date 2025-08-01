import React from 'react';

import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  useReactFlow,
  useInternalNode,
  type EdgeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';


function getLEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  borderRadius = 5, // 平滑拐角的半径
    nodeRadius,
}): string {

  // 计算横向和纵向的中间点
  // const horizontalMidpoint = (sourceX ) ;
  // const verticalMidpoint = (sourceY ) ;

  // 判断路径方向（水平优先或垂直优先）
  const isHorizontal = Math.abs(targetX - sourceX) > Math.abs(targetY - sourceY);

  const isdx = Math.abs(targetY - sourceY) < 20;
  const isdy = Math.abs(targetX - sourceX + 2 * +nodeRadius) < 30;

    const dx = targetX - sourceX + nodeRadius;
    const dy = targetY - sourceY;

    // 右下 左下 右上 左上
    const bottomRight = dx > 0 && dy > 0
    const bottomLeft = dx < 0 && dy > 0
    const topRight = dx > 0 && dy < 0
    const topLeft = dx < 0 && dy < 0

    let controlX, controlY, endX, endY;

  // const sourceNode = useInternalNode(source);
  // const targetNode = useInternalNode(target);
  let path;
  let targetEndX = targetX;
  let targetEndY = targetY;

  if (isdx){
    path = `M ${sourceX},${sourceY}
            H ${targetX}`;


  }
  else if (isdy){
    if(dy>0){
      targetEndY = targetY - nodeRadius
    }
    else targetEndY = targetY + nodeRadius;


    sourceX = sourceX - nodeRadius


    path = `M ${sourceX},${sourceY}
            V ${targetEndY}`;
  }
  // else if (sourceY < targetY && Math.abs(dx)<10) {
  //   path = `M ${sourceX},${sourceY}
  //           V ${targetY}`;
  // }

  else {

    let newTargetY = targetY;


    if (sourceY <= targetY){
      newTargetY = targetY - borderRadius;
      if (dx >= 0){
        sourceX = sourceX - nodeRadius;
        endX = sourceX + borderRadius;
        endY = targetY;
      }
      else if (dx <0){
        sourceX = sourceX - nodeRadius;
        endX = sourceX - borderRadius ;
        endY = targetY;
        targetEndX = targetX + 2 * nodeRadius;
      }
    }
    else if (sourceY > targetY){
      newTargetY = targetY + borderRadius;
      if (dx >= 0){
        sourceX = sourceX - nodeRadius;
        endX = sourceX + borderRadius;
        endY = targetY;
      }
      else if (dx < 0){
        sourceX = sourceX - nodeRadius;
        endX = sourceX - borderRadius;
        endY = targetY;
        targetEndX = targetX + 2 * nodeRadius;
      }
    }

    path = `M ${sourceX},${sourceY}
            V ${newTargetY}
            Q ${sourceX},${targetY} ${endX},${endY}
            H ${targetEndX}`;
  }
  return path;

  // if (isHorizontal) {
  //   let newTargetY = targetY;
  //   if (sourceY < targetY){
  //     newTargetY = targetY - borderRadius;
  //   }
  //   else if (sourceY > targetY){
  //     newTargetY = targetY + borderRadius;
  //   }
  //
  // if (bottomRight) {
  //         // 目标点在源点的右下方
  //         endX = sourceX + borderRadius;
  //         endY = targetY;
  //         // newsourceX = sourceX + borderRadius;
  //     } else if (topRight) {
  //         // 目标点在源点的右上方
  //         // 这里可以根据具体需求设定控制点和终点坐标
  //         endX = sourceX + borderRadius;
  //         endY = targetY;
  //     } else if (bottomLeft) {
  //         // 目标点在源点的左下方
  //         // 这里可以根据具体需求设定控制点和终点坐标
  //         endX = sourceX - borderRadius;
  //         endY = targetY;
  //     } else if (topLeft) {
  //         // 目标点在源点的左上方
  //         // 这里可以根据具体需求设定控制点和终点坐标
  //         endX = sourceX - borderRadius;
  //         endY = targetY;
  //     }
  //   // 水平优先路径：水平移动 -> 垂直移动 -> 水平移动
  //   path = `M ${sourceX},${sourceY}
  //           V ${newTargetY}
  //           Q ${sourceX},${targetY} ${endX},${endY}
  //           H ${targetX}`;
  // } else {
  //   let newSourceX = sourceX;
  //   if (sourceX < targetX){
  //     newSourceX = targetX - borderRadius;
  //   }
  //   else if (sourceX > targetX){
  //     newSourceX = targetX + borderRadius;
  //   }
  // if (dx > 0 && dy > 0) {
  //         // 目标点在源点的右下方
  //         endX = targetX;
  //         endY = sourceY + borderRadius;
  //     } else if (dx > 0 && dy < 0) {
  //         // 目标点在源点的右上方
  //         // 这里可以根据具体需求设定控制点和终点坐标
  //         endX = targetX;
  //         endY = sourceY - borderRadius;
  //     } else if (dx < 0 && dy > 0) {
  //         // 目标点在源点的左下方
  //         // 这里可以根据具体需求设定控制点和终点坐标
  //         endX = targetX;
  //         endY = sourceY + borderRadius;
  //     } else if (dx < 0 && dy < 0) {
  //         // 目标点在源点的左上方
  //         // 这里可以根据具体需求设定控制点和终点坐标
  //         endX = targetX;
  //         endY = sourceY - borderRadius;
  //     }
  //   // 垂直优先路径：垂直移动 -> 水平移动 -> 垂直移动
  //   path = `M ${sourceX},${sourceY}
  //           H ${newSourceX}
  //           Q ${targetX},${sourceY} ${endX},${endY}
  //           V ${targetY}`;
  // }

  // 应用贝塞尔曲线平滑拐角
  // path = path.replace(/ ([HV]) /g, (match, cmd) => {
  //   if (cmd === 'H') {
  //     return ` Q ${targetX - 5},${sourceY} `;
  //   } else {
  //     return ` Q ${sourceX},${sourceX - 5} `;
  //   }
  // });

  // return path;
}

export default function CustomEdge({
  id,
  source,
  target,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {

  // console.log('id:', id);
  // console.log('source:', source);
  // console.log('target:', target);
  // console.log('sourceX:', sourceX);
  // console.log('sourceY:', sourceY);
  // console.log('targetX:', targetX);
  // console.log('targetY:', targetY);
  // console.log('sourcePosition:', sourcePosition);
  // console.log('targetPosition:', targetPosition);
  // console.log('style:', style);
  // console.log('markerEnd:', markerEnd);

    const sourceNode = useInternalNode(source);
    const targetNode = useInternalNode(target);
    const nodeRadius = sourceNode.measured.width / 2 + 4;
    console.log('nodeRadius:', nodeRadius);
    // console.log('sourceX:', sourceNode.internals.positionAbsolute.x + sourceNode.measured.width / 2);
    // console.log('sourceY:', sourceNode.internals.positionAbsolute.y + sourceNode.measured.height / 2);

  const { setEdges } = useReactFlow();
  // const [edgePath, labelX, labelY] = getLEdge({
  const path = getLEdge({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    nodeRadius
  });


  return (
    <>
      <BaseEdge path={path} markerEnd={markerEnd} style={style} />
      {/*<EdgeLabelRenderer >*/}
      {/*<div*/}
      {/*    className="nodrag nopan"*/}
      {/*  >*/}

      {/*  </div>*/}
      {/*</EdgeLabelRenderer>*/}
    </>
  );
}