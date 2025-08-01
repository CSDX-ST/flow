import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import {type Node, useInternalNode, useStore} from "@xyflow/react"

interface XYAxisControlProps {
  selectedNode: Node | null
  updateNodePosition: (id: string, newPosition: { x: number; y: number }) => void
}

export function XYAxisControl({ selectedNode, updateNodePosition }: XYAxisControlProps) {
  // 如果没有选中节点，不渲染任何内容
  if (!selectedNode) return null;

  // 从 store 中获取最新的节点数据和视口变换
  const nodes = useStore((state) => state.nodes);
  const transform = useStore((state) => state.transform);

  // 获取最新的选中节点数据
  const currentNode = nodes.find(node => node.id === selectedNode.id) || selectedNode;

  // 解构视口变换
  const [x, y, zoom] = transform || [0, 0, 1];

  // Refs to maintain state across renders
  const isDraggingXRef = useRef(false);
  const isDraggingYRef = useRef(false);
  const startPositionRef = useRef({ x: 0, y: 0 });
  const nodeStartPositionRef = useRef({ x: 0, y: 0 });

  // UI state
  const [currentCoords, setCurrentCoords] = useState({ x: 0, y: 0 });
  const [showCoords, setShowCoords] = useState(false);
  const [hoverX, setHoverX] = useState(false);
  const [hoverY, setHoverY] = useState(false);
  const [isDraggingX, setIsDraggingX] = useState(false);
  const [isDraggingY, setIsDraggingY] = useState(false);
  // 新增：跟踪是否与控件交互过
  const [hasInteracted, setHasInteracted] = useState(false);

  // Setup event handlers when component mounts
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingXRef.current && !isDraggingYRef.current) return;
      if (!currentNode) return;

      // 设置为已交互状态
      setHasInteracted(true);

      let newPosition = { ...nodeStartPositionRef.current };

      if (isDraggingXRef.current) {
        // Only move along X axis
        const dx = (e.clientX - startPositionRef.current.x) / zoom;
        newPosition = {
          x: nodeStartPositionRef.current.x + dx,
          y: nodeStartPositionRef.current.y,
        };
      }

      if (isDraggingYRef.current) {
        // Only move along Y axis
        const dy = (e.clientY - startPositionRef.current.y) / zoom;
        newPosition = {
          x: nodeStartPositionRef.current.x,
          y: nodeStartPositionRef.current.y + dy,
        };
      }

      updateNodePosition(currentNode.id, newPosition);
      setCurrentCoords({
        x: Math.round(newPosition.x),
        y: Math.round(newPosition.y),
      });
    };

    const handleMouseUp = () => {
      if (isDraggingXRef.current || isDraggingYRef.current) {
        isDraggingXRef.current = false;
        isDraggingYRef.current = false;
        setIsDraggingX(false);
        setIsDraggingY(false);
        setTimeout(() => setShowCoords(false), 1500);

        // Restore cursor
        document.body.style.cursor = "";
      }
    };

    // Add global event listeners
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    // Cleanup
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
    };
  }, [currentNode, updateNodePosition, zoom]);

  // Handle mouse down on X axis
  const handleMouseDownX = useCallback(
    (e: React.MouseEvent) => {
      if (!currentNode) return;
      e.stopPropagation();
      e.preventDefault();

      // 设置为已交互状态
      setHasInteracted(true);

      isDraggingXRef.current = true;
      setIsDraggingX(true);
      startPositionRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
      nodeStartPositionRef.current = {
        x: currentNode.position.x,
        y: currentNode.position.y,
      };
      setCurrentCoords({
        x: Math.round(currentNode.position.x),
        y: Math.round(currentNode.position.y),
      });
      setShowCoords(true);

      // Hide cursor
      document.body.style.cursor = "none";
    },
    [currentNode]
  );

  // Handle mouse down on Y axis
  const handleMouseDownY = useCallback(
    (e: React.MouseEvent) => {
      if (!currentNode) return;
      e.stopPropagation();
      e.preventDefault();

      // 设置为已交互状态
      setHasInteracted(true);

      isDraggingYRef.current = true;
      setIsDraggingY(true);
      startPositionRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
      nodeStartPositionRef.current = {
        x: currentNode.position.x,
        y: currentNode.position.y,
      };
      setCurrentCoords({
        x: Math.round(currentNode.position.x),
        y: Math.round(currentNode.position.y),
      });
      setShowCoords(true);

      // Hide cursor
      document.body.style.cursor = "none";
    },
    [currentNode]
  );

  // Get node dimensions
  const nodeWidth = currentNode.width || 64;
  const nodeHeight = currentNode.height || 64;

  // Fixed distance for arrowheads from center
  const basicDistance = 20
  const arrowDistance = zoom * (nodeWidth + basicDistance) ;

  // Calculate center position of the node in flow coordinates
  const nodeCenterX = currentNode.position.x + nodeWidth / 2;
  const nodeCenterY = currentNode.position.y;

  // Transform flow coordinates to screen coordinates using the transform from the store
  const screenX = nodeCenterX * zoom + x;
  const screenY = nodeCenterY * zoom + y;

  // Calculate arrowhead positions
  const xArrowX = screenX + arrowDistance;
  const xArrowY = screenY;
  const yArrowX = screenX;
  const yArrowY = screenY - arrowDistance;

  // Define gradient and filter IDs
  const xArrowGradientId = `x-arrow-gradient-${currentNode.id}`;
  const yArrowGradientId = `y-arrow-gradient-${currentNode.id}`;
  const xArrowHoverGradientId = `x-arrow-hover-gradient-${currentNode.id}`;
  const yArrowHoverGradientId = `y-arrow-hover-gradient-${currentNode.id}`;
  const xArrowActiveGradientId = `x-arrow-active-gradient-${currentNode.id}`;
  const yArrowActiveGradientId = `y-arrow-active-gradient-${currentNode.id}`;
  const glowId = `glow-${currentNode.id}`;
  const shadowId = `shadow-${currentNode.id}`;
  const arrowShadowId = `arrow-shadow-${currentNode.id}`;

  // Calculate arrowhead sizes based on state
  const xArrowSize = isDraggingX ? 1.1 : hoverX ? 1.1 : 1;
  const yArrowSize = isDraggingY ? 1.1 : hoverY ? 1.1 : 1;

  // Base arrowhead dimensions
  const arrowWidth = 15;
  const arrowHeight = 30;
  const cornerRadius = 1; // 圆角半径

  // 新的 X 轴箭头路径 - 细腰等腰三角形，圆角
  const xArrowPath = `
    M ${xArrowX} ${xArrowY}
    L ${xArrowX - arrowHeight * xArrowSize * 0.9*zoom} ${xArrowY - arrowWidth * xArrowSize * 0.5*zoom}
    Q ${xArrowX - arrowHeight * xArrowSize*zoom} ${xArrowY - arrowWidth * xArrowSize * 0.5*zoom} 
      ${xArrowX - arrowHeight * xArrowSize*zoom} ${xArrowY - arrowWidth * xArrowSize * 0.5*zoom + cornerRadius}
    L ${xArrowX - arrowHeight * xArrowSize*zoom} ${xArrowY + arrowWidth * xArrowSize * 0.5*zoom - cornerRadius}
    Q ${xArrowX - arrowHeight * xArrowSize*zoom} ${xArrowY + arrowWidth * xArrowSize * 0.5*zoom} 
      ${xArrowX - arrowHeight * xArrowSize * 0.9*zoom} ${xArrowY + arrowWidth * xArrowSize * 0.5*zoom}
    Z
  `;

  // 新的 Y 轴箭头路径 - 细腰等腰三角形，圆角
  const yArrowPath = `
    M ${yArrowX} ${yArrowY}
    L ${yArrowX - arrowWidth * yArrowSize * 0.5*zoom} ${yArrowY + arrowHeight * yArrowSize * 0.9*zoom}
    Q ${yArrowX - arrowWidth * yArrowSize * 0.5*zoom} ${yArrowY + arrowHeight * yArrowSize*zoom} 
      ${yArrowX - arrowWidth * yArrowSize * 0.5 *zoom+ cornerRadius} ${yArrowY + arrowHeight * yArrowSize*zoom}
    L ${yArrowX + arrowWidth * yArrowSize * 0.5*zoom - cornerRadius} ${yArrowY + arrowHeight * yArrowSize*zoom}
    Q ${yArrowX + arrowWidth * yArrowSize * 0.5*zoom} ${yArrowY + arrowHeight * yArrowSize*zoom} 
      ${yArrowX + arrowWidth * yArrowSize * 0.5*zoom} ${yArrowY + arrowHeight * yArrowSize * 0.9*zoom}
    Z
  `;

  // 点击区域路径（比可见箭头略大）
  const xArrowHitPath = `
    M ${xArrowX} ${xArrowY}
    L ${xArrowX - arrowHeight * 1.2*zoom} ${xArrowY - arrowWidth * 0.7*zoom}
    L ${xArrowX - arrowHeight * 1.2*zoom} ${xArrowY + arrowWidth * 0.7*zoom}
    Z
  `;

  const yArrowHitPath = `
    M ${yArrowX} ${yArrowY}
    L ${yArrowX - arrowWidth * 0.7*zoom} ${yArrowY + arrowHeight * 1.2*zoom}
    L ${yArrowX + arrowWidth * 0.7*zoom} ${yArrowY + arrowHeight * 1.2*zoom}
    Z
  `;

  // 替换 Tailwind 样式的容器样式
  const containerStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    overflow: 'visible',
    pointerEvents: 'none',
    zIndex: 5
  };

  // SVG 样式
  const svgStyle: React.CSSProperties = {
    overflow: 'visible',
    width: '100%',
    height: '100%'
  };

  // 计算基础透明度 - 未交互时为0.7，交互后为1
  const baseOpacity = hasInteracted ? 1 : 0.7;

  // X 轴组样式
  const xAxisGroupStyle: React.CSSProperties = {
    opacity: isDraggingY ? 0.3 * baseOpacity : baseOpacity,
    transition: 'opacity 0.2s ease, transform 0.2s ease'
  };

  // Y 轴组样式
  const yAxisGroupStyle: React.CSSProperties = {
    opacity: isDraggingX ? 0.3 * baseOpacity : baseOpacity,
    transition: 'opacity 0.2s ease, transform 0.2s ease'
  };

  // 点击区域样式
  const hitAreaStyle: React.CSSProperties = {
    fill: 'transparent',
    pointerEvents: 'auto',
    cursor: 'ew-resize'
  };

  const hitAreaYStyle: React.CSSProperties = {
    fill: 'transparent',
    pointerEvents: 'auto',
    cursor: 'ns-resize'
  };

  // 箭头样式
  const arrowStyle: React.CSSProperties = {
    pointerEvents: 'none',
    transition: 'fill 0.2s ease, transform 0.2s ease'
  };

  // 文本样式
  const textStyle: React.CSSProperties = {
    fill: 'white',
    fontSize: '14px',
    fontWeight: 'bold',
    textAnchor: 'middle',
    dominantBaseline: 'middle',
    pointerEvents: 'none',
    transition: 'fill 0.2s ease'
  };

  // 坐标显示框样式
  const coordsBoxStyle: React.CSSProperties = {
    pointerEvents: 'none'
  };

  // 坐标文本样式
  const coordsTextStyle: React.CSSProperties = {
    fill: 'white',
    fontSize: '14px',
    fontWeight: '500',
    pointerEvents: 'none'
  };

  // 当鼠标悬停在箭头上时，也视为交互
  const handleMouseEnter = () => {
    setHasInteracted(true);
  };

  return (
    <div style={containerStyle}>
      <svg style={svgStyle}>
        {/* Define gradients and filters */}
        <defs>
          {/* X Arrow Gradient - Brighter Red */}
          <linearGradient id={xArrowGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#ff3333" />
          </linearGradient>

          {/* X Arrow Hover Gradient - Even Brighter */}
          <linearGradient id={xArrowHoverGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff8080" />
            <stop offset="100%" stopColor="#ff4d4d" />
          </linearGradient>

          {/* X Arrow Active Gradient - Most Vibrant */}
          <linearGradient id={xArrowActiveGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff9999" />
            <stop offset="100%" stopColor="#ff6666" />
          </linearGradient>

          {/* Y Arrow Gradient - Brighter Blue */}
          <linearGradient id={yArrowGradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#42a5f5" />
            <stop offset="100%" stopColor="#1e88e5" />
          </linearGradient>

          {/* Y Arrow Hover Gradient - Even Brighter */}
          <linearGradient id={yArrowHoverGradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#64b5f6" />
            <stop offset="100%" stopColor="#2196f3" />
          </linearGradient>

          {/* Y Arrow Active Gradient - Most Vibrant */}
          <linearGradient id={yArrowActiveGradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#90caf9" />
            <stop offset="100%" stopColor="#42a5f5" />
          </linearGradient>

          {/* Center Point Glow */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#64b5f6" floodOpacity="0.7" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>

          {/* Shadow for elements */}
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
          </filter>

          {/* Shadow for arrows */}
          <filter id={arrowShadowId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* X Arrowhead (Red) */}
        <g style={xAxisGroupStyle}>
          {/* Invisible hit area for X arrowhead */}
          <path
            d={xArrowHitPath}
            style={hitAreaStyle}
            onMouseDown={handleMouseDownX}
            onMouseEnter={() => {
              setHoverX(true);
              handleMouseEnter();
            }}
            onMouseLeave={() => setHoverX(false)}
          />

          {/* Visible X arrowhead */}
          <path
            d={xArrowPath}
            fill={
              isDraggingX
                ? `url(#${xArrowActiveGradientId})`
                : hoverX
                  ? `url(#${xArrowHoverGradientId})`
                  : `url(#${xArrowGradientId})`
            }
            filter={`url(#${arrowShadowId})`}
            style={arrowStyle}
          />

          {/* X Axis Label */}
          <text
            x={xArrowX - arrowHeight * xArrowSize * 0.5}
            y={xArrowY + 2}
            filter={`url(#${shadowId})`}
            style={textStyle}
          >

          </text>
        </g>

        {/* Y Arrowhead (Blue) */}
        <g style={yAxisGroupStyle}>
          {/* Invisible hit area for Y arrowhead */}
          <path
            d={yArrowHitPath}
            style={hitAreaYStyle}
            onMouseDown={handleMouseDownY}
            onMouseEnter={() => {
              setHoverY(true);
              handleMouseEnter();
            }}
            onMouseLeave={() => setHoverY(false)}
          />

          {/* Visible Y arrowhead */}
          <path
            d={yArrowPath}
            fill={
              isDraggingY
                ? `url(#${yArrowActiveGradientId})`
                : hoverY
                  ? `url(#${yArrowHoverGradientId})`
                  : `url(#${yArrowGradientId})`
            }
            filter={`url(#${arrowShadowId})`}
            style={arrowStyle}
          />

          {/* Y Axis Label */}
          <text
            x={yArrowX}
            y={yArrowY + arrowHeight * yArrowSize * 0.5}
            filter={`url(#${shadowId})`}
            style={textStyle}
          >

          </text>
        </g>

        {/* Center Point with enhanced glow effect */}
        <circle
          cx={screenX}
          cy={screenY}
          r={3}
          fill="#2196f3"
          style={{ pointerEvents: 'none', opacity: baseOpacity }}
          filter={`url(#${glowId})`}
        />

        {/* Coordinate Display with improved styling */}
        {showCoords && (
          <g style={coordsBoxStyle}>
            <rect
              x={screenX + 15}
              y={screenY + 15}
              width={100}
              height={50}
              rx={8}
              fill="rgba(0,0,0,0.75)"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth={1}
              filter={`url(#${shadowId})`}
              style={{ pointerEvents: 'none' }}
            />
            <text
              x={screenX + 30}
              y={screenY + 40}
              style={coordsTextStyle}
            >
              X: {currentCoords.x}
            </text>
            <text
              x={screenX + 30}
              y={screenY + 55}
              style={coordsTextStyle}
            >
              Y: {currentCoords.y}
            </text>
          </g>
        )}
      </svg>
    </div>
  );
}