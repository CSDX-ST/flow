"use client"

import { useState, useCallback } from "react"
import type { Node, Edge } from "@xyflow/react"

/**
 * 流程图状态接口
 * 包含节点和边的完整状态信息
 */
interface FlowState {
  nodes: Node[]
  edges: Edge[]
}

/**
 * 撤销重做管理器接口
 * 定义了撤销重做功能的完整API
 */
export interface UndoRedoManager {
  /** 保存当前状态到历史记录 */
  saveState: (nodes: Node[], edges: Edge[]) => void
  /** 撤销到上一个状态，返回null表示无法撤销 */
  undo: () => FlowState | null
  /** 重做到下一个状态，返回null表示无法重做 */
  redo: () => FlowState | null
  /** 是否可以执行撤销操作 */
  canUndo: boolean
  /** 是否可以执行重做操作 */
  canRedo: boolean
  /** 当前状态的副本 */
  currentState: FlowState
  /** 防抖保存状态，避免频繁操作时过多保存 */
  debouncedSaveState: (nodes: Node[], edges: Edge[]) => void
  /** 清空历史记录并重置为初始状态 */
  clear: () => void
  /** 获取当前历史记录的长度 */
  getHistoryLength: () => number
}

/**
 * 独立的撤销重做管理器类
 *
 * 核心特性：
 * - 基于历史栈的状态管理
 * - 支持分支历史处理（撤销后进行新操作会截断后续历史）
 * - 内置防抖机制避免频繁保存
 * - 可配置的历史记录数量限制
 * - 完整的生命周期管理
 *
 * @example
 * ```typescript
 * const manager = new UndoRedoManagerClass([], [], 100);
 * manager.saveState(nodes, edges);
 * const previousState = manager.undo();
 * ```
 */
export class UndoRedoManagerClass {
  /** 历史状态栈，存储所有的流程图状态 */
  private history: FlowState[] = []

  /** 当前状态在历史栈中的索引位置 */
  private currentIndex = 0

  /** 最大历史记录数量，超出时会移除最早的记录 */
  private maxHistorySize = 50

  /** 防抖保存的定时器引用 */
  private saveTimeoutRef: NodeJS.Timeout | null = null

  /** 防抖延迟时间（毫秒） */
  private debounceDelay = 500

  /**
   * 构造函数
   * @param initialNodes 初始节点数组
   * @param initialEdges 初始边数组
   * @param maxHistorySize 最大历史记录数量，默认50
   */
  constructor(initialNodes: Node[] = [], initialEdges: Edge[] = [], maxHistorySize = 50) {
    this.history = [{ nodes: initialNodes, edges: initialEdges }]
    this.currentIndex = 0
    this.maxHistorySize = maxHistorySize
  }

  /**
   * 保存当前状态到历史记录
   *
   * 实现逻辑：
   * 1. 截断当前索引后的所有历史（处理分支历史）
   * 2. 添加新状态到历史栈
   * 3. 限制历史记录数量，超出时移除最早记录
   *
   * @param nodes 当前节点数组
   * @param edges 当前边数组
   */
  saveState = (nodes: Node[], edges: Edge[]): void => {
    this.history = this.history.slice(0, this.currentIndex + 1)

    this.history.push({ nodes: [...nodes], edges: [...edges] })

    if (this.history.length > this.maxHistorySize) {
      this.history.shift() // 移除最早的记录
    } else {
      this.currentIndex++ // 只有在未达到上限时才增加索引
    }
  }

  /**
   * 防抖保存状态
   *
   * 用于避免用户快速连续操作时产生过多的历史记录
   * 只有在指定延迟时间内没有新的保存请求时才真正执行保存
   *
   * @param nodes 当前节点数组
   * @param edges 当前边数组
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
   *
   * @returns 上一个状态的副本，如果无法撤销则返回null
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
   *
   * @returns 下一个状态的副本，如果无法重做则返回null
   */
  redo = (): FlowState | null => {
    if (this.currentIndex < this.history.length - 1) {
      this.currentIndex++
      return { ...this.history[this.currentIndex] }
    }
    return null
  }

  /**
   * 检查是否可以执行撤销操作
   * @returns 当前不在历史记录起始位置时返回true
   */
  get canUndo(): boolean {
    return this.currentIndex > 0
  }

  /**
   * 检查是否可以执行重做操作
   * @returns 当前不在历史记录末尾位置时返回true
   */
  get canRedo(): boolean {
    return this.currentIndex < this.history.length - 1
  }

  /**
   * 获取当前状态的副本
   * @returns 当前状态的深拷贝
   */
  get currentState(): FlowState {
    return { ...this.history[this.currentIndex] }
  }

  /**
   * 清空所有历史记录并重置为初始状态
   *
   * @param initialNodes 新的初始节点数组，默认为空
   * @param initialEdges 新的初始边数组，默认为空
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
   * 获取当前历史记录的总数量
   * @returns 历史记录数量
   */
  getHistoryLength = (): number => {
    return this.history.length
  }

  /**
   * 设置防抖延迟时间
   * @param delay 新的延迟时间（毫秒）
   */
  setDebounceDelay = (delay: number): void => {
    this.debounceDelay = delay
  }

  /**
   * 销毁管理器实例
   * 清理所有定时器和资源，防止内存泄漏
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
 *
 * 基于UndoRedoManagerClass实现，提供React组件友好的API
 * 自动处理组件重新渲染和状态同步
 *
 * @param initialNodes 初始节点数组
 * @param initialEdges 初始边数组
 * @param maxHistorySize 最大历史记录数量
 * @returns 撤销重做管理器接口
 *
 * @example
 * ```typescript
 * const { saveState, undo, redo, canUndo, canRedo } = useUndoRedoManager(nodes, edges);
 * ```
 */
export const useUndoRedoManager = (
  initialNodes: Node[] = [],
  initialEdges: Edge[] = [],
  maxHistorySize = 50,
): UndoRedoManager => {
  const [manager] = useState(() => new UndoRedoManagerClass(initialNodes, initialEdges, maxHistorySize))

  const [, forceUpdate] = useState({})

  /**
   * 触发组件重新渲染的辅助函数
   * 用于在管理器状态变化时同步React组件状态
   */
  const triggerUpdate = useCallback(() => {
    forceUpdate({})
  }, [])

  const saveState = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      manager.saveState(nodes, edges)
      triggerUpdate() // 立即触发重新渲染以更新canUndo/canRedo状态
    },
    [manager, triggerUpdate],
  )

  const undo = useCallback(() => {
    const result = manager.undo()
    triggerUpdate() // 更新组件状态以反映新的canUndo/canRedo值
    return result
  }, [manager, triggerUpdate])

  const redo = useCallback(() => {
    const result = manager.redo()
    triggerUpdate() // 更新组件状态以反映新的canUndo/canRedo值
    return result
  }, [manager, triggerUpdate])

  const debouncedSaveState = useCallback(
    (nodes: Node[], edges: Edge[]) => {
      manager.debouncedSaveState(nodes, edges)
      // 注意：防抖保存不立即触发更新，会在延迟后通过saveState自动更新
    },
    [manager],
  )

  const clear = useCallback(
    (initialNodes: Node[] = [], initialEdges: Edge[] = []) => {
      manager.clear(initialNodes, initialEdges)
      triggerUpdate() // 重置后更新组件状态
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

/**
 * 向后兼容的Hook导出
 * 保持与原有代码的兼容性
 */
export const useUndoRedo = useUndoRedoManager
