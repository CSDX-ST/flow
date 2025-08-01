import { useReactFlow, Background } from '@xyflow/react';

function OriginCross() {

  const { getZoom, getViewport } = useReactFlow();

  // 计算原点在可视区域的坐标
  const { x: viewX, y: viewY, zoom } = getViewport();
  const crossSize = 200; // 十字大小
  const strokeWidth = 2 / zoom; // 线宽随缩放调整

  return (
    <svg
      className="react-flow__background"
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        pointerEvents: 'none', // 禁止交互穿透
        zIndex: 1111, // 确保在背景上层
      }}
    >
      {/* 水平线 */}
      <line
        x1={-viewX / zoom - crossSize}
        y1={-viewY / zoom}
        x2={-viewX / zoom + crossSize}
        y2={-viewY / zoom}
        stroke="#ff0000"
        strokeWidth={strokeWidth}
      />
      {/* 垂直线 */}
      <line
        x1={-viewX / zoom}
        y1={-viewY / zoom - crossSize}
        x2={-viewX / zoom}
        y2={-viewY / zoom + crossSize}
        stroke="#ff0000"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
}

export default OriginCross;