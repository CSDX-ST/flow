"use client"

import { useState, useEffect } from "react"
import { useReactFlow } from "@xyflow/react"
import { ChevronUp, ZoomIn, ZoomOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ZoomSelectProps {
  className?: string
  maxZoom?: number
  minZoom?: number
}

export const ZoomSelect = ({ className = "", maxZoom = 2, minZoom = 0.25 }: ZoomSelectProps) => {
  const { zoomIn, zoomOut, zoomTo, getZoom } = useReactFlow()
  const [currentZoom, setCurrentZoom] = useState(1)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const updateCurrentZoom = () => {
      setCurrentZoom(getZoom())
    }

    // Initialize zoom
    updateCurrentZoom()

    // Set up interval to track zoom changes
    const interval = setInterval(updateCurrentZoom, 100)

    return () => clearInterval(interval)
  }, [getZoom])

  const handleZoomIn = () => {
    const newZoom = Math.min(currentZoom * 1.2, maxZoom)
    zoomTo(newZoom)
  }

  const handleZoomOut = () => {
    const newZoom = Math.max(currentZoom / 1.2, minZoom)
    zoomTo(newZoom)
  }

  const handleZoomToLevel = (zoomLevel: number) => {
    const clampedZoom = Math.max(minZoom, Math.min(maxZoom, zoomLevel))
    zoomTo(clampedZoom)
    setIsOpen(false)
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <button
          className={`
            flex items-center justify-between
            px-3 py-2 w-20
            bg-white border border-gray-200 rounded-lg
            text-sm font-medium text-gray-700
            hover:bg-gray-50 hover:border-gray-300
            focus:outline-none focus:ring-1 focus:ring-blue-400 focus:ring-offset-1
            shadow-sm cursor-pointer
            
            ${className}
          `}
        >
          <span>{Math.floor(currentZoom * 100)}%</span>
          <ChevronUp className={`ml-1 h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="center" className="w-40 bg-white border-0 ">
        <DropdownMenuItem onClick={handleZoomIn} className="flex items-center gap-2 hover:bg-gray-100">
          <ZoomIn className="h-4 w-4" />
          Zoom In
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleZoomOut} className="flex items-center gap-2 hover:bg-gray-100">
          <ZoomOut className="h-4 w-4" />
          Zoom Out
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100" onClick={() => handleZoomToLevel(0.5)}>Zoom to 50%</DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100" onClick={() => handleZoomToLevel(1)}>Zoom to 100%</DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100" onClick={() => handleZoomToLevel(1.5)}>Zoom to 150%</DropdownMenuItem>

        <DropdownMenuItem className="flex items-center gap-2 hover:bg-gray-100" onClick={() => handleZoomToLevel(2)}>Zoom to 200%</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
