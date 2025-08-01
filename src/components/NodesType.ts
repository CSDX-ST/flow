
import {BasicValueOutputNode, InputNode, OutputNode, TestMutilOutputNode,BasicOperation} from "./nodes/BasicNodes";
import {DatabaseNode} from "./nodes/DatabaseNodetest";
import {OutputNodesss} from "./nodes/OutputNode";
import {CircleNode} from "./nodes/CircleNode";

const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
  testOutputNode:TestMutilOutputNode,
  database:DatabaseNode,
  basicoutput:BasicValueOutputNode,
  BasicOperation:BasicOperation,
  outputNodesss:OutputNodesss,
  CircleNode:CircleNode,
};

export default nodeTypes;