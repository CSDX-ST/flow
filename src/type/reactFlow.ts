// types/reactFlow.ts
import type { Node } from "@xyflow/react";

// 边类型定义
// export type EdgeType = "basicArrowEdge" | "smoothstep" | "default" | "step" ;

// 操作日志接口
export interface OperationLog {
  id: string;
  timestamp: number;
  type: "input_change" | "calculation" | "formula_update" | "node_add" | "node_delete" | "node_rename";
  nodeId: string;
  nodeLabel: string;
  nodeType: string;
  details: string;
  oldValue?: any;
  newValue?: any;
  duration?: number;
}

// 节点重命名参数类型
export type RenameNodeParams = {
  nodeId: string;
  newLabel: string;
};

// XY轴更新参数类型
export type UpdateNodePositionParams = {
  id: string;
  newPosition: { x: number; y: number };
};