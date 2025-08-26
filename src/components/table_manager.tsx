"use client"

import type React from "react"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CollapsibleSidebarProps {
  children?: React.ReactNode
  defaultCollapsed?: boolean
  width?: string
}

export function CollapsibleTabler({ children, defaultCollapsed = true, width = "w-128" }: CollapsibleSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed)

  return (
    <div
      className={`relative h-full bg-background border-r border-border border-gray-300 transition-all duration-300 z-10 ${
        isCollapsed ? "w-0" : width
      }`}
    >
      {/* Toggle Button */}
      {isCollapsed ?
        <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-14 top-4 z-10 border border-border bg-background p-0 shadow-sm hover:bg-accent rounded-md w-10 h-10"
          >
            {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="h-6 w-6" />}
          </Button>
          :null
        }


      {/* Sidebar Content */}
      <div
        className={`h-full p-4 transition-opacity duration-300 z-100 bg-white ${
          isCollapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {isCollapsed ?
          null:<Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute right-2 top-4 z-10 border border-border bg-background p-0 shadow-sm hover:bg-accent rounded-md w-10 h-10"
          >
            {isCollapsed ? <ChevronRight className="w-6 h-6" /> : <ChevronLeft className="h-6 w-6" />}
          </Button>
          }

        {children || <div className="text-sm text-muted-foreground z-10">Sidebar content goes here</div>}
      </div>

      {/* Collapsed State Indicator */}
      {isCollapsed && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 rotate-90 text-xs text-muted-foreground whitespace-nowrap">

        </div>
      )}
    </div>
  )
}
