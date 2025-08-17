"use client"

/**
 * ReactFlow 应用主组件
 * Main ReactFlow Application Component
 *
 * Features:
 * - 响应式侧边栏导航 Responsive sidebar navigation
 * - 自定义圆形节点 Custom circle nodes
 * - 智能边连接系统 Smart edge connection system
 * - XY轴精确控制 Precise XY-axis control
 * - 三角形背景图案 Triangle background pattern
 * - 拖拽创建新节点 Drag to create new nodes
 */

import type React from "react"
import { useCallback, useRef, useState } from "react"
import "./App.css"

// ReactFlow imports
import "@xyflow/react/dist/style.css"
import {
  addEdge,
  Background,
  ConnectionLineType,
  Controls,
  type EdgeTypes,
  MiniMap,
  ReactFlow,
  reconnectEdge,
  useEdgesState,
  useNodesState,
  ReactFlowProvider,
  useReactFlow,
  MarkerType,
  type Node,
  type Connection,
} from "@xyflow/react"

// TDesign UI imports
import { Layout, Menu } from "tdesign-react"
import {
  ControlPlatformIcon,
  DashboardIcon,
  Edit1Icon,
  HomeIcon,
  MailIcon,
  NotificationFilledIcon,
  PlayCircleIcon,
  PreciseMonitorIcon,
  RootListIcon,
  SearchIcon,
  ServerIcon,
  UserCircleIcon,
} from "tdesign-icons-react"

// Custom components
import TrianglesBackground from "./components/CustomBackground/CustomeBg1"
import initialNodes from "./components/Initial/initialNodes"
import initialEdges from "./components/Initial/initialEdges"
import nodeTypes from "./components/NodesType"
import basicArrowEdge from "./components/CustomEdges/basicArrowEdge"
import { XYAxisControl } from "./features/xy-axis-control"

import NodeManager from './components/node_manager'

import Logo from './assets/flow.svg';
// ==================== 配置常量 Configuration Constants ====================

const EDGE_TYPES: EdgeTypes = {
  default: basicArrowEdge,
  straight: basicArrowEdge,
  smoothstep: basicArrowEdge,
  step: basicArrowEdge,
  buttonedge: basicArrowEdge,
  arrowedge: basicArrowEdge,
}

const BACKGROUND_SETTINGS = {
  gap: 50,
  size: 15,
  color: "#94a3b8",
  offsetX: 0,
  offsetY: 0,
}

const EDGE_STYLE = {
  stroke: "#FF0072",
  strokeWidth: 2,
}

const MARKER_END_CONFIG = {
  type: MarkerType.ArrowClosed,
  width: 30,
  height: 30,
  color: "#FF0072",
}

const NODE_ORIGIN = [0, 0.5]
const DELETE_KEY = "Delete"


// 操作日志接口
interface OperationLog {
  id: string
  timestamp: number
  type: "input_change" | "calculation" | "formula_update" | "node_add" | "node_delete" | "node_rename"
  nodeId: string
  nodeLabel: string
  nodeType: string
  details: string
  oldValue?: any
  newValue?: any
  duration?: number
}
// ==================== 工具函数 Utility Functions ====================

let nodeIdCounter = 1
const generateNodeId = () => `${nodeIdCounter++}`

// ==================== 组件 Components ====================

/**
 * 侧边栏菜单组件
 * Sidebar Menu Component
 */
function SidebarMenu() {
  const { MenuItem } = Menu

  const menuItems = [
    { value: "dashboard", icon: <DashboardIcon />, label: "仪表板" },
    { value: "resource", icon: <ServerIcon />, label: "资源" },
    { value: "root", icon: <RootListIcon />, label: "根目录" },
    { value: "control-platform", icon: <ControlPlatformIcon />, label: "控制平台" },
    { value: "precise-monitor", icon: <PreciseMonitorIcon />, label: "精确监控" },
    { value: "mail", icon: <MailIcon />, label: "邮件" },
    { value: "user-circle", icon: <UserCircleIcon />, label: "用户" },
    { value: "play-circle", icon: <PlayCircleIcon />, label: "播放" },
    { value: "edit1", icon: <Edit1Icon />, label: "编辑" },
  ]

  return (
    <Menu theme="light" value="dashboard" style={{ marginRight: 50, height: "100vh" }}>
      {menuItems.map((item) => (
        <MenuItem key={item.value} value={item.value} icon={item.icon}>
          {item.label}
        </MenuItem>
      ))}
    </Menu>
  )
}

