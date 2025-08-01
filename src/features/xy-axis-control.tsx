"use client"

import type React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { type Node, useStore } from "@xyflow/react"

// ========== 接口定义 / Interface Definition ==========
interface XYAxisControlProps {
  selectedNode: Node | null
  updateNodePosition: (id: string, newPosition: { x: number; y: number }) => void
}

// ========== 常量定义 / Constants ==========
const CONSTANTS = {
  DEFAULT_NODE_SIZE: 64, // 默认节点尺寸
  BASIC_DISTANCE: 20, // 箭头距离节点中心的基础距离
  ARROW_WIDTH: 15, // 箭头宽度
  ARROW_HEIGHT: 30, // 箭头高度
  CORNER_RADIUS: 1, // 箭头圆角半径
  COORDS_HIDE_DELAY: 1500, // 坐标显示隐藏延迟(ms)
  ARROW_SIZE_SCALE: 1.1, // 悬停/拖拽时箭头放大比例
} as const

export function XYAxisControl({ selectedNode, updateNodePosition }: XYAxisControlProps) {
  // ========== ReactFlow Store 数据获取 / ReactFlow Store Data ==========
  const nodes = useStore((state) => state.nodes)
  const transform = useStore((state) => state.transform)

  // ========== 早期返回检查 / Early Return Check ==========
  // 如果没有选中节点，不渲染任何内容
  if (!selectedNode) return null

  // 获取最新的选中节点数据
  const currentNode = nodes.find((node) => node.id === selectedNode.id) || selectedNode

  // 解构视口变换 [x偏移, y偏移, 缩放比例]
  const [x, y, zoom] = transform || [0, 0, 1]

  // ========== Refs 状态管理 / Refs State Management ==========
  // 使用 Refs 来维护跨渲染的拖拽状态，避免闭包问题
  const isDraggingXRef = useRef(false) // X轴拖拽状态
  const isDraggingYRef = useRef(false) // Y轴拖拽状态
  const startPositionRef = useRef({ x: 0, y: 0 }) // 拖拽开始时的鼠标位置
  const nodeStartPositionRef = useRef({ x: 0, y: 0 }) // 拖拽开始时的节点位置

  // ========== UI 状态管理 / UI State Management ==========
  const [currentCoords, setCurrentCoords] = useState({ x: 0, y: 0 }) // 当前显示的坐标
  const [showCoords, setShowCoords] = useState(false) // 是否显示坐标
  const [hoverX, setHoverX] = useState(false) // X轴箭头悬停状态
  const [hoverY, setHoverY] = useState(false) // Y轴箭头悬停状态
  const [isDraggingX, setIsDraggingX] = useState(false) // X轴拖拽状态（用于UI）
  const [isDraggingY, setIsDraggingY] = useState(false) // Y轴拖拽状态（用于UI）
  const [hasInteracted, setHasInteracted] = useState(false) // 跟踪用户是否与控件交互过

  // ========== 全局事件处理 / Global Event Handlers ==========
  useEffect(() => {
    /**
     * 处理全局鼠标移动事件
     * Handle global mouse move events
     */
    const handleMouseMove = (e: MouseEvent) => {
      // 如果没有在拖拽，直接返回
      if (!isDraggingXRef.current && !isDraggingYRef.current) return
      if (!currentNode) return

      // 标记为已交互状态
      setHasInteracted(true)

      // 计算新位置，基于拖拽开始时的节点位置
      let newPosition = { ...nodeStartPositionRef.current }

      if (isDraggingXRef.current) {
        // 仅沿X轴移动：计算鼠标在X轴上的偏移量，除以缩放比例得到实际偏移
        const dx = (e.clientX - startPositionRef.current.x) / zoom
        newPosition = {
          x: nodeStartPositionRef.current.x + dx,
          y: nodeStartPositionRef.current.y, // Y轴位置保持不变
        }
      }

      if (isDraggingYRef.current) {
        // 仅沿Y轴移动：计算鼠标在Y轴上的偏移量，除以缩放比例得到实际偏移
        const dy = (e.clientY - startPositionRef.current.y) / zoom
        newPosition = {
          x: nodeStartPositionRef.current.x, // X轴位置保持不变
          y: nodeStartPositionRef.current.y + dy,
        }
      }

      // 更新节点位置并显示坐标
      updateNodePosition(currentNode.id, newPosition)
      setCurrentCoords({
        x: Math.round(newPosition.x),
        y: Math.round(newPosition.y),
      })
    }

    /**
     * 处理全局鼠标释放事件
     * Handle global mouse up events
     */
    const handleMouseUp = () => {
      if (isDraggingXRef.current || isDraggingYRef.current) {
        // 重置拖拽状态
        isDraggingXRef.current = false
        isDraggingYRef.current = false
        setIsDraggingX(false)
        setIsDraggingY(false)

        // 延迟隐藏坐标显示
        setTimeout(() => setShowCoords(false), CONSTANTS.COORDS_HIDE_DELAY)

        // 恢复鼠标光标
        document.body.style.cursor = ""
      }
    }

    // 添加全局事件监听器
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    // 清理函数：移除事件监听器并恢复光标
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = ""
    }
  }, [currentNode, updateNodePosition, zoom])

  // ========== 拖拽开始处理 / Drag Start Handlers ==========
  /**
   * 处理X轴箭头的鼠标按下事件
   * Handle mouse down on X axis arrow
   */
  const handleMouseDownX = useCallback(
    (e: React.MouseEvent) => {
      if (!currentNode) return

      e.stopPropagation() // 阻止事件冒泡
      e.preventDefault() // 阻止默认行为

      // 标记为已交互状态
      setHasInteracted(true)

      // 设置X轴拖拽状态
      isDraggingXRef.current = true
      setIsDraggingX(true)

      // 记录拖拽开始时的鼠标位置
      startPositionRef.current = {
        x: e.clientX,
        y: e.clientY,
      }

      // 记录拖拽开始时的节点位置
      nodeStartPositionRef.current = {
        x: currentNode.position.x,
        y: currentNode.position.y,
      }

      // 显示当前坐标
      setCurrentCoords({
        x: Math.round(currentNode.position.x),
        y: Math.round(currentNode.position.y),
      })
      setShowCoords(true)

      // 隐藏鼠标光标，提供更好的拖拽体验
      document.body.style.cursor = "none"
    },
    [currentNode],
  )

  /**
   * 处理Y轴箭头的鼠标按下事件
   * Handle mouse down on Y axis arrow
   */
  const handleMouseDownY = useCallback(
    (e: React.MouseEvent) => {
      if (!currentNode) return

      e.stopPropagation() // 阻止事件冒泡
      e.preventDefault() // 阻止默认行为

      // 标记为已交互状态
      setHasInteracted(true)

      // 设置Y轴拖拽状态
      isDraggingYRef.current = true
      setIsDraggingY(true)

      // 记录拖拽开始时的鼠标位置
      startPositionRef.current = {
        x: e.clientX,
        y: e.clientY,
      }

      // 记录拖拽开始时的节点位置
      nodeStartPositionRef.current = {
        x: currentNode.position.x,
        y: currentNode.position.y,
      }

      // 显示当前坐标
      setCurrentCoords({
        x: Math.round(currentNode.position.x),
        y: Math.round(currentNode.position.y),
      })
      setShowCoords(true)

      // 隐藏鼠标光标，提供更好的拖拽体验
      document.body.style.cursor = "none"
    },
    [currentNode],
  )

  // ========== 位置和尺寸计算 / Position and Size Calculations ==========
  // 获取节点尺寸，如果未定义则使用默认值
  const nodeWidth = currentNode.width || CONSTANTS.DEFAULT_NODE_SIZE
  const nodeHeight = currentNode.height || CONSTANTS.DEFAULT_NODE_SIZE

  // 计算箭头距离节点中心的距离（考虑缩放）
  const arrowDistance = zoom * (nodeWidth + CONSTANTS.BASIC_DISTANCE)

  // 计算节点在流程图坐标系中的中心位置
  const nodeCenterX = currentNode.position.x + nodeWidth / 2
  const nodeCenterY = currentNode.position.y

  // 将流程图坐标转换为屏幕坐标（考虑视口变换）
  const screenX = nodeCenterX * zoom + x
  const screenY = nodeCenterY * zoom + y

  // 计算箭头在屏幕上的位置
  const xArrowX = screenX + arrowDistance // X轴箭头位于节点右侧
  const xArrowY = screenY
  const yArrowX = screenX // Y轴箭头位于节点上方
  const yArrowY = screenY - arrowDistance

  // ========== SVG 元素ID生成 / SVG Element ID Generation ==========
  // 为每个节点生成唯一的渐变和滤镜ID，避免冲突
  const xArrowGradientId = `x-arrow-gradient-${currentNode.id}`
  const yArrowGradientId = `y-arrow-gradient-${currentNode.id}`
  const xArrowHoverGradientId = `x-arrow-hover-gradient-${currentNode.id}`
  const yArrowHoverGradientId = `y-arrow-hover-gradient-${currentNode.id}`
  const xArrowActiveGradientId = `x-arrow-active-gradient-${currentNode.id}`
  const yArrowActiveGradientId = `y-arrow-active-gradient-${currentNode.id}`
  const glowId = `glow-${currentNode.id}`
  const shadowId = `shadow-${currentNode.id}`
  const arrowShadowId = `arrow-shadow-${currentNode.id}`

  // ========== 箭头状态和尺寸 / Arrow State and Size ==========
  // 根据交互状态计算箭头大小
  const xArrowSize = isDraggingX ? CONSTANTS.ARROW_SIZE_SCALE : hoverX ? CONSTANTS.ARROW_SIZE_SCALE : 1
  const yArrowSize = isDraggingY ? CONSTANTS.ARROW_SIZE_SCALE : hoverY ? CONSTANTS.ARROW_SIZE_SCALE : 1

  // ========== SVG 路径生成 / SVG Path Generation ==========
  /**
   * X轴箭头路径 - 细腰等腰三角形，带圆角
   * X-axis arrow path - narrow-waisted isosceles triangle with rounded corners
   */
  const xArrowPath = `
    M ${xArrowX} ${xArrowY}
    L ${xArrowX - CONSTANTS.ARROW_HEIGHT * xArrowSize * 0.9 * zoom} ${xArrowY - CONSTANTS.ARROW_WIDTH * xArrowSize * 0.5 * zoom}
    Q ${xArrowX - CONSTANTS.ARROW_HEIGHT * xArrowSize * zoom} ${xArrowY - CONSTANTS.ARROW_WIDTH * xArrowSize * 0.5 * zoom}
      ${xArrowX - CONSTANTS.ARROW_HEIGHT * xArrowSize * zoom} ${xArrowY - CONSTANTS.ARROW_WIDTH * xArrowSize * 0.5 * zoom + CONSTANTS.CORNER_RADIUS}
    L ${xArrowX - CONSTANTS.ARROW_HEIGHT * xArrowSize * zoom} ${xArrowY + CONSTANTS.ARROW_WIDTH * xArrowSize * 0.5 * zoom - CONSTANTS.CORNER_RADIUS}
    Q ${xArrowX - CONSTANTS.ARROW_HEIGHT * xArrowSize * zoom} ${xArrowY + CONSTANTS.ARROW_WIDTH * xArrowSize * 0.5 * zoom}
      ${xArrowX - CONSTANTS.ARROW_HEIGHT * xArrowSize * 0.9 * zoom} ${xArrowY + CONSTANTS.ARROW_WIDTH * xArrowSize * 0.5 * zoom}
    Z
  `

  /**
   * Y轴箭头路径 - 细腰等腰三角形，带圆角
   * Y-axis arrow path - narrow-waisted isosceles triangle with rounded corners
   */
  const yArrowPath = `
    M ${yArrowX} ${yArrowY}
    L ${yArrowX - CONSTANTS.ARROW_WIDTH * yArrowSize * 0.5 * zoom} ${yArrowY + CONSTANTS.ARROW_HEIGHT * yArrowSize * 0.9 * zoom}
    Q ${yArrowX - CONSTANTS.ARROW_WIDTH * yArrowSize * 0.5 * zoom} ${yArrowY + CONSTANTS.ARROW_HEIGHT * yArrowSize * zoom}
      ${yArrowX - CONSTANTS.ARROW_WIDTH * yArrowSize * 0.5 * zoom + CONSTANTS.CORNER_RADIUS} ${yArrowY + CONSTANTS.ARROW_HEIGHT * yArrowSize * zoom}
    L ${yArrowX + CONSTANTS.ARROW_WIDTH * yArrowSize * 0.5 * zoom - CONSTANTS.CORNER_RADIUS} ${yArrowY + CONSTANTS.ARROW_HEIGHT * yArrowSize * zoom}
    Q ${yArrowX + CONSTANTS.ARROW_WIDTH * yArrowSize * 0.5 * zoom} ${yArrowY + CONSTANTS.ARROW_HEIGHT * yArrowSize * zoom}
      ${yArrowX + CONSTANTS.ARROW_WIDTH * yArrowSize * 0.5 * zoom} ${yArrowY + CONSTANTS.ARROW_HEIGHT * yArrowSize * 0.9 * zoom}
    Z
  `

  /**
   * 点击区域路径（比可见箭头略大，提供更好的用户体验）
   * Hit area paths (slightly larger than visible arrows for better UX)
   */
  const xArrowHitPath = `
    M ${xArrowX} ${xArrowY}
    L ${xArrowX - CONSTANTS.ARROW_HEIGHT * 1.2 * zoom} ${xArrowY - CONSTANTS.ARROW_WIDTH * 0.7 * zoom}
    L ${xArrowX - CONSTANTS.ARROW_HEIGHT * 1.2 * zoom} ${xArrowY + CONSTANTS.ARROW_WIDTH * 0.7 * zoom}
    Z
  `

  const yArrowHitPath = `
    M ${yArrowX} ${yArrowY}
    L ${yArrowX - CONSTANTS.ARROW_WIDTH * 0.7 * zoom} ${yArrowY + CONSTANTS.ARROW_HEIGHT * 1.2 * zoom}
    L ${yArrowX + CONSTANTS.ARROW_WIDTH * 0.7 * zoom} ${yArrowY + CONSTANTS.ARROW_HEIGHT * 1.2 * zoom}
    Z
  `

  // ========== 样式定义 / Style Definitions ==========
  // 容器样式：绝对定位，覆盖整个父容器
  const containerStyle: React.CSSProperties = {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    overflow: "visible",
    pointerEvents: "none", // 容器本身不接收鼠标事件
    zIndex: 5, // 确保在其他元素之上
  }

  // SVG样式：允许溢出，占满容器
  const svgStyle: React.CSSProperties = {
    overflow: "visible",
    width: "100%",
    height: "100%",
  }

  // 计算基础透明度：未交互时为0.7，交互后为1
  const baseOpacity = hasInteracted ? 1 : 0.7

  // X轴组样式：当拖拽Y轴时降低透明度
  const xAxisGroupStyle: React.CSSProperties = {
    opacity: isDraggingY ? 0.3 * baseOpacity : baseOpacity,
    transition: "opacity 0.2s ease, transform 0.2s ease",
  }

  // Y轴组样式：当拖拽X轴时降低透明度
  const yAxisGroupStyle: React.CSSProperties = {
    opacity: isDraggingX ? 0.3 * baseOpacity : baseOpacity,
    transition: "opacity 0.2s ease, transform 0.2s ease",
  }

  // 点击区域样式
  const hitAreaStyle: React.CSSProperties = {
    fill: "transparent",
    pointerEvents: "auto", // 允许接收鼠标事件
    cursor: "ew-resize", // X轴调整光标
  }

  const hitAreaYStyle: React.CSSProperties = {
    fill: "transparent",
    pointerEvents: "auto", // 允许接收鼠标事件
    cursor: "ns-resize", // Y轴调整光标
  }

  // 箭头样式
  const arrowStyle: React.CSSProperties = {
    pointerEvents: "none", // 箭头本身不接收鼠标事件
    transition: "fill 0.2s ease, transform 0.2s ease",
  }

  // 坐标显示相关样式
  const coordsBoxStyle: React.CSSProperties = {
    pointerEvents: "none",
  }

  const coordsTextStyle: React.CSSProperties = {
    fill: "white",
    fontSize: "14px",
    fontWeight: "500",
    pointerEvents: "none",
  }

  /**
   * 处理鼠标悬停事件，标记为已交互
   * Handle mouse enter events, mark as interacted
   */
  const handleMouseEnter = () => {
    setHasInteracted(true)
  }

  // ========== 组件渲染 / Component Render ==========
  return (
    <div style={containerStyle}>
      <svg style={svgStyle}>
        {/* ========== SVG 定义区域 / SVG Definitions ========== */}
        <defs>
          {/* X轴箭头渐变 - 红色系 / X Arrow Gradients - Red Series */}
          <linearGradient id={xArrowGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="100%" stopColor="#ff3333" />
          </linearGradient>
          <linearGradient id={xArrowHoverGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff8080" />
            <stop offset="100%" stopColor="#ff4d4d" />
          </linearGradient>
          <linearGradient id={xArrowActiveGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ff9999" />
            <stop offset="100%" stopColor="#ff6666" />
          </linearGradient>

          {/* Y轴箭头渐变 - 蓝色系 / Y Arrow Gradients - Blue Series */}
          <linearGradient id={yArrowGradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#42a5f5" />
            <stop offset="100%" stopColor="#1e88e5" />
          </linearGradient>
          <linearGradient id={yArrowHoverGradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#64b5f6" />
            <stop offset="100%" stopColor="#2196f3" />
          </linearGradient>
          <linearGradient id={yArrowActiveGradientId} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#90caf9" />
            <stop offset="100%" stopColor="#42a5f5" />
          </linearGradient>

          {/* 滤镜效果 / Filter Effects */}
          {/* 中心点发光效果 */}
          <filter id={glowId} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="#64b5f6" floodOpacity="0.7" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feComposite in="SourceGraphic" in2="glow" operator="over" />
          </filter>
          {/* 元素阴影效果 */}
          <filter id={shadowId} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="0.3" />
          </filter>
          {/* 箭头阴影效果 */}
          <filter id={arrowShadowId} x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="1" dy="1" stdDeviation="1.5" floodOpacity="0.5" />
          </filter>
        </defs>

        {/* ========== X轴箭头组 / X-Axis Arrow Group ========== */}
        <g style={xAxisGroupStyle}>
          {/* X轴不可见点击区域 / X-axis invisible hit area */}
          <path
            d={xArrowHitPath}
            style={hitAreaStyle}
            onMouseDown={handleMouseDownX}
            onMouseEnter={() => {
              setHoverX(true)
              handleMouseEnter()
            }}
            onMouseLeave={() => setHoverX(false)}
          />
          {/* X轴可见箭头 / X-axis visible arrow */}
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
        </g>

        {/* ========== Y轴箭头组 / Y-Axis Arrow Group ========== */}
        <g style={yAxisGroupStyle}>
          {/* Y轴不可见点击区域 / Y-axis invisible hit area */}
          <path
            d={yArrowHitPath}
            style={hitAreaYStyle}
            onMouseDown={handleMouseDownY}
            onMouseEnter={() => {
              setHoverY(true)
              handleMouseEnter()
            }}
            onMouseLeave={() => setHoverY(false)}
          />
          {/* Y轴可见箭头 / Y-axis visible arrow */}
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
        </g>

        {/* ========== 中心点 / Center Point ========== */}
        <circle
          cx={screenX}
          cy={screenY}
          r={3}
          fill="#2196f3"
          style={{ pointerEvents: "none", opacity: baseOpacity }}
          filter={`url(#${glowId})`}
        />

        {/* ========== 坐标显示 / Coordinate Display ========== */}
        {showCoords && (
          <g style={coordsBoxStyle}>
            {/* 坐标背景框 / Coordinate background box */}
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
              style={{ pointerEvents: "none" }}
            />
            {/* X坐标文本 / X coordinate text */}
            <text x={screenX + 30} y={screenY + 40} style={coordsTextStyle}>
              X: {currentCoords.x}
            </text>
            {/* Y坐标文本 / Y coordinate text */}
            <text x={screenX + 30} y={screenY + 55} style={coordsTextStyle}>
              Y: {currentCoords.y}
            </text>
          </g>
        )}
      </svg>
    </div>
  )
}
