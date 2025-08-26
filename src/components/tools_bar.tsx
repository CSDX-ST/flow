"use client"

import { useState, useCallback } from "react"
import { useReactFlow, useStoreApi, Panel, MiniMap, Background } from "@xyflow/react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Maximize, Map, Grid3X3, MousePointer, Move, Plus, Undo, Redo } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ZoomSelect } from "@/components/zoom-select"
import { CollapsibleMinimap } from "@/components/collapsible-minimap"

interface ReactFlowToolsProps {
  onAddNode?: () => void
  readonly?: boolean
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
}

export const ReactFlowTools = ({
  onAddNode,
  readonly = false,
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false,
}: ReactFlowToolsProps) => {
  const { fitView } = useReactFlow()
  const store = useStoreApi()
  const [minimapVisible, setMinimapVisible] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [backgroundVisible, setBackgroundVisible] = useState(true)
  const [interactionMode, setInteractionMode] = useState<"selection" | "pan">("selection")

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

  return (
    <TooltipProvider>
      <Panel
        position="bottom-center"
        className="flex items-center gap-2 bg-background border rounded-lg p-2 shadow-lg mb-4"
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={interactionMode === "selection" ? "default" : "outline"}
              size="sm"
              onClick={toggleInteractionMode}
              disabled={readonly}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              {interactionMode === "selection" ? <MousePointer className="h-4 w-4" /> : <Move className="h-4 w-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {interactionMode === "selection" ? "Switch to Pan Mode" : "Switch to Selection Mode"}
          </TooltipContent>
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
          <TooltipContent>Undo</TooltipContent>
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
          <TooltipContent>Redo</TooltipContent>
        </Tooltip>





        <Separator orientation="vertical" className="h-6" />

        <ZoomSelect className="h-8" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              onClick={handleFitView}
              disabled={readonly}
              className="h-8 w-8 p-0 flex-shrink-0 bg-transparent"
            >
              <Maximize className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Fit View</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            {/*按下去无反应？？*/}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="h-8 px-2 flex items-center justify-center bg-card border border-border rounded-lg shadow-lg hover:bg-accent z-50 relative"
            >
              <Map className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Minimap</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={backgroundVisible ? "default" : "outline"}
              size="sm"
              onClick={() => setBackgroundVisible(!backgroundVisible)}
              className="h-8 w-8 p-0 flex-shrink-0"
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Toggle Background</TooltipContent>
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
                className="h-8 w-8 p-0 flex-shrink-0 bg-transparent"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Node</TooltipContent>
          </Tooltip>
        )}
      </Panel>

      {minimapVisible &&
          <MiniMap
          position="bottom-right"
          className="bg-background border rounded"
      />
      }

      {backgroundVisible && <Background id="1" gap={12} size={1} bgColor="#f0f0f3" />}
    </TooltipProvider>
  )
}
