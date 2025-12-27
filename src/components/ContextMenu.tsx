"use client"

import type React from "react"

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  // onDuplicate: () => void
  onDelete: () => void
  onAddNode: () => void
  onEditData: () => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  x,
  y,
  onClose,
  // onDuplicate,
  onDelete,
  onAddNode,
  onEditData, // 接收新的回调
}) => (
    <div
        style={{
            position: "absolute",
            left: x,
            top: y,
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "4px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            zIndex: 1000,
            padding: "4px 0",
        }}
    >
        <button
            onClick={onAddNode}
            style={{
                width: "100%",
                padding: "8px 16px",
                border: "none",
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
            添加节点
        </button>
        <button
            onClick={onEditData}
            style={{
                width: "100%",
                padding: "8px 16px",
                border: "none",
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#f0f0f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
            编辑节点
        </button>

        <button
            onClick={onDelete}
            style={{
                width: "100%",
                padding: "8px 16px",
                border: "none",
                background: "transparent",
                textAlign: "left",
                cursor: "pointer",
                color: "#ff4d4f",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#fff1f0")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
            删除节点
        </button>

    </div>
)

export default ContextMenu
