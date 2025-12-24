import React from 'react';
import { getBezierPath, EdgeProps, useStore } from '@xyflow/react';

// 自定义波浪线边组件
const WaveEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) => {
  // 获取边的路径信息（基于Bezier曲线）
  const [path] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  // 解析路径关键点，用于生成波浪效果
 const getWavePath = () => {
  // 简化版波浪生成：基于起点和终点计算波浪路径（适配任意斜向）
  const startX = sourceX;
  const startY = sourceY;
  const endX = targetX;
  const endY = targetY;

  const deltaX = endX - startX;
  const deltaY = endY - startY;

  // 1. 计算路径的方向角（弧度制）：替代原有的 tanA（避免 deltaX=0 时的除零错误）
  const pathAngle = Math.atan2(deltaY, deltaX);
  // 2. 计算路径的法线方向角（垂直于路径方向，用于波浪偏移）：±90°（π/2 弧度）
  const normalAngle = pathAngle + Math.PI / 2;

  // 计算总长度和波浪参数
  const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  const waveCount = Math.max(3, Math.abs(length) / 15); // 保证最少3个波浪，避免无效值
  const waveAmplitude = 18; // 波浪振幅（高度）

  // 生成波浪路径
  let wavePath = `M ${startX} ${startY}`;
  const stepX = deltaX / waveCount;
  const stepY = deltaY / waveCount;

  for (let i = 1; i <= waveCount - 2; i++) {
    const currentX = startX + stepX * i;
    const currentY = startY + stepY * i;
    // 上一个分段的中点（贝塞尔曲线控制点的基础位置）
    const prevSegmentMidX = (currentX - stepX) + stepX / 2;
    const prevSegmentMidY = (currentY - stepY) + stepY / 2;

    // 3. 交替生成波峰和波谷：基于法线方向计算偏移量（适配斜向路径）
    const offsetDirection = i % 2 === 0 ? 1 : -1; // 波峰/波谷切换
    // 计算法线方向的偏移坐标（x/y同时偏移，而非仅Y轴）
    const offsetX = offsetDirection * waveAmplitude * Math.cos(normalAngle);
    const offsetY = offsetDirection * waveAmplitude * Math.sin(normalAngle);

    // 4. 控制点坐标：基础中点 + 法线方向偏移
    const controlX = prevSegmentMidX + offsetX;
    const controlY = prevSegmentMidY + offsetY;

    // 使用二次贝塞尔曲线绘制波浪段
    wavePath += ` Q ${controlX} ${controlY}, ${currentX} ${currentY}`;
  }
  // 连接到终点
  wavePath += ` L ${endX} ${endY}`;

  return wavePath;
};

  // 合并默认样式和用户传入样式
  const edgeStyle = {
    stroke: '#555', // 波浪线颜色
    strokeWidth: 2, // 波浪线宽度
    fill: 'none', // 无填充
    ...style,
  };

  return (
    <path
      id={id}
      d={getWavePath()} // 使用自定义波浪路径
      style={edgeStyle}
      markerEnd={markerEnd} // 保留箭头标记
    />
  );
};

// 高阶组件：注册自定义边类型
export const registerWaveEdge = () => {
  return {
    type: 'wave', // 自定义边类型名称
    component: WaveEdge,
  };
};

export default WaveEdge;