"use client"
import { Handle, Position, type NodeProps } from "@xyflow/react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ChevronDown, ChevronUp, Calculator } from "lucide-react"
import React from "react"

interface CalculationNodeData {
  label: string
  operation: string
  inputs: { [key: string]: number }
  result: number
}

const operationSymbols: { [key: string]: string } = {
  add: "+",
  multiply: "×",
  divide: "÷",
  square: "x²",
  subtract: "-",
}

const operationDescriptions: { [key: string]: string } = {
  add: "加法运算",
  multiply: "乘法运算",
  divide: "除法运算",
  square: "平方运算",
  subtract: "减法运算",
}

const CalculationNode = React.memo(({ data }: NodeProps<CalculationNodeData>) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false)

  const symbol = operationSymbols[data.operation] || "?"
  const description = operationDescriptions[data.operation] || "未知运算"

  const inputA = data.inputs["input-a"] || 0
  const inputB = data.inputs["input-b"] || 0

  return (
    <Card className="min-w-[200px] border-2 border-green-300 bg-green-50">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-green-800 flex items-center gap-2">
          <Calculator className="h-4 w-4" />
          <span className="flex-1">{data.label}</span>
          <Button
            size="sm"
            variant="ghost"
            className="h-4 w-4 p-0 nodrag hover:bg-green-100"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? <ChevronDown className="h-2 w-2" /> : <ChevronUp className="h-2 w-2" />}
          </Button>
          <Badge variant="secondary" className="text-xs bg-green-200 text-green-800">
            {symbol}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          {/* 折叠时显示简化信息 */}
          {isCollapsed ? (
            <div className="bg-green-100 p-2 rounded border border-green-200">
              <div className="text-xs text-green-700 mb-1">结果:</div>
              <div className="font-mono text-sm font-bold text-green-800">{data.result.toFixed(2)}</div>
            </div>
          ) : (
            <>
              <div className="text-xs text-green-700">{description}</div>

              <div className="bg-white p-2 rounded border">
                <div className="text-xs text-gray-600 mb-1">输入数据:</div>
                <div className="font-mono text-xs space-y-1">
                  {data.operation !== "square" && (
                    <>
                      <div>A: {inputA.toFixed(2)}</div>
                      <div>B: {inputB.toFixed(2)}</div>
                    </>
                  )}
                  {data.operation === "square" && <div>输入: {inputA.toFixed(2)}</div>}
                </div>
              </div>

              <div className="bg-green-100 p-2 rounded border border-green-200">
                <div className="text-xs text-green-700 mb-1">计算结果:</div>
                <div className="font-mono text-sm font-bold text-green-800">{data.result.toFixed(2)}</div>
              </div>
            </>
          )}
        </div>
      </CardContent>

      {/* 输入句柄 */}
      <Handle
        type="target"
        position={Position.Left}
        id="input-a"
        style={{ top: "40%" }}
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
      {data.operation !== "square" && (
        <Handle
          type="target"
          position={Position.Left}
          id="input-b"
          style={{ top: "60%" }}
          className="w-3 h-3 bg-green-500 border-2 border-white"
        />
      )}

      {/* 输出句柄 */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className="w-3 h-3 bg-green-500 border-2 border-white"
      />
    </Card>
  )
})

CalculationNode.displayName = "CalculationNode"

export default CalculationNode
