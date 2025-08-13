"use client"

import { useState } from "react"
import { Card, CardContent, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Trash2, Edit3, X, ChevronDown } from "lucide-react"

interface Node {
  id: string
  type: string
  label: string
  position: { x: number; y: number }
}

interface AdvancedNodeManagerProps {
  nodes: Node[]
  onAddNode: (type: string, position: { x: number; y: number }) => void
  onDeleteNode: (id: string) => void
  onRenameNode: (id: string, newLabel: string) => void
}

// 支持的节点类型配置
const NODE_TYPES = [
  { type: "input", label: "输入节点", color: "bg-blue-100 text-blue-800", icon: "📥" },
  { type: "add", label: "加法", color: "bg-green-100 text-green-800", icon: "➕" },
  { type: "multiply", label: "乘法", color: "bg-green-100 text-green-800", icon: "✖️" },
  { type: "output", label: "输出节点", color: "bg-orange-100 text-orange-800", icon: "📤" },
]

export default function AdvancedNodeManager({
  nodes,
  onAddNode,
  onDeleteNode,
  onRenameNode,
}: AdvancedNodeManagerProps) {
  // 状态管理
  const [isCollapsed, setIsCollapsed] = useState(false) // 是否折叠
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null) // 正在编辑的节点ID
  const [editingLabel, setEditingLabel] = useState("") // 编辑中的标签

  // 添加节点 - 在随机位置
  const handleAddNode = (type: string) => {
    const randomPosition = {
      x: Math.random() * 400 + 100, // 100-500之间的随机x坐标
      y: Math.random() * 400 + 100, // 100-500之间的随机y坐标
    }
    onAddNode(type, randomPosition)
  }

  // 开始编辑节点名称
  const startEditing = (nodeId: string, currentLabel: string) => {
    setEditingNodeId(nodeId)
    setEditingLabel(currentLabel)
  }

  // 保存编辑
  const saveEdit = () => {
    if (editingNodeId && editingLabel.trim()) {
      onRenameNode(editingNodeId, editingLabel.trim())
    }
    setEditingNodeId(null)
    setEditingLabel("")
  }

  // 取消编辑
  const cancelEdit = () => {
    setEditingNodeId(null)
    setEditingLabel("")
  }

  // 根据节点类型获取颜色
  const getNodeTypeInfo = (nodeType: string) => {
    const typeInfo = NODE_TYPES.find((t) => t.type === nodeType)
    return typeInfo || { color: "bg-gray-100 text-gray-800", icon: "❓", label: "未知" }
  }

  return (
    <Card className="absolute top-4 right-4 z-10 w-80 bg-white shadow-lg border">
      {/* 可折叠的标题栏 */}
      <div
        className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <CardTitle className="text-sm font-medium flex items-center gap-2">🎛️ 节点管理器</CardTitle>
        <div className="flex items-center gap-1">
          <Badge variant="secondary" className="text-xs">
            {nodes.length}
          </Badge>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`} />
        </div>
      </div>

      {/* 可折叠内容 */}
      <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? "max-h-0" : "max-h-96"}`}>
        <CardContent className="pt-0 space-y-4 overflow-y-auto">
          {/* 添加节点区域 */}
          <div>
            <div className="text-xs font-medium text-gray-700 mb-2">🆕 添加新节点</div>
            <div className="grid grid-cols-2 gap-1">
              {NODE_TYPES.map((nodeType) => (
                <Button
                  key={nodeType.type}
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs bg-transparent justify-start"
                  onClick={() => handleAddNode(nodeType.type)}
                >
                  <span className="mr-1">{nodeType.icon}</span>
                  {nodeType.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 现有节点列表 */}
          <div>
            <div className="text-xs font-medium text-gray-700 mb-2">📋 现有节点 ({nodes.length})</div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {nodes.length === 0 ? (
                <div className="text-center text-gray-500 text-xs py-4">暂无节点，点击上方按钮添加</div>
              ) : (
                nodes.map((node) => {
                  const typeInfo = getNodeTypeInfo(node.type)
                  return (
                    <div key={node.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                      <div className="flex items-center space-x-2 flex-1">
                        {/* 节点类型标识 */}
                        <Badge className={`text-xs ${typeInfo.color}`}>
                          <span className="mr-1">{typeInfo.icon}</span>
                          {typeInfo.label}
                        </Badge>

                        {/* 节点名称编辑 */}
                        {editingNodeId === node.id ? (
                          <div className="flex items-center space-x-1 flex-1">
                            <Input
                              value={editingLabel}
                              onChange={(e) => setEditingLabel(e.target.value)}
                              className="h-6 text-xs nodrag"
                              onKeyDown={(e) => {
                                if (e.key === "Enter") saveEdit()
                                if (e.key === "Escape") cancelEdit()
                              }}
                              autoFocus
                            />
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-green-600" onClick={saveEdit}>
                              ✓
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600" onClick={cancelEdit}>
                              <X className="h-3 w-3" />
                            </Button>
                          </div>
                        ) : (
                          <span className="flex-1 truncate font-medium">{node.label}</span>
                        )}
                      </div>

                      {/* 操作按钮 */}
                      {editingNodeId !== node.id && (
                        <div className="flex items-center space-x-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-blue-600 hover:text-blue-800"
                            onClick={() => startEditing(node.id, node.label)}
                            title="重命名"
                          >
                            <Edit3 className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                            onClick={() => onDeleteNode(node.id)}
                            title="删除"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="pt-2 border-t border-gray-200">
            <div className="text-xs text-gray-600 space-y-1">
              <div className="flex justify-between">
                <span>📊 节点统计:</span>
                <span className="font-medium">{nodes.length} 个</span>
              </div>
              <div className="flex justify-between">
                <span>📥 输入节点:</span>
                <span className="font-medium text-blue-600">{nodes.filter((n) => n.type === "input").length}</span>
              </div>
              <div className="flex justify-between">
                <span>🔢 计算节点:</span>
                <span className="font-medium text-green-600">
                  {nodes.filter((n) => n.type === "add" || n.type === "multiply").length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>📤 输出节点:</span>
                <span className="font-medium text-orange-600">{nodes.filter((n) => n.type === "output").length}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
