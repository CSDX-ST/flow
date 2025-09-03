"use client"

import { useState, useCallback } from "react"
import type { Node, Edge } from "@xyflow/react"

interface FlowState {
  nodes: Node[]
  edges: Edge[]
}

export interface UndoRedoManager {
  saveState: (nodes: Node[], edges: Edge[]) => void
  undo: () => FlowState | null
  redo: () => FlowState | null
  canUndo: boolean
  canRedo: boolean
  currentState: FlowState
  debouncedSaveState: (nodes: Node[], edges: Edge[]) => void
  clear: () => void
  getHistoryLength: () => number
}

/**
 * 独立的撤销重做管理器
 * 提供完整的撤销重做功能，包括状态管理、防抖保存等
 */
export class UndoRedoManagerClass {
  private history: FlowState[] = []
  private currentIndex = 0
  private maxHistorySize = 50
  private saveTimeoutRef: NodeJS.Timeout | null = null
  private debounceDelay = 500

  constructor(initialNodes: Node[] = [], initialEdges: Edge[] = [], maxHistorySize = 50) {
    this.history = [{ nodes: initialNodes, edges: initialEdges }]
    this.currentIndex = 0
    this.maxHistorySize = maxHistorySize
  }

  /**
   * 保存当前状态到历史记录
   */
  saveState = (nodes: Node[], edges: Edge[]): void => {
    // 移除当前索引之后的所有历史记录（处理分支历史）
    this.history = this.history.slice(0, this.currentIndex + 1)

    // 添加新状态
    this.history.push({ nodes: [...nodes], edges: [...edges] })

    // 限制历史记录数量
    if (this.history.length > this.maxHistorySize) {
      this.history.shift()
    } else {
      this.currentIndex++
    }
  }

  /**
   * 防抖保存状态，避免频繁操作时过多保存
   */
  debouncedSaveState = (nodes: Node[], edges: Edge[]): void => {
    if (this.saveTimeoutRef) {
      clearTimeout(this.saveTimeoutRef)
    }
    this.saveTimeoutRef = setTimeout(() => {
      this.saveState(nodes, edges)
    }, this.debounceDelay)
  }

  /**
   * 撤销到上一个状态
   */
  undo = (): FlowState | null => {
    if (this.currentIndex > 0) {
      this.currentIndex--
      return { ...this.history[this.currentIndex] }
    }
    return null
  }

  /**
   * 重做到下一个状态
   */
  redo = (): FlowState | null => {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++
      return { ...this.history[this.currentIndex] }
    }
    return null
  }

  /**
   * 是否可以撤销
   */
  get canUndo(): boolean {
    return this.currentIndex > 0
  }

  /**
   * 是否可以重做
   */
  get canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  /**
   * 获取当前状态
   */
  get currentState(): FlowState {
    return { ...this.history[this.currentIndex] }
  }

  /**
   * 清空历史记录
   */
  clear = (initialNodes: Node[] = [], initialEdges: Edge[] = []): void => {
    this.history = [{ nodes: initialNodes, edges: initialEdges }]
    this.currentIndex = 0
    if (this.saveTimeoutRef) {
      clearTimeout(this.saveTimeoutRef)
      this.saveTimeoutRef = null
    }
  }

  /**
   * 获取历史记录长度
   */
  getHistoryLength = (): number => {
    return this.history.length
  }

  /**
   * 设置防抖延迟时间
   */
  setDebounceDelay = (delay: number): void => {
    this.debounceDelay = delay
  }

  /**
   * 销毁管理器，清理定时器
   */
  destroy = (): void => {
    if (this.saveTimeoutRef) {
      clearTimeout(this.saveTimeoutRef)
      this.saveTimeoutRef = null
    }
  }
}

/**
 * React Hook 版本的撤销重做管理器
 * 基于独立的管理器类实现
 */
export const useUndoRedoManager = (
  initialNodes: Node[] = [],
  initialEdges: Edge[] = [],
  maxHistorySize = 50,
): UndoRedoManager => {
  const [manager] = useState(() => new UndoRedoManagerClass(initialNodes, initialEdges, maxHistorySize))
  const [, forceUpdate] = useState({})

  // 强制组件重新渲染的函数
  const triggerUpdate = useCallback(() => {
    forceUpdate({})
  }, [])

  // 包装方法以触发重新渲染
  const saveState = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      manager.saveState(nodes, edges)
      triggerUpdate()
    },
    [manager, triggerUpdate],
  )

  const undo = useCallback(() => {
    const result = manager.undo()
    triggerUpdate()
    return result
  }, [manager, triggerUpdate])

  const redo = useCallback(() => {
    const result = manager.redo()
    triggerUpdate()
    return result
  }, [manager, triggerUpdate])

  const debouncedSaveState = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      manager.debouncedSaveState(nodes, edges)
      // 注意：防抖保存不立即触发更新，会在延迟后自动更新
    },
    [manager],
  )

  const clear = useCallback(
    (initialNodes: Node[] = [], initialEdges: Edge[] = []) => {
      manager.clear(initialNodes, initialEdges)
      triggerUpdate()
    },
    [manager, triggerUpdate],
  )

  return {
    saveState,
    undo,
    redo,
    canUndo: manager.canUndo,
    canRedo: manager.canRedo,
    currentState: manager.currentState,
    debouncedSaveState,
    clear,
    getHistoryLength: manager.getHistoryLength,
  }
}

// 导出原有的 Hook 以保持向后兼容
export const useUndoRedo = useUndoRedoManager
