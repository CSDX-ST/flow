// constants/reactFlow.ts
import { MarkerType, ConnectionLineType } from "@xyflow/react";

// 背景配置
export const BACKGROUND_SETTINGS = {
  gap: 50,
  size: 15,
  color: "#94a3b8",
  offsetX: 0,
  offsetY: 0,
};

// 边样式配置
export const EDGE_STYLE = {
  stroke: "#FF0072",
  strokeWidth: 2,
};

// 箭头标记配置
export const MARKER_END_CONFIG = {
  type: MarkerType.ArrowClosed,
  width: 30,
  height: 30,
  color: "#FF0072",
};

// 其他常量
export const NODE_ORIGIN= [0, 0.5] as const;
export const DELETE_KEY = "Delete";
export const DEFAULT_CONNECTION_LINE_TYPE = ConnectionLineType.Straight;
export const PRO_OPTIONS = { hideAttribution: true };