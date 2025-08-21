"use client"

import { useState } from "react"
import { MiniMap } from "@xyflow/react"
import { ChevronUp, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CollapsibleMinimapProps {
  nodeColor?: (node: any) => string
  nodeStrokeWidth?: number
  zoomable?: boolean
  pannable?: boolean
  className?: string
  zoomStep?: number
  offsetScale?: number
}

export function CollapsibleMinimap({
  nodeColor = (node) => {
    switch (node.type) {
      case "input":
        return "#6ede87"
      case "output":
        return "#6865A5"
      default:
        return "#bbbcc0"
    }
  },
  nodeStrokeWidth = 3,
  zoomable = true,
  pannable = true,
  className = "bg-muted h-32",
  zoomStep = 4,
  offsetScale = 3,
}: CollapsibleMinimapProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleMinimap = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className="absolute bottom-0 right-2 z-5">
      {/* Minimap Content */}
      {!isCollapsed && (
        <div className="bg-card  overflow-hidden mb-1">
          <MiniMap
            nodeColor={nodeColor}
            nodeStrokeWidth={nodeStrokeWidth}
            zoomable={zoomable}
            pannable={pannable}
            className={className}
            zoomStep={zoomStep}
            offsetScale={offsetScale}
          />
        </div>
      )}

      {/* Collapse/Expand Button - always visible */}
      <Button
        variant="ghost"
        size="sm"
        onClick={toggleMinimap}
        className="h-8 px-2 flex items-center justify-center bg-card border border-border rounded-lg shadow-lg hover:bg-accent z-50 relative"
      >
        {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
    </div>
  )
}
