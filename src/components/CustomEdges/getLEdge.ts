function getLEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  borderRadius = 5, // 平滑拐角的半径
}): string {
  // 计算横向和纵向的中间点
  const horizontalMidpoint = (sourceX + targetX) / 2;
  const verticalMidpoint = (sourceY + targetY) / 2;

  // 判断路径方向（水平优先或垂直优先）
  const isHorizontal = Math.abs(targetX - sourceX) > Math.abs(targetY - sourceY);

  let path;

  if (isHorizontal) {
    // 水平优先路径：水平移动 -> 垂直移动 -> 水平移动
    path = `M ${sourceX},${sourceY}

            V ${targetY}
            H ${targetX}`;
  } else {
    // 垂直优先路径：垂直移动 -> 水平移动 -> 垂直移动
    path = `M ${sourceX},${sourceY}

            H ${targetX}
            V ${targetY}`;
  }

  // // 应用贝塞尔曲线平滑拐角
  // path = path.replace(/ ([HV]) /g, (match, cmd) => {
  //   if (cmd === 'H') {
  //     return ` Q ${horizontalMidpoint + borderRadius},${verticalMidpoint} `;
  //   } else {
  //     return ` Q ${horizontalMidpoint},${verticalMidpoint + borderRadius} `;
  //   }
  // });

  return path;
}