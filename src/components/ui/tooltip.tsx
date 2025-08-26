"use client"

import * as React from "react"
import { Tooltip as TdTooltip, TooltipProps } from "tdesign-react"
import { cn } from "@/lib/utils"

// 简化 Provider，TDesign 不需要单独的 Provider
function TooltipProvider(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} />
}

// 主 Tooltip 组件，使用 TDesign 的 TooltipProps 类型
function Tooltip({
  className,
  children,
  ...props
}: TooltipProps & { className?: string }) {
  return (
    <TdTooltip
      // TDesign 使用 popupClassName 设置提示框样式

      {...props}
    >
      {children}
    </TdTooltip>
  )
}

// 触发元素组件
function TooltipTrigger({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn("data-slot-tooltip-trigger", className)}
      {...props}
    >
      {children}
    </span>
  )
}

// 提示内容组件
function TooltipContent({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <div
      className={cn(
        "bg-primary text-primary-foreground px-3 py-1.5 text-xs rounded-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
