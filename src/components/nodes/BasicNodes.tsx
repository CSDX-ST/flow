import {Handle, Position, BuiltInNode,useNodesData,useNodeConnections} from '@xyflow/react';
import {type NodeProps,useReactFlow,useNodeId,type Node} from '@xyflow/react';
import React from 'react';
import '@xyflow/react/dist/style.css';
import './TestNodes.css'
import { memo, useState,useEffect } from 'react';
import { CopyIcon, CheckIcon} from "tdesign-icons-react"
import {Button,Card} from "tdesign-react"
import { Select, Tooltip } from 'tdesign-react';

type InputNodeData =  Node<{ text: string }, 'text'>;
export function InputNode({ data, isConnectable, sourcePosition ,id}:NodeProps<InputNodeData>) {
  const { updateNode } = useReactFlow();

  // 输入框内容变化时更新节点数据

  return (
    <div className="input-node">

      <div className="input-node-label">{data?.label}</div>
        <div>
            <input
                type="text"
                className="input-node-input nodrag"
                placeholder="请输入内容"
                onChange={(evt) => updateNode(id, { text: evt.target.value })}
                value={data.text || ""}
              />

        {/*{data.targetHandles.map((handle) => (*/}
        {/*    <Handle type="source" isConnectable={isConnectable} position={Position.Right} key={handle.id} id={handle.id} />))}*/}
        </div>
        <div>
            <input
                type="text"
                className="input-node-input nodrag"
                placeholder="请输入内容"
                onChange={(evt) => updateNode(id, { text: evt.target.value })}
                value={data.text || ""}
              />
        </div>

        <div>
            <Handle
          id="a"
          type="source"
          position={Position.Bottom}
        />
        <Handle
          id="b"
          type="source"
          position={Position.Bottom}
        /></div>

    </div>
  );
}

type InputNode = Node<{
  id: string;
  data: InputNodeData;
  position: { x: number; y: number };
}>;
export function OutputNode({ data, isConnectable }: NodeProps) {
    const connections = useNodeConnections({
        handleType: 'target',
    });
  const sourceNodeIds = connections.map(conn => conn.source);
  const inputNodes  = useNodesData<InputNode>(sourceNodeIds);
  return (
    <div className="react-flow__node-output">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
    <div>
      {sourceNodeIds.map(id => <div key={id}>{id}</div>)}
        {inputNodes.length>0?(
          inputNodes.map((node) => (
            <div key={node.id} className="text-item">
              {node.data.text}
            </div>
          ))
        ):<div>未连接</div>}
    </div>
      <div className="p-2 text-white text-center">
        {data?.label || 'Output'}
      </div>
    </div>
  );
}

type DatabaseNodeData = Node<{
  tableName: string;
  fields: Array<{ name: string; type: string ,text:string}>;
}>;
export const TestMutilOutputNode = memo(() => {
      // 获取当前节点的所有目标类型（target）连接线信息
  const connections = useNodeConnections({ handleType: 'target' });
  // console.log('Connections:', connections);

  // 从连接信息中提取所有源节点ID（连接的起始节点）
  const connectedSources = connections.map(conn => conn.source);
  // console.log('Connected source IDs:', connectedSources);

    // 从连接信息中提取所有源节点的连接桩ID（具体是哪个输出桩连接的）
  const connectedHandleId = connections.map(conn => conn.sourceHandle);
  // console.log('Connected handle IDs:', connectedHandleId,typeof connectedHandleId);

    // 使用正则表达式从连接桩ID中提取数字部分（假设ID格式为类似"field-0"）
  const connectIndex = connectedHandleId.map(element => String(element).match(/\d+/g));
  // console.log('Connected connectIndex:', connectIndex);

    // 获取所有已连接节点的完整数据（需要 DatabaseNodeData 类型定义）
  const connectedNodes = useNodesData<DatabaseNodeData>(connectedSources);
  // console.log('Nodes data:', connectedNodes);

  return (
    <div className="output-node">
      <Handle type="target" position={Position.Left} />
      <div className="title">Database Schema Viewer</div>


         {connectIndex.map((nodeArr) => {
                const node = Number(nodeArr[0]);
                // console.log('node:',node);
                // connectedNodes数组数量可能小于node，需要进行检查
                const nodeData = connectedNodes[0];
                // console.log('connectedNodes:',connectedNodes);
                // console.log('nodeData:',nodeData);
                if (!nodeData) {
                    return <div key={node}>出现错误</div>;
                }
                return (
                    <div key={node}>
                        <span>Index: {node}</span>
                        <span> {nodeData.data.fields[node].text}</span>
                    </div>
                );
            })}


    </div>
  );
});

type BasicValueOutputNode = Node<{
  tableName: string;
  fields: Array<{ name: string; type: string ,text:string}>;
}>;

