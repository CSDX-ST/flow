import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  getSmoothStepPath,
  useReactFlow,
  type EdgeProps,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
export default function CustomEdge({
  id,

  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer >
      <div
          className="nodrag nopan"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              position:"absolute",
              pointerEvents:"all",
              transformOrigin:"center center",

          }}
        >
                    <button
                        style={{
                            borderRadius: '50%', // 圆形按钮
                            width: '12px', // 按钮宽度
                            height: '12px',
                            // border: '5px solid #e3e3e3',
                            backgroundColor: '#e3e3e3',
                            cursor: 'pointer', // 鼠标指针样式
                            outline: 'none', // 去除点击时的外边框
                            pointerEvents: "all", // 恢复按钮的点击事件
                            padding: 0,
                            color: 'var(--xy-edge-label-color-default)'
                        }}
                        onClick={onEdgeClick}
                    >

                    </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}