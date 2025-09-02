"use client"

import { useState, useCallback } from "react"
import { useReactFlow, useStoreApi, Panel, MiniMap, Background } from "@xyflow/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Maximize, Map, Grid3X3, MousePointer, Move, Plus, Undo, Redo, Workflow } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ZoomSelect } from "@/components/zoom-select"

interface ReactFlowToolsProps {
  onAddNode?: () => void
  readonly?: boolean
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
  onEdgeTypeChange?: (edgeType: EdgeType) => void
}

export type EdgeType = "default" | "step" | "straight" | "smoothstep"

const edgeTypeNames: Record<EdgeType, string> = {
  default: "贝塞尔",
  step: "阶梯",
  straight: "直线",
  smoothstep: "平滑阶梯",
}

export const ReactFlowTools = ({
  onAddNode,
  readonly = false,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
  onEdgeTypeChange,
}: ReactFlowToolsProps) => {
  const { fitView } = useReactFlow()
  const store = useStoreApi()
  const [minimapVisible, setMinimapVisible] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [backgroundVisible, setBackgroundVisible] = useState(true)
  const [interactionMode, setInteractionMode] = useState<"selection" | "pan">("selection")
  const [edgeType, setEdgeType] = useState<EdgeType>("default")

  const handleEdgeTypeChange = useCallback(() => {

    const edgeTypes: EdgeType[] = ["default", "step", "straight", "smoothstep"]
    const currentIndex = edgeTypes.indexOf(edgeType)
    const nextIndex = (currentIndex + 1) % edgeTypes.length
    const newType = edgeTypes[nextIndex]

    setEdgeType(newType)
    if (onEdgeTypeChange) {
      onEdgeTypeChange(newType)
    }
  }, [edgeType, onEdgeTypeChange])

  const handleFitView = useCallback(() => {
    fitView({ padding: 0.1 })
  }, [fitView])

  const toggleInteractionMode = useCallback(() => {
    const newMode = interactionMode === "selection" ? "pan" : "selection"
    setInteractionMode(newMode)

    store.setState({
      nodesDraggable: newMode === "selection",
      nodesConnectable: newMode === "selection",
      elementsSelectable: newMode === "selection",
      panOnDrag: newMode === "pan",
    })
  }, [interactionMode, store])

  const handleUndo = useCallback(() => {
    if (onUndo && canUndo) {
      onUndo()
    }
  }, [onUndo, canUndo])

  const handleRedo = useCallback(() => {
    if (onRedo && canRedo) {
      onRedo()
    }
  }, [onRedo, canRedo])

  const minimapStyle = {
    backgroundColor: "rgba(248, 250, 252, 0.95)", // 半透明背景
    border: "2px solid #e2e8f0", // 边框颜色和宽度
    borderRadius: "12px", // 容器圆角
    backdropFilter: "blur(12px)", // 背景模糊效果
    // boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)", // 阴影效果
    padding: "4px", // 内边距

  }
  return (
    <TooltipProvider>
      <Panel position="bottom-center" className="flex items-center gap-2 bg-white rounded-lg p-1 shadow-lg mb-6! border border-gray-400/60 z-10!">

        <Separator orientation="vertical" className="h-6" />
        {/*切换模式*/}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={interactionMode === "selection" ? "default" : "outline"}
              size="sm"
              onClick={toggleInteractionMode}
              disabled={readonly}
              className="h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-100 focus:outline-none"
            >
              {interactionMode === "selection" ? <MousePointer className="h-4 w-4" /> : <Move className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUndo}
              disabled={readonly || !canUndo}
              className="h-8 w-8 p-0 flex-shrink-0 bg-transparent"
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRedo}
              disabled={readonly || !canRedo}
              className="h-8 w-8 p-0 flex-shrink-0 bg-transparent"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {/*切换连线类型*/}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleEdgeTypeChange}
              disabled={readonly}
              className="h-8 px-3 flex items-center gap-1 flex-shrink-0 hover:bg-gray-100 focus:outline-none"
            >
              <Workflow className="h-4 w-4" />
              <span className="text-xs font-medium">{edgeTypeNames[edgeType]}</span>
            </Button>
          </TooltipTrigger>
          {/*<TooltipContent>切换连线类型</TooltipContent>*/}
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

{/*缩放显示*/}
        <ZoomSelect className="h-8 " />


        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFitView}
              disabled={readonly}
              className="h-8 w-8 p-0 flex-shrink-0 bg-transparent hover:bg-gray-100 focus:outline-none"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>

        {/*开启/关闭minimap*/}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMinimapVisible(!minimapVisible)}
              className="h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-100 focus:outline-none "
            >
              <Map className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>

        {/*显示背景网格*/}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={backgroundVisible ? "default" : "outline"}
              size="sm"
              onClick={() => setBackgroundVisible(!backgroundVisible)}
              className="h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-100 focus:outline-none"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
        </Tooltip>

        <Separator orientation="vertical" className="h-6" />

        {onAddNode && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={onAddNode}
                disabled={readonly}
                className="h-8 w-8 p-0 flex-shrink-0 bg-transparent custom-minimap"

              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
          </Tooltip>
        )}
      </Panel>

      {minimapVisible && <MiniMap
          nodeBorderRadius={100}
          bgColor="#66ccff"
          position="bottom-left"
          pannable={true}
          zoomable={true}
          className=" backdrop-blur-sm rounded-lg shadow-sm"
          maskColor="rgba(148, 163, 184, 0)" // 遮罩颜色
          maskStrokeColor="#90b6f5" // 遮罩边框颜色
          maskStrokeWidth={1} // 遮罩边框宽度
          style={minimapStyle}
      />}

      {backgroundVisible && <Background id="1" gap={12} size={1} bgColor="#f0f0f3"  />}
    </TooltipProvider>
  )
}