/**
 * ReactFlow 主应用组件
 * Main ReactFlow Application Component
 */
function ReactFlowApp() {
  // 状态管理 State Management
  const proOptions = { hideAttribution: true }
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)

  // 节点管理器显示控制
  // 初始化UI控制状态
  const [showNodeManager, setShowNodeManager] = useState(true)
  const [showResourceMonitor, setShowResourceMonitor] = useState(false)

  // 4. 初始化统计数据
  const [calculationStats, setCalculationStats] = useState({
    totalCalculations: 0,
    lastCalculationTime: 0,
    averageCalculationTime: 0,
  })

  const { screenToFlowPosition } = useReactFlow()
  const edgeReconnectSuccessful = useRef(true)

  // ==================== 事件处理函数 Event Handlers ====================

  /**
   * 处理节点点击事件
   * Handle node click event
   */
  const handleNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [])

  /**
   * 处理画布点击事件 - 清除节点选择
   * Handle pane click event - Clear node selection
   */
  const handlePaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [])

  /**
   * 更新节点位置 - 用于XY轴控制器
   * Update node position - For XY axis controller
   */
  const updateNodePosition = useCallback(
    (id: string, newPosition: { x: number; y: number }) => {
      setNodes((nds) => nds.map((node) => (node.id === id ? { ...node, position: newPosition } : node)))
    },
    [setNodes],
  )

  /**
   * 处理边重连事件
   * Handle edge reconnection
   */
  const handleReconnect = useCallback(
    (oldEdge, newConnection) => {
      edgeReconnectSuccessful.current = true
      setEdges((els) => reconnectEdge(oldEdge, newConnection, els))
    },
    [setEdges],
  )

  const handleReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false
  }, [])

  const handleReconnectEnd = useCallback(
    (_, edge) => {
      if (!edgeReconnectSuccessful.current) {
        setEdges((eds) => eds.filter((e) => e.id !== edge.id))
      }
      edgeReconnectSuccessful.current = true
    },
    [setEdges],
  )

  /**
   * 处理节点连接事件 - 创建新的边连接
   * Handle node connection - Create new edge connections
   */
  const handleConnect = useCallback(
    (newConnection: Connection) => {
      setEdges((prevEdges) => {
        // 过滤掉相同目标的边，避免重复连接
        const filteredEdges = prevEdges.filter((edge) => {
          const isSameTarget = edge.target === newConnection.target
          const isSameTargetHandle = String(edge.targetHandle) === String(newConnection.targetHandle)

          if (edge.targetHandle === undefined) {
            return !isSameTarget
          }
          return !(isSameTarget && isSameTargetHandle)
        })

        return addEdge(
          {
            ...newConnection,
            type: "arrowedge",
            markerEnd: MARKER_END_CONFIG,
            style: EDGE_STYLE,
          },
          filteredEdges,
        )
      })
    },
    [setEdges],
  )

  /**
   * 处理连接结束事件 - 在空白处创建新节点
   * Handle connection end - Create new node when dropped on pane
   */
  const handleConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const id = generateNodeId()
        const { clientX, clientY } = "changedTouches" in event ? event.changedTouches[0] : event

        const newNode = {
          id,
          position: screenToFlowPosition({ x: clientX, y: clientY }),
          type: "CircleNode",
          data: { label: `${id}`, value: "0" },
          origin: [0, 0.5],
        }

        setNodes((nds) => nds.concat(newNode))

        setEdges((eds) =>
          eds.concat({
            id,
            source: connectionState.fromNode.id,
            target: id,
            sourceHandle: connectionState.fromHandle.id,
            markerEnd: MARKER_END_CONFIG,
            style: EDGE_STYLE,
          }),
        )
      }
    },
    [screenToFlowPosition, setNodes, setEdges],
  )

  // 操作日志状态
  const [operationLogs, setOperationLogs] = useState<OperationLog[]>([])
  // 添加操作日志的函数
  const addOperationLog = useCallback((log: Omit<OperationLog, "id" | "timestamp">) => {
    const newLog: OperationLog = {
      ...log,
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    }

    setOperationLogs((prev) => {
      // 保持最多100条记录，避免内存泄漏
      const newLogs = [newLog, ...prev].slice(0, 100)
      return newLogs
    })
  }, [])

  // 删除节点
  const deleteNode = useCallback(
    (nodeId: string) => {
      const node = nodes.find((n) => n.id === nodeId)

      setNodes((nds) => nds.filter((node) => node.id !== nodeId))
      setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId))

      // 记录节点删除日志
      if (node) {
        addOperationLog({
          type: "node_delete",
          nodeId,
          nodeLabel: node.data.label,
          nodeType: node.type!,
          details: `删除节点`,
        })
      }
    },
    [setNodes, setEdges, nodes, addOperationLog],
  )

  return (
    <div className="w-full h-full relative">
      {showNodeManager && <NodeManager nodes={nodes}  onDeleteNode={deleteNode}/>}

      <ReactFlow className="w-full h-full relative"
         nodes={nodes}
         edges={edges}
         nodeTypes={nodeTypes}
         edgeTypes={EDGE_TYPES}
         onNodesChange={onNodesChange}
         onEdgesChange={onEdgesChange}
         onConnect={handleConnect}
         onConnectEnd={handleConnectEnd}
         onReconnect={handleReconnect}
         onReconnectStart={handleReconnectStart}
         onReconnectEnd={handleReconnectEnd}
         deleteKeyCode={DELETE_KEY}
         connectionLineType={ConnectionLineType.Straight}
         proOptions={proOptions}
         nodeOrigin={NODE_ORIGIN}
         onPaneClick={handlePaneClick}
         onNodeClick={handleNodeClick}
      >
        <TrianglesBackground {...BACKGROUND_SETTINGS} />
        <Background id="1" gap={12} size={1} bgColor="#f0f0f3"/>
        <MiniMap pannable zoomable zoomStep={4} offsetScale={3}/>
        <Controls className="[&>button]:bg-background [&>button]:shadow-sm"/>

        {selectedNode && <XYAxisControl selectedNode={selectedNode} updateNodePosition={updateNodePosition}/>}
      </ReactFlow>
    </div>
  )
}

/**
 * 头部菜单组件
 * Header Menu Component
 */
function HeaderMenu() {
  const {HeadMenu, MenuItem} = Menu

  return (
      <HeadMenu
          value="item1"
          logo={<img width="136" src={Logo} alt="logo"/>}
          operations={
            <div className="t-menu__operations">
          <SearchIcon className="t-menu__operations-icon" />
          <NotificationFilledIcon className="t-menu__operations-icon" />
          <HomeIcon className="t-menu__operations-icon" />
        </div>
      }
    >
      <MenuItem value="item1">已选内容</MenuItem>
      <MenuItem value="item2">应用方案</MenuItem>
      <MenuItem value="item3">模板库</MenuItem>
      <MenuItem value="item4" disabled>
        关于我们
      </MenuItem>
    </HeadMenu>
  )
}

/**
 * 主布局组件
 * Main Layout Component
 */
export default function MainLayout() {
  const { Header, Content, Footer, Aside } = Layout

  return (
    <div >
      <Layout>
        <Header>
          <HeaderMenu />
        </Header>

        <Layout>

          {/*<Aside style={{ borderTop: "1px solid var(--component-border)" }}>*/}
          {/*  <SidebarMenu />*/}
          {/*</Aside>*/}

          <Layout>
            <Content  style={{ height: "calc(100vh - 64px)", overflow: "auto" }}>

              <ReactFlowProvider>
                <ReactFlowApp />
              </ReactFlowProvider>


            </Content>

            <Footer>Copyright @ 2019-2020 Tencent. All Rights Reserved</Footer>
          </Layout>
        </Layout>
      </Layout>
    </div>
  )
}
