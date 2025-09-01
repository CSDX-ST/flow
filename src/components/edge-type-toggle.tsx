"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import type { EdgeType } from "../App"

interface EdgeTypeToggleProps {
  currentType: EdgeType
  onTypeChange: (type: EdgeType) => void
}

const edgeTypes: { type: EdgeType; label: string; description: string }[] = [
  { type: "default", label: "贝塞尔", description: "Bezier curves" },
  { type: "step", label: "阶梯", description: "Step lines" },
  { type: "straight", label: "直线", description: "Straight lines" },
]

export default function EdgeTypeToggle({ currentType, onTypeChange }: EdgeTypeToggleProps) {
  const handleToggle = () => {
    const currentIndex = edgeTypes.findIndex((edge) => edge.type === currentType)
    const nextIndex = (currentIndex + 1) % edgeTypes.length
    onTypeChange(edgeTypes[nextIndex].type)
  }

  const currentEdge = edgeTypes.find((edge) => edge.type === currentType) || edgeTypes[0]

  return (
    <Card className="p-2 bg-card/95 backdrop-blur-sm border shadow-lg">
      <Button
        variant="default"
        size="sm"
        onClick={handleToggle}
        className="min-w-20 text-sm font-medium"
        title={`当前: ${currentEdge.description} - 点击切换`}
      >
        {currentEdge.label}
      </Button>
    </Card>
  )
}
