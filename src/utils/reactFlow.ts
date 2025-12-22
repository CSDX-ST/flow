// utils/reactFlow.ts
// 节点ID计数器
let nodeIdCounter = 1;

/**
 * 生成唯一节点ID
 * @returns 节点ID字符串
 */
export const generateNodeId = (): string => `${nodeIdCounter++}`;