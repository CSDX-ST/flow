import React from 'react';
import { NodeProps, Handle, Position ,NodeToolbar,useReactFlow  } from '@xyflow/react';
import type {TableProps} from "tdesign-react";
import { useToolbarContext } from '../ToolbarContext';

interface ActivityNodeData {
    id: string;
    position: { x: number; y: number };
    data: Record<string, unknown>;

    name:string;// 工作名称
    duration:number;//持续时间（天）
    es:number;// 最早开始时间
    ef:number;// 最早完成时间
    ls?:number;// 最迟开始时间（可选）
    lf?:number;// 最迟完成时间（可选）
    totalFloat?:number;// 总时差（可选）
    freeFloat?:number;// 自由时差（可选）
    isCritical?:boolean; // 是否为关键工作
    predecessors?: string[]; // 紧前工作id列表

    taskName: string;
    taskType: 'approval' | 'execution' | 'condition';
    assignee: string;
    label : string;
    value: number;

    forceToolbarVisible :boolean;

}


// 自定义圆形节点组件
const ActivityNode = ({ data ,selected }: { data: ActivityNodeData ,selected: boolean;}) => {
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
        forceToolbarVisible = false
    } = data, {isToolbarEnabled} = useToolbarContext();



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
              cursor: 'pointer'

          }}
      >
          <NodeToolbar isVisible={isToolbarEnabled} position={Position.Top}>
              <div style={{textAlign: 'center', marginBottom: '4px'}}>
                  {/*<strong>{name}</strong>*/}
              </div>
              <div style={{
                  fontSize: '12px',
                  lineHeight: '1.4',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gridTemplateRows: 'auto auto',
                  gap: '0', // 依赖gap为0，让内部边框衔接自然
                  // 移除原本的 border: '1px solid #ddd'，不显示外轮廓
              }}>
                  {/* 第1行 */}
                  <div style={{
                      padding: '2px',
                      borderRight: '1px solid #bbb', // 保留右侧内部线
                      borderBottom: '1px solid #bbb' // 保留下方内部线
                  }}>ES：{es}</div>
                  <div style={{
                      padding: '2px',
                      borderRight: '1px solid #bbb', // 保留右侧内部线
                      borderBottom: '1px solid #bbb' // 保留下方内部线
                  }}>EF：{ef}</div>
                  <div style={{
                      padding: '2px',
                      borderBottom: '1px solid #bbb' // 保留下方内部线（无右侧线，避免右侧外轮廓）
                  }}>TF：{totalFloat}</div>

                  {/* 第2行 */}
                  <div style={{
                      padding: '2px',
                      borderRight: '1px solid #bbb' // 保留右侧内部线
                      // 移除 borderBottom，避免下方外轮廓
                  }}>LS：{ls}</div>
                  <div style={{
                      padding: '2px',
                      borderRight: '1px solid #bbb' // 保留右侧内部线
                      // 移除 borderBottom，避免下方外轮廓
                  }}>LF：{lf}</div>
                  <div style={{
                      padding: '2px'
                      // 无右侧和下方边框，避免外轮廓
                  }}>FF：{freeFloat}</div>
              </div>
          </NodeToolbar>

          {/* 左侧输入桩：连接紧前工作 */}
          <Handle type="target" position={Position.Left} id="left" style={{background: '#888', visibility: 'hidden'}}/>

          {/* 节点内容 */}
          <div style={{
              fontSize: '24px',
              fontWeight: 500,
              color: selected ? '#874d00' : '#595959'
          }}>
              {data.label as string}
          </div>


          {/* 右侧输出桩：连接紧后工作 */}
          <Handle type="source" position={Position.Right} id="right"
                  style={{background: '#888', visibility: 'hidden'}}/>


      </div>
  );
};

export default ActivityNode;

