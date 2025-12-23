
import {BasicValueOutputNode, InputNode, OutputNode, TestMutilOutputNode,BasicOperation} from "./nodes/BasicNodes";
import {DatabaseNode} from "./nodes/DatabaseNodetest";
import {OutputNodesss} from "./nodes/OutputNode";
import {CircleNode} from "./nodes/CircleNode";
import ActivityNode from './nodes/ActivityNode';

const nodeTypes = {
  inputNode: InputNode,
  outputNode: OutputNode,
  testOutputNode:TestMutilOutputNode,
  database:DatabaseNode,
  basicoutput:BasicValueOutputNode,
  BasicOperation:BasicOperation,
  outputNodesss:OutputNodesss,
  CircleNode:CircleNode,
  ActivityNode:ActivityNode,
};

export default nodeTypes;