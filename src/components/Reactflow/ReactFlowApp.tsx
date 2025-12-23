// components/ReactFlow/ReactFlowApp.tsx
"use client";

import type React from "react";
import {useCallback, useRef, useState, useEffect} from "react";
import {
    addEdge,
    reconnectEdge,
    ReactFlow,
    useEdgesState,
    useNodesState,
    useReactFlow,
    type Node,
    type Connection,
    NodeToolbar
} from "@xyflow/react";

// 导入外部依赖
import TrianglesBackground from "../../components/CustomBackground/CustomeBg1";
import initialNodes from "../../components/Initial/initialNodes";
import initialEdges from "../../components/Initial/initialEdges";
import nodeTypes from "../../components/NodesType";
import {XYAxisControl} from "@/features/xy-axis-control";
import {ResourceMonitor} from "@/components/resource-monitor";
import NodeManager from "../../components/node_manager";
import {CollapsibleTabler } from "@/components/table_manager"
import {ReactFlowTools, edgeTypes} from "@/components/tools_bar";
import {useUndoRedoManager} from "@/lib/undo-redo-manager";

// 导入常量、类型、工具函数
import {
    BACKGROUND_SETTINGS,
    EDGE_STYLE,
    MARKER_END_CONFIG,
    NODE_ORIGIN,
    DELETE_KEY,
    DEFAULT_CONNECTION_LINE_TYPE,
    PRO_OPTIONS,
} from "@/constants/reactFlow";
import { OperationLog} from "@/type/reactFlow";
import {generateNodeId} from "@/utils/reactFlow";
import {EdgeType} from "@/components/tools_bar";




const ReactFlowApp = () => {
    // 状态管理
    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
    const [selectedNode, setSelectedNode] = useState<Node | null>(null);
    const [edgeType, setEdgeType] = useState<EdgeType>("basicArrowEdge");
    const [showNodeManager, setShowNodeManager] = useState(true);
    const [operationLogs, setOperationLogs] = useState<OperationLog[]>([]);
    // console.log(nodes)
    // 撤销重做
    const {debouncedSaveState, undo, redo, canUndo, canRedo} = useUndoRedoManager(initialNodes, initialEdges);

    // 统计数据
    const [calculationStats, setCalculationStats] = useState({
        totalCalculations: 0,
        lastCalculationTime: 0,
        averageCalculationTime: 0,
    });

    const {screenToFlowPosition} = useReactFlow();
    const edgeReconnectSuccessful = useRef(true);

    // 监听 edgeType 变化
    // useEffect(() => {
    //     console.log("[v0] edgeType updated to:", edgeType);
    // }, [edgeType]);

    // ==================== 事件处理函数 ====================
    // 节点变化处理
    const handleNodesChange = useCallback(
        (changes: any) => {
            onNodesChange(changes);
            debouncedSaveState(nodes, edges);
        },
        [onNodesChange, debouncedSaveState, nodes, edges]
    );

    // 边变化处理
    const handleEdgesChange = useCallback(
        (changes: any) => {
            onEdgesChange(changes);
            debouncedSaveState(nodes, edges);
        },
        [onEdgesChange, debouncedSaveState, nodes, edges]
    );

    // 撤销操作
    const handleUndo = useCallback(() => {
        const previousState = undo();
        if (previousState) {
            // @ts-ignore
            setNodes(previousState.nodes);
            setEdges(previousState.edges);
        }
    }, [undo, setNodes, setEdges]);

    // 重做操作
    const handleRedo = useCallback(() => {
        const nextState = redo();
        if (nextState) {
            // @ts-ignore
            setNodes(nextState.nodes);
            setEdges(nextState.edges);
        }
    }, [redo, setNodes, setEdges]);

    // 切换边类型
    const handleEdgeTypeChange = useCallback(
        (newType: EdgeType) => {
            setEdgeType(newType);
            setEdges((eds) =>
                eds.map((edge) => ({
                    ...edge,
                    type: newType,
                }))
            );
        },
        [setEdges]
    );

    // 节点重命名
    const renameNode = useCallback(
        (nodeId: string, newLabel: string) => {


            setNodes((nds) =>
                nds.map((node) =>
                    node.id === nodeId
                        ? {...node, data: {...node.data, label: newLabel}}
                        : node
                )
            );
            // const targetNode = nodes.find((n) => n.id === nodeId);
            // const oldLabel = targetNode?.data.label;
            // 记录重命名日志
            // if (targetNode) {
            //   addOperationLog({
            //     type: "node_rename",
            //     nodeId,
            //     nodeLabel: newLabel,
            //     nodeType: targetNode.type!,
            //     details: `节点标签从 "${oldLabel}" 改为 "${newLabel}"`,
            //     oldValue: oldLabel,
            //     newValue: newLabel,
            //   });
            // }
        },
        [nodes, setNodes,]
    );

    // 节点点击处理
    const handleNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
    }, []);

    // 画布点击处理（清除选中）
    const handlePaneClick = useCallback(() => {
        setSelectedNode(null);
    }, []);

    // 更新节点位置
    const updateNodePosition = useCallback(
        (id: string, newPosition: { x: number; y: number }) => {
            setNodes((nds) =>
                nds.map((node) =>
                    node.id === id ? {...node, position: newPosition} : node
                )
            );
        },
        [setNodes]
    );

    // 边重连处理
    const handleReconnect = useCallback(
        (oldEdge: any, newConnection: any) => {
            edgeReconnectSuccessful.current = true;
            setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
        },
        [setEdges]
    );

    const handleReconnectStart = useCallback(() => {
        edgeReconnectSuccessful.current = false;
    }, []);

    const handleReconnectEnd = useCallback(
        (_: any, edge: any) => {
            if (!edgeReconnectSuccessful.current) {
                setEdges((eds) => eds.filter((e) => e.id !== edge.id));
            }
            edgeReconnectSuccessful.current = true;
        },
        [setEdges]
    );

    // 边连接处理
    const handleConnect = useCallback(
        (newConnection: Connection) => {
            setEdges((prevEdges) => {
                // 过滤重复边
                const filteredEdges = prevEdges.filter((edge) => {
                    const isSameTarget = edge.target === newConnection.target;
                    const isSameTargetHandle = String(edge.targetHandle) === String(newConnection.targetHandle);
                    return edge.targetHandle === undefined ? !isSameTarget : !(isSameTarget && isSameTargetHandle);
                });

                return addEdge(
                    {
                        ...newConnection,
                        type: edgeType,
                        markerEnd: MARKER_END_CONFIG,
                        style: EDGE_STYLE,
                    },
                    filteredEdges
                );
            });
        },
        [edgeType]
    );

    // 连接结束处理（创建新节点）
    const handleConnectEnd = useCallback(
        (event: MouseEvent | TouchEvent, connectionState: any) => {
            if (!connectionState.isValid) {
                const id = generateNodeId();
                const {clientX, clientY} = "changedTouches" in event ? event.changedTouches[0] : event;
                const newNode = {
                    id,
                    position: screenToFlowPosition({x: clientX, y: clientY}),
                    type: "ActivityNode",
                    data: {label: `${id}`, value: "0",assignee:'nothing',name:`${id}`,forceToolbarVisible:false},
                    origin: NODE_ORIGIN,
                };

                setNodes((nds) => nds.concat(newNode));
                setEdges((eds) =>
                    eds.concat({
                        id,
                        source: connectionState.fromNode.id,
                        target: id,
                        type: edgeType,
                        sourceHandle: connectionState.fromHandle.id,
                        markerEnd: MARKER_END_CONFIG,
                        style: EDGE_STYLE,
                    })
                );

                // 记录节点添加日志
                // addOperationLog({
                //   type: "node_add",
                //   nodeId: id,
                //   nodeLabel: newNode.data.label,
                //   nodeType: newNode.type,
                //   details: "通过拖拽连接创建新节点",
                // });
            }
        },
        [screenToFlowPosition, edgeType]
    );

    // // 添加操作日志
    // const addOperationLog = useCallback((log: Omit<OperationLog, "id" | "timestamp">) => {
    //   const newLog: OperationLog = {
    //     ...log,
    //     id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    //     timestamp: Date.now(),
    //   };
    //
    //   setOperationLogs((prev) => [newLog, ...prev].slice(0, 100));
    // }, []);

    // 删除节点
    const deleteNode = useCallback(
        (nodeId: string) => {
            const targetNode = nodes.find((n) => n.id === nodeId);
            if (!targetNode) return;

            setNodes((nds) => nds.filter((node) => node.id !== nodeId));
            setEdges((eds) => eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId));

            // 记录删除日志
            // addOperationLog({
            //   type: "node_delete",
            //   nodeId,
            //   nodeLabel: targetNode.data.label,
            //   nodeType: targetNode.type!,
            //   details: "删除节点",
            // });
        },
        [nodes, setNodes, setEdges]
    );

    return (
        <div className="w-full h-full relative">
            {showNodeManager &&
                <NodeManager nodes={nodes} onDeleteNode={deleteNode} onRenameNode={renameNode} onAddNode={() => {
                }}/>}


            <ReactFlow
                className="w-full h-full relative"
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                onNodesChange={handleNodesChange}
                onEdgesChange={handleEdgesChange}
                onConnect={handleConnect}
                onConnectEnd={handleConnectEnd}
                onReconnect={handleReconnect}
                onReconnectStart={handleReconnectStart}
                onReconnectEnd={handleReconnectEnd}
                deleteKeyCode={DELETE_KEY}
                connectionLineType={DEFAULT_CONNECTION_LINE_TYPE}
                proOptions={PRO_OPTIONS}
                nodeOrigin={NODE_ORIGIN as [number, number]}
                onPaneClick={handlePaneClick}
                onNodeClick={handleNodeClick}
            >

                <TrianglesBackground {...BACKGROUND_SETTINGS} />
                <ReactFlowTools
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={canUndo}
                    canRedo={canRedo}
                    onEdgeTypeChange={handleEdgeTypeChange}
                />
                <CollapsibleTabler nodes={nodes} onDeleteNode={deleteNode} onRenameNode={renameNode} onAddNode={() => {
                }}/>
                <ResourceMonitor/>
                {selectedNode && <XYAxisControl selectedNode={selectedNode} updateNodePosition={updateNodePosition}/>}
            </ReactFlow>
        </div>
    );
};

export default ReactFlowApp;