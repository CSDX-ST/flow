import React from 'react';
import { NodeProps, Handle, Position ,NodeToolbar } from '@xyflow/react';
import type {TableProps} from "tdesign-react";
import { useToolbarContext } from '../ToolbarContext';

interface ActivityNodeData {
    id: string;
    position: { x: number; y: number };
    data: Record<string, unknown>;

    name:string;
    duration:number;
    es:number;
    ef:number;
    ls?:number;
    lf?:number;
    totalFloat?:number;
    freeFloat?:number;
    isCritical?:boolean;

    taskName: string;
    taskType: 'approval' | 'executio    n' | 'condition';
    assignee: string;
    label : string;
    value: number;

    forceToolbarVisible :boolean;

}


// 自定义圆形节点组件
const ActivityNode = ({ data ,selected }: { data: ActivityNodeData ,selected: boolean;}) => {
  const { name, duration, es, ef, ls, lf, totalFloat, isCritical = false ,forceToolbarVisible = false} = data;
  const { isToolbarEnabled } = useToolbarContext();
  // console.log('isToolbarEnabled',isToolbarEnabled)
  return (

      <div
          style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: selected ? '#ffd591' : '#fff',
              border: `2px solid ${selected ? '#ffa940' : '#d9d9d9'}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              transition: 'all 0.2s ease',
              overflow: 'visible',
              position: 'relative',

          }}
      >
          <NodeToolbar isVisible={isToolbarEnabled} position={Position.Top}>
              <div style={{textAlign: 'center', marginBottom: '4px'}}>
                  <strong>{name}</strong>
              </div>
              <div style={{fontSize: '12px', lineHeight: '1.4'}}>
                  <div>持续时间：{duration}</div>
                  <div>ES：{es} | EF：{ef}</div>
                  {/*{ls && lf && */}
                      <div>LS：{ls} | LF：{lf}</div>
                  {/*}*/}
                  {/*{totalFloat && */}
                      <div>总时差：{totalFloat}</div>
                  {/*}*/}
              </div>
          </NodeToolbar>

          {/* 左侧输入桩：连接紧前工作 */}
          <Handle type="target" position={Position.Left} id="left" style={{background: '#888',visibility: 'hidden'}}/>

          {/* 节点内容 */}
          <div style={{
              fontSize: '24px',
              fontWeight: 500,
              color: selected ? '#874d00' : '#595959'
          }}>
              {data.label as string}
          </div>
          {/*<div style={{textAlign: 'center', marginBottom: '4px'}}>*/}
          {/*    <strong>{name}</strong>*/}
          {/*</div>*/}
          {/*<div style={{fontSize: '12px', lineHeight: '1.4'}}>*/}
          {/*    <div>持续时间：{duration}</div>*/}
          {/*    <div>ES：{es} | EF：{ef}</div>*/}
          {/*    {ls && lf && <div>LS：{ls} | LF：{lf}</div>}*/}
          {/*    {totalFloat && <div>总时差：{totalFloat}</div>}*/}
          {/*</div>*/}

          {/* 右侧输出桩：连接紧后工作 */}
          <Handle type="source" position={Position.Right} id="right" style={{background: '#888',visibility: 'hidden'}}/>


      </div>
  );
};

export default ActivityNode;