export const BasicValueOutputNode = memo(() => {
      // 获取当前节点的所有目标类型（target）连接线信息
  const connections = useNodeConnections({ handleType: 'target' });
  // console.log('Connections:', connections);

  // 从连接信息中提取所有源节点ID（连接的起始节点）
  const connectedSources = connections.map(conn => conn.source);
  // console.log('Connected source IDs:', connectedSources);

    // 从连接信息中提取所有源节点的连接桩ID（具体是哪个输出桩连接的）
  const connectedHandleId = connections.map(conn => conn.sourceHandle);
  // console.log('Connected handle IDs:', connectedHandleId,typeof connectedHandleId);

    // 使用正则表达式从连接桩ID中提取数字部分（假设ID格式为类似"field-0"）
  const connectIndex = connectedHandleId.map(element => String(element).match(/\d+/g));
  // console.log('Connected connectIndex:', connectIndex);

    // 获取所有已连接节点的完整数据（需要 DatabaseNodeData 类型定义）
  const connectedNodes = useNodesData<BasicValueOutputNode>(connectedSources);
  console.log('Nodes data:', connectedNodes);



    if (connectedNodes.length === 0) {
      return (
        <div className="basicstyle">
          <Handle type="target" position={Position.Left} style={{top: '69px'}}/>
          <div className="randombgcolor">输出</div>
          <div className="basic_await_content">等待连接</div>
        </div>
      );
    }
    else {
        return (

    <div className="basicstyle">
      <Handle type="target" position={Position.Left} style={{top: '69px'}}/>
      <div className="randombgcolor">输出</div>

         {connectIndex.map((nodeArr) => {
                const node = Number(nodeArr[0]);
                // console.log('node:',node);
                // connectedNodes数组数量可能小于node，需要进行检查
                const nodeData = connectedNodes[0];
                // console.log('connectedNodes:',connectedNodes);
                console.log('nodeData:',nodeData);
                if (!nodeData) {
                    return <div key={node}>出现错误</div>;
                }
                else if (nodeData.data.type==='0') {
                    console.log('09876');
                    return (
                        <div key={node}>
                            {/*<span>Index: {node}</span>*/}
                            <span className="basic_content"> {nodeData.data.value}</span>
                        </div>
                    );

                }
                // return (
                //     <div key={node}>
                //         {/*<span>Index: {node}</span>*/}
                //         {/*<span className="basic_content"> {nodeData.data.fields[node].text}</span>*/}
                //     </div>
                // );
            })}



    </div>
  );
    }
});

type BasicOperation = Node<{
  tableName: string;
  fields: Array<{ name: string; type: string ,value:number}>;
}>;
export const BasicOperation = memo(() => {
    // Get all target connections for current node
    const connections = useNodeConnections({ handleType: 'target' });
    const connectedSources = connections.map(conn => conn.source);
    const connectedHandleId = connections.map(conn => conn.sourceHandle);
    const connectIndex = connectedHandleId.map(element => String(element).match(/\d+/g));
    const connectedNodes = useNodesData<BasicOperation>(connectedSources);

    const { updateNodeData } = useReactFlow();
    const nodeid = useNodeId();
    const nodeData = useNodesData<BasicOperation>(nodeid);

    const [operator, setOperator] = useState('+'); // Default operator is addition

    /**
     * Calculates the result based on connected inputs and selected operator
     * @returns {number|string} Calculation result or error message
     */
    const calculateResult = () => {
        if (connectIndex.length < 2) return '需要至少两个输入值';

        // Safely extract two values
        const val1 = Number(connectedNodes[0]?.data?.fields[connectIndex[0][0]]?.text || 0);
        const val2 = Number(connectedNodes[1]?.data?.fields[connectIndex[1][0]]?.text || 0);

        // Perform calculation based on operator
        switch (operator) {
            case '+':
                return val1 + val2;
            case '-':
                return val1 - val2;
            case '*':
                return val1 * val2;
            case '/':
                return val2 !== 0 ? val1 / val2 : '∞'; // Handle division by zero
            default:
                return '未知运算符';
        }
    };

    // Update node data when connected nodes change
    useEffect(() => {
        updateNodeData(nodeid, { value: calculateResult() });
        console.log('Updated node data:', nodeData);
    }, [connectedNodes, operator]);

    return (
        <div className="basicstyle">
            {/* Input handles */}
            <Handle type="target" position={Position.Left} id={'1'} style={{ top: '55px' }} />
            <Handle type="target" position={Position.Left} id={'2'} style={{ top: '80px' }} />

            {/* Output handle */}
            <Handle type="source" position={Position.Right} id={'3'} style={{ top: '55px' }} />

            <div className="randombgcolor">Calculate</div>

            {/* Operator selector */}
            <div className="select-wrapper">
                <select
                    value={operator}
                    onChange={(e) => setOperator(e.target.value)}
                    style={{width: '60px',height: '40px',marginTop: '5px',fontSize: '20px'}}
                    className={''}
                >
                    <option value="+">+</option>
                    <option value="-">-</option>
                    <option value="*">×</option>
                    <option value="/">÷</option>
                </select>
            </div>



            {/* Display calculation expression and result */}
            {/*<div>*/}
            {/*    {`${connectedNodes[0]?.data?.fields[connectIndex[0][0]]?.text || 0} */}
            {/*    ${operator} */}
            {/*    ${connectedNodes[1]?.data?.fields[connectIndex[1][0]]?.text || 0} */}
            {/*    = ${calculateResult()}`}*/}
            {/*</div>*/}
        </div>
    );
});