"use client"

import { useState, useCallback } from "react"
import type { Node, Edge } from "@xyflow/react"

interface FlowState {
  nodes: Node[]
  edges: Edge[]
}

export const useUndoRedo = (initialNodes: Node[] = [], initialEdges: Edge[] = []) => {
  const [history, setHistory] = useState<FlowState[]>([{ nodes: initialNodes, edges: initialEdges }])
  const [currentIndex, setCurrentIndex] = useState(0)

  const saveState = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      setHistory((prev) => {
        // 移除当前索引之后的所有历史记录
        const newHistory = prev.slice(0, currentIndex + 1)
        // 添加新状态
        newHistory.push({ nodes, edges })
        // 限制历史记录数量（最多50个状态）
        if (newHistory.length > 50) {
          newHistory.shift()
          return newHistory
        }
        return newHistory
      })
      setCurrentIndex((prev) => Math.min(prev + 1, 49))
    },
    [currentIndex],
  )

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      return history[currentIndex - 1]
    }
    return null
  }, [currentIndex, history])

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      return history[currentIndex + 1]
    }
    return null
  }, [currentIndex, history])

  const canUndo = currentIndex > 0
  const canRedo = currentIndex < history.length - 1

  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    currentState: history[currentIndex],
  }
}
