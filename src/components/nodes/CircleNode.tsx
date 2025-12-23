import React from 'react';
import { NodeProps, Handle, Position } from '@xyflow/react';
import type {TableProps} from "tdesign-react";

interface CustomNodeData {
  id: string;
  position: { x: number; y: number };
  data: Record<string, unknown>; // 或自定义 data 结构

  // 单个字符串属性
  taskName: string;
  taskType: 'approval' | 'execution' | 'condition';
  assignee: string;
  label : string;
  value: number;

}


// 自定义圆形节点组件
export class CircleNode extends React.Component<NodeProps<CustomNodeData>> {
    render() {
        let {id, data, selected} = this.props;

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
                }}
            >
                {/* 顶部输入连接点 */}
                <Handle
                    id="atLeft"
                    type="target"
                    position={Position.Left}
                    style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#ffa940'
                    }}
                />


                {/* 节点内容 */}
                <div style={{
                    fontSize: '24px',
                    fontWeight: 500,
                    color: selected ? '#874d00' : '#595959'
                }}>
                    {data.label as string}
                </div>

                {/* 底部输出连接点 */}
                <Handle
                    id="atRight"
                    type="source"
                    position={Position.Right}
                    style={{
                        width: '8px',
                        height: '8px',
                        backgroundColor: '#ffa940'
                    }}
                />
                {/*<Handle*/}
                {/*    id="atTop"*/}
                {/*  type="source"*/}
                {/*  position={Position.Top}*/}
                {/*  style={{*/}
                {/*    width: '8px',*/}
                {/*    height: '8px',*/}
                {/*    backgroundColor: '#ffa940'*/}
                {/*  }}*/}
                {/*/>*/}
                {/*<Handle*/}
                {/*    id="atBottom"*/}
                {/*  type="source"*/}
                {/*  position={Position.Bottom}*/}
                {/*  style={{*/}
                {/*    width: '8px',*/}
                {/*    height: '8px',*/}
                {/*    backgroundColor: '#ffa940'*/}
                {/*  }}*/}
                {/*/>*/}
            </div>
        );
    }
}

