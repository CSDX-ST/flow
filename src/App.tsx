import React, {useCallback, useRef, useState} from 'react'

import './App.css'
import '@xyflow/react/dist/style.css';

import {
    addEdge,
    Background,
    BackgroundVariant,
    ConnectionLineType,
    Controls,
    EdgeTypes,
    MiniMap,
    ReactFlow,
    reconnectEdge,
    useEdgesState,
    useNodesState,
    ReactFlowProvider,
    useReactFlow,
    MarkerType,
    type Node
} from '@xyflow/react';

import {Layout, Menu} from 'tdesign-react';
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
} from 'tdesign-icons-react';

import TrianglesBackground from './components/CustomBackground/CustomeBg1'

import initialNodes from './components/Initial/initialNodes'
import initialEdges from './components/Initial/initialEdges'
import nodeTypes from './components/NodesType'
import ButtonEdge from './components/CustomEdges/ButtonEdge'
import ArrowEdge from './components/CustomEdges/ArrowEdge'
import basicArrowEdge from './components/CustomEdges/basicArrowEdge'
// import OriginCross from './components/OriginCross'

import { XYAxisControl } from "./features/xy-axis-control"

const edgeTypes: EdgeTypes = {
  default: basicArrowEdge,
  straight: basicArrowEdge,
  smoothstep: basicArrowEdge,
  step: basicArrowEdge,
  buttonedge: basicArrowEdge,
  arrowedge: basicArrowEdge,
};

let id = 1;
const getId = () => `${id++}`;
const nodeOrigin = [0, 0.5];
const { HeadMenu, MenuItem } = Menu;

function App() {

  return (
    <>
      <Menu theme="light" value="dashboard" style={{ marginRight: 50, height: '100vh' }}>
      <MenuItem value="dashboard" icon={<DashboardIcon />}>
        选项
      </MenuItem>
      <MenuItem value="resource" icon={<ServerIcon />}>
        选项
      </MenuItem>
      <MenuItem value="root">
        <RootListIcon />
        选项
      </MenuItem>
      <MenuItem value="control-platform" icon={<ControlPlatformIcon />}>
        选项
      </MenuItem>
      <MenuItem value="precise-monitor" icon={<PreciseMonitorIcon />}>
        选项
      </MenuItem>
      <MenuItem value="mail" icon={<MailIcon />}>
        选项
      </MenuItem>
      <MenuItem value="user-circle" icon={<UserCircleIcon />}>
        选项
      </MenuItem>
      <MenuItem value="play-circle" icon={<PlayCircleIcon />}>
        选项
      </MenuItem>
      <MenuItem value="edit1" icon={<Edit1Icon />}>
        选项
      </MenuItem>
    </Menu>
    </>
  );
}

function ReactFlowApp() {
    const proOptions = { hideAttribution: true };
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const [selectedNode, setSelectedNode] = useState<Node | null>(null);

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
        setSelectedNode(node);
      }, []);
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);
  const updateNodePosition = useCallback(
    (id: string, newPosition: { x: number; y: number }) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              position: newPosition,
            };
          }
          return node;
        })
      );
    },
    [setNodes]
  );
  const { screenToFlowPosition } = useReactFlow();
    // console.log('screenToFlowPosition:',screenToFlowPosition);
  /**
   * 定义默认边的选项。
   */
  const defaultEdgeOptions = {type:'arrowedge'};
    const bgSettings = {
      gap: 50,            // 三角形间距
      size: 15,           // 三角形边长
      color: "#94a3b8",   // 颜色
      offsetX: 0,        // 横向偏移（用于微调位置）
      offsetY: 0,       // 纵向偏移
    };
  const customDeleteKeyCode = 'Delete';
  const edgeReconnectSuccessful = useRef(true);

  const onReconnect = useCallback((oldEdge, newConnection) => {
    edgeReconnectSuccessful.current = true;
    setEdges((els) => reconnectEdge(oldEdge, newConnection, els));
  }, []);
  const onReconnectStart = useCallback(() => {
    edgeReconnectSuccessful.current = false;
  }, []);

  const onReconnectEnd = useCallback((_, edge) => {
    if (!edgeReconnectSuccessful.current) {
      setEdges((eds) => eds.filter((e) => e.id !== edge.id));
    }

    edgeReconnectSuccessful.current = true;
  }, []);


    const onConnect = useCallback((newConnection) => {
      // console.log('触发了 onConnect，参数:', newConnection);
      setEdges((prevEdges) => {
        // console.log('当前旧边:', prevEdges);
        const filteredEdges = prevEdges.filter((edge) => {
          const isSameTarget = edge.target === newConnection.target;
          const isSameTargetHandle =
            String(edge.targetHandle) === String(newConnection.targetHandle); // 转为字符串比较
            // const isSameSourceHandle =
            //   String(edge.sourceHandle) === String(newConnection.sourceHandle); // 转为字符串比较

            if (edge.targetHandle ===undefined) {
                // console.log('目标targetHandle未定义');
                return !(isSameTarget);
            }
            else {
              // console.log(String(edge.targetHandle), String(newConnection.targetHandle));
                return !(isSameTarget && isSameTargetHandle);
            }
});

        const newEdges = addEdge({
            ...newConnection,
            type: 'arrowedge',
            markerEnd: { type: MarkerType.ArrowClosed,
                width:30,
                height:30,
                color:'#FF0072'},
              style: {
                  stroke: '#FF0072',
                  strokeWidth: 2,
                  // strokeDasharray: '5 5',
              }

        }, prevEdges);
        // console.log('更新后的边:', newEdges);
        return newEdges;
      });
    }, [setEdges]);

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();

        const { clientX, clientY } =
          'changedTouches' in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
            type: 'CircleNode',
            data: { label: `${id}`, value: '0'},
            // Node 的原点决定了它相对于其自身坐标的放置方式。 [0， 0] 将其放置在左上角，[0.5， 0.5] 位于中心，[1， 1] 位于其位置的右下角。
            origin: [0, 0.5],

            // markerEnd: { type: MarkerType.Arrow },
        };

        setNodes((nds) => nds.concat(newNode));

          let edgeColor = '#FF0072';
          // console.log("id",connectionState.fromNode.id,connectionState.fromHandle);

          setEdges((eds) =>
              eds.concat({ id,
                  source: connectionState.fromNode.id,
                  target: id ,
                  sourceHandle: connectionState.fromHandle.id,  // 源节点的句柄ID
                    // targetHandle: connectionState.fromNode.sourceHandle,    // 目标节点的句柄ID
                  markerEnd: { type: MarkerType.ArrowClosed,
                      width:30,
                      height:30,
                      color:edgeColor} ,
                  style: {
                      stroke: edgeColor,
                      strokeWidth: 2,
                      // strokeDasharray: '5 5',
                  }
              }),
        );

      }
    },
    [screenToFlowPosition],
  );
  // const onConnect = useCallback((params) =>
  //   setEdges((els) => addEdge(params, els)),
  // );

    return (
        <>
            <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  nodeTypes={nodeTypes}
                  // edgeTypes={edgeTypes}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onConnectEnd={onConnectEnd}
                  onReconnect={onReconnect}
                  onReconnectStart={onReconnectStart}
                  onReconnectEnd={onReconnectEnd}
                  // defaultEdgeOptions={defaultEdgeOptions}
                  deleteKeyCode={customDeleteKeyCode}
                  connectionLineType={ConnectionLineType.Straight}
                  proOptions={proOptions}
                  nodeOrigin={nodeOrigin}
                  edgeTypes={edgeTypes}
                  onPaneClick={onPaneClick}
                  onNodeClick={onNodeClick}


              >
                <TrianglesBackground {...bgSettings} />

                {/* 添加 Background 组件 */}
                  <Background id={'1'} gap={12} size={1} bgColor={'#f0f0f3'}></Background>


                  <MiniMap pannable zoomable zoomStep={4} offsetScale={3}/>
                  <Controls className="[&>button]:bg-background [&>button]:shadow-sm" />
                    {selectedNode && (
                      <XYAxisControl
                        selectedNode={selectedNode}
                        updateNodePosition={updateNodePosition}
                      />
                    )}

              </ReactFlow>
        </>
    )
};

const { Header, Content, Footer, Aside } = Layout;

export default function BasicDivider() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const onConnect = useCallback(
    (params) => setEdges((els) => addEdge(params, els)),
    [],
  );
      return (
    <div className="tdesign-demo-item--layout">
      <Layout>
        <Header>
          <HeadMenu
            value="item1"
            logo={<img width="136" src="https://www.tencent.com/img/index/menu_logo_hover.png" alt="logo" />}
            operations={
              <div className="t-menu__operations">
                <SearchIcon className="t-menu__operations-icon" />
                <NotificationFilledIcon className="t-menu__operations-icon" />
                <HomeIcon className="t-menu__operations-icon" />
              </div>
            }
          >
            <MenuItem value="item1">已选内容</MenuItem>
            <MenuItem value="item2">菜单内容一</MenuItem>
            <MenuItem value="item3">菜单内容二</MenuItem>
            <MenuItem value="item4" disabled>
              菜单内容三
            </MenuItem>
          </HeadMenu>
        </Header>

        <Layout>
          <Aside style={{ borderTop: '1px solid var(--component-border)' }}>
            <App />
          </Aside>
          <Layout>

              {/*Main Content*/}
            <Content>
                <ReactFlowProvider children={<ReactFlowApp />}>

                </ReactFlowProvider>
              {/*<div>Content</div>*/}
            </Content>


            <Footer>Copyright @ 2019-2020 Tencent. All Rights Reserved</Footer>
          </Layout>
        </Layout>
      </Layout>
    </div>
  );
}
