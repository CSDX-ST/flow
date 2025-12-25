"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Handle, Position, NodeToolbar, useReactFlow } from "@xyflow/react"
import { useToolbarContext } from "../ToolbarContext"

interface ActivityNodeData {
  id: string
  position: { x: number; y: number }
  data: Record<string, unknown>

  name: string // 工作名称
  duration: number //持续时间（天）
  es: number // 最早开始时间
  ef: number // 最早完成时间
  ls?: number // 最迟开始时间（可选）
  lf?: number // 最迟完成时间（可选）
  totalFloat?: number // 总时差（可选）
  freeFloat?: number // 自由时差（可选）
  isCritical?: boolean // 是否为关键工作
  predecessors?: string[] // 紧前工作id列表

  taskName: string
  taskType: "approval" | "execution" | "condition"
  assignee: string
  label: string
  value: number

  forceToolbarVisible: boolean
}

// 自定义圆形节点组件
const ActivityNode = ({ data, selected, id }: { data: ActivityNodeData; selected: boolean; id: string }) => {
  const {
      name,
      duration,
      es,
      ef,
      ls,
      lf,
      totalFloat,
      freeFloat,
      isCritical = false,
      forceToolbarVisible = false,
    } = data,
    { isToolbarEnabled } = useToolbarContext()

  const [isEditing, setIsEditing] = useState(false)
  const [labelValue, setLabelValue] = useState(data.label as string)
  const inputRef = useRef<HTMLInputElement>(null)
  const { setNodes } = useReactFlow()

  // 自动聚焦输入框
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [isEditing])

  // 双击进入编辑模式
  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsEditing(true)
  }

  // 保存标签并退出编辑模式
  const handleSave = () => {
    setIsEditing(false)
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: labelValue,
            },
          }
        }
        return node
      }),
    )
  }

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave()
    } else if (e.key === "Escape") {
      setLabelValue(data.label as string)
      setIsEditing(false)
    }
  }

  // 失去焦点时保存
  const handleBlur = () => {
    handleSave()
  }
  // </CHANGE>

  return (
    <div
      style={{
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        backgroundColor: selected ? "#ffd591" : "#fff",
        border: `2px solid ${selected ? "#ffa940" : "#d9d9d9"}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        transition: "all 0.2s ease",
        overflow: "visible",
        position: "relative",
        cursor: "pointer",
      }}
      onDoubleClick={handleDoubleClick} // 添加双击事件
    >
      <NodeToolbar isVisible={isToolbarEnabled} position={Position.Top}>
        <div style={{ textAlign: "center", marginBottom: "4px" }}>{/*<strong>{name}</strong>*/}</div>
        <div
          style={{
            fontSize: "12px",
            lineHeight: "1.4",
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gridTemplateRows: "auto auto",
            gap: "0",
          }}
        >
          {/* 第1行 */}
          <div
            style={{
              padding: "2px",
              borderRight: "1px solid #bbb",
              borderBottom: "1px solid #bbb",
            }}
          >
            ES：{es}
          </div>
          <div
            style={{
              padding: "2px",
              borderRight: "1px solid #bbb",
              borderBottom: "1px solid #bbb",
            }}
          >
            EF：{ef}
          </div>
          <div
            style={{
              padding: "2px",
              borderBottom: "1px solid #bbb",
            }}
          >
            TF：{totalFloat}
          </div>

          {/* 第2行 */}
          <div
            style={{
              padding: "2px",
              borderRight: "1px solid #bbb",
            }}
          >
            LS：{ls}
          </div>
          <div
            style={{
              padding: "2px",
              borderRight: "1px solid #bbb",
            }}
          >
            LF：{lf}
          </div>
          <div
            style={{
              padding: "2px",
            }}
          >
            FF：{freeFloat}
          </div>
        </div>
      </NodeToolbar>

      {/* 左侧输入桩：连接紧前工作 */}
      <Handle type="target" position={Position.Left} id="left" style={{ background: "#888", visibility: "hidden" }} />

      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={labelValue}
          onChange={(e) => setLabelValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
          style={{
            width: "50px",
            height: "50px",
            textAlign: "center",
            fontSize: "24px",
            fontWeight: 500,
            color: selected ? "#874d00" : "#595959",
            border: "none",
            background: "transparent",
            outline: "none",
            cursor: "text",
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <div
          style={{
            fontSize: "24px",
            fontWeight: 500,
            color: selected ? "#874d00" : "#595959",
          }}
        >
          {data.label as string}
        </div>
      )}
      {/* </CHANGE> */}

      {/* 右侧输出桩：连接紧后工作 */}
      <Handle type="source" position={Position.Right} id="right" style={{ background: "#888", visibility: "hidden" }} />
    </div>
  )
}

export default ActivityNode
