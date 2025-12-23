"use client"

import { useReactFlow } from "@xyflow/react"
import { useCallback, useState,useMemo} from "react"
import type { Node ,} from "@xyflow/react"
import {useNodesState} from "@xyflow/react"
import { useToolbarContext } from './ToolbarContext';

import { Card, CardContent, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Plus, Trash2, Edit3, X, ChevronDown, Settings, Focus} from "lucide-react"

import initialNodes from "../components/Initial/initialNodes";
interface NodeManagerProps {
  nodes: Node[]
  onAddNode: (type: string, position: { x: number; y: number }) => void
  onDeleteNode: (nodeId: string) => void
  onRenameNode: (nodeId: string, newLabel: string) => void
}

// 定义节点类型配置数组，包含各类节点的基本信息
const nodeTypes = [
  { type: "input", label: "输入节点", color: "bg-blue-100 text-blue-800" },
  { type: "add", label: "加法", color: "bg-green-100 text-green-800" },
  { type: "subtract", label: "减法", color: "bg-green-100 text-green-800" },
  { type: "multiply", label: "乘法", color: "bg-green-100 text-green-800" },
  { type: "divide", label: "除法", color: "bg-green-100 text-green-800" },
  { type: "square", label: "平方", color: "bg-green-100 text-green-800" },
  { type: "formula", label: "自定义公式", color: "bg-purple-100 text-purple-800" },
  { type: "output", label: "输出节点", color: "bg-orange-100 text-orange-800" },
]


