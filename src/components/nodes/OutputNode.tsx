"use client"

import { useCallback } from "react"
import { Handle, Position } from "@xyflow/react"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { CopyIcon, CheckIcon } from "lucide-react"

import { CopyIcon, CheckIcon} from "tdesign-icons-react"
import {Button,Card} from "tdesign-react"
import { useState } from "react"

export function OutputNodesss({ id, data }) {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = useCallback(() => {
    if (data.value !== null) {
      navigator.clipboard.writeText(data.value.toString())
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }, [data.value])

  return (
    <Card className="w-64 shadow-md border-2 border-purple-500 dark:border-purple-400">
      <div className="p-3 pb-0">
        <div className="text-sm font-medium">{data.label || "Output Node"}</div>
      </div>
      <div className="p-3">
        <div className="space-y-3">
          <div>
            <div className="font-medium text-sm">Result:</div>
            <div className="mt-1 p-3 bg-muted rounded-md min-h-[2.5rem] flex items-center justify-center">
              {data.value !== null ? (
                <span className="font-mono">{data.value}</span>
              ) : (
                <span className="text-muted-foreground text-sm">No data</span>
              )}
            </div>
          </div>

          <Button

            variant="outline"
            className="w-full"
            onClick={copyToClipboard}
            disabled={data.value === null}
          >
            {copied ? (
              <>
                <CheckIcon className="h-4 w-4 mr-2" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="h-4 w-4 mr-2" />
                Copy Result
              </>
            )}
          </Button>
        </div>

        <Handle type="target" position={Position.Top} id="input" className="w-3 h-3 bg-purple-500 dark:bg-purple-400" />
      </div>
    </Card>
  )
}