// 导出NodeManager组件
export default function NodeManager({ nodes, onAddNode, onDeleteNode, onRenameNode }: NodeManagerProps) {
  // 管理当前正在编辑的节点ID
  const [editingNode, setEditingNode] = useState<string | null>(null)
  // 管理编辑框中的节点标签文本
  const [editLabel, setEditLabel] = useState("")
  // 管理节点列表是否折叠的状态
  const [isCollapsed, setIsCollapsed] = useState(false)


  // console.log(nodes.length,typeof nodes)
  const handleAddNode = (type: string) => {
    // 随机位置添加节点
    const position = {
      x: Math.random() * 400 + 200,
      y: Math.random() * 400 + 200,
    }
    onAddNode(type, position)
  }

  const rf = useReactFlow()
  const [filter, setFilter] = useState<string>("")

  const focusNode = useCallback(
    (id: string) => {
      const node = nodes.find((n) => n.id === id)
      if (!node) return
      rf.setCenter(node.position.x + 100, node.position.y + 50, { zoom: 1.2, duration: 400 })
      rf.setNodes((nds) =>
        nds.map((n) => ({
          ...n,
          selected: n.id === id,
        })),
      )
    },
    [nodes, rf],
  )
  const startEditing = (nodeId: string, currentLabel: string) => {
    setEditingNode(nodeId)
    setEditLabel(currentLabel)
  }

  const saveEdit = () => {
    if (editingNode && editLabel.trim()) {
      onRenameNode(editingNode, editLabel.trim())
    }
    setEditingNode(null)
    setEditLabel("")
  }

  const cancelEdit = () => {
    setEditingNode(null)
    setEditLabel("")
  }

  /**
   * 根据节点类型获取对应的颜色样式
   * @param nodeType 节点类型
   * @returns 颜色样式类名
   */
  const getNodeTypeColor = (nodeType: string) => {
    switch (nodeType) {
      case "inputNode":
        return "bg-blue-100 text-blue-800"
      case "calculationNode":
        return "bg-green-100 text-green-800"
      case "formulaNode":
        return "bg-purple-100 text-purple-800"
      case "outputNode":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }
  const { isToolbarEnabled, setIsToolbarEnabled } = useToolbarContext();
  // console.log('isToolbarEnabled: ',isToolbarEnabled)

  return (
    <Card className="absolute top-4 right-4 z-10 w-80 bg-white shadow-lg border-0 ">
      {/* 标题栏 */}
      <div
        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <CardTitle className="text-sm font-medium flex items-center gap-2 select-none">
          <Settings className="h-4 w-4" />
          节点面板
        </CardTitle>
        <div className="flex items-center gap-1">

          <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded select-none">{nodes.length}</span>
          <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isCollapsed ? "" : "rotate-180"}`}/>
        </div>
      </div>

      {/* 可折叠内容 */}
      <div className={`overflow-hidden transition-all duration-300 ${isCollapsed ? "max-h-0" : "max-h-96"}`}>
        <CardContent className="pt-2 space-y-2 pr-4 overflow-y-scroll">
          {/* 添加节点区域 */}

          {/*<div>*/}
          {/*  <div className="text-xs font-medium text-gray-700 mb-2">添加新节点</div>*/}
          {/*  <div className="grid grid-cols-2 gap-1">*/}
          {/*    {nodeTypes.map((nodeType) => (*/}
          {/*      <Button*/}
          {/*        key={nodeType.type}*/}
          {/*        size="sm"*/}
          {/*        variant="outline"*/}
          {/*        className="h-8 text-xs bg-transparent"*/}
          {/*        onClick={() => handleAddNode(nodeType.type)}*/}
          {/*      >*/}
          {/*        <Plus className="h-3 w-3 mr-1" />*/}
          {/*        {nodeType.label}*/}
          {/*      </Button>*/}
          {/*    ))}*/}
          {/*  </div>*/}
          {/*</div>*/}

          {/* 现有节点列表 */}
          <div>
            <input
                type="checkbox"
                id="enableNodeToolbar"
                checked={isToolbarEnabled}
                onChange={(e) => setIsToolbarEnabled(e.target.checked)}
            />
            {/*<div className="text-xs font-medium text-gray-700 mb-2">现有节点 ({nodes.length})</div>*/}
            <div className="space-y-1 max-h-82 ">

              {nodes.map((node) => (
                  <div key={node.id} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                    <div className="flex items-center space-x-2 flex-1">
                      <Badge className={`text-xs select-none ${getNodeTypeColor(node.type!)}`}>
                        {node.type === "inputNode"
                            ? "输入"
                            : node.type === "calculationNode"
                                ? "计算"
                                : node.type === "formulaNode"
                                    ? "公式"
                                    : "输出"}
                      </Badge>
                      {editingNode === node.id ? (
                          <div className="flex items-center space-x-1 flex-1">
                            <Input
                                value={editLabel}
                                onChange={(e) => setEditLabel(e.target.value)}
                                className="h-6 text-xs nodrag"
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") saveEdit()
                                  if (e.key === "Escape") cancelEdit()
                                }}
                                autoFocus
                            />
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={saveEdit}>
                              ✓
                            </Button>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={cancelEdit}>
                              <X className="h-3 w-3"/>
                            </Button>
                          </div>
                      ) : (
                          <span className="flex-1 truncate text-left pl-2">{node.data.label as string}</span>
                      )}
                    </div>
                    {editingNode !== node.id && (
                        <div className="flex items-center space-x-1 ">

                          <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 p-0 hover:bg-gray-200/80! hover:text-blue-600 focus:ring-1 focus:ring-blue-400 focus:ring-op"
                              onClick={() => focusNode(node.id)} title="定位">

                            {/*<svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">*/}
                            {/*  <path*/}
                            {/*    strokeLinecap="round"*/}
                            {/*    strokeLinejoin="round"*/}
                            {/*    strokeWidth={2}*/}
                            {/*    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"*/}
                            {/*  />*/}
                            {/*</svg>*/}
                            <Focus className="h-3 w-3 "/>
                          </Button>

                          <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 hover:text-blue-600 hover:bg-gray-200/80! hover:text-blue-600 focus:ring-1 focus:ring-blue-400 focus:ring-op"
                              onClick={() => startEditing(node.id, node.data.label as string)}
                          >
                            <Edit3 className="h-3 w-3 "/>
                          </Button>
                          <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0 text-red-500/60 hover:text-red-600/80 hover:bg-gray-200/80! focus:ring-1 focus:ring-blue-400 focus:ring-op"
                              onClick={() => onDeleteNode(node.id)}
                          >
                            <Trash2 className="h-3 w-3"/>
                          </Button>
                        </div>
                    )}
                  </div>
              ))}
            </div>
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
