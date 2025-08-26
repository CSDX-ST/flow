"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gauge, HardDrive } from "lucide-react"

export function ResourceMonitor() {
  const [fps, setFps] = useState<number>(0)
  const [memory, setMemory] = useState<number>(0)
  const frameRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(performance.now())
  const framesRef = useRef<number[]>([])

  // Calculate FPS
  useEffect(() => {
    let animationFrameId: number

    const calculateFps = (time: number) => {
      // Calculate time difference since last frame
      const timeDiff = time - lastTimeRef.current
      lastTimeRef.current = time

      // Add current frame time to the frames array
      framesRef.current.push(timeDiff)

      // Keep only the last 30 frames for calculating average
      if (framesRef.current.length > 30) {
        framesRef.current.shift()
      }

      // Calculate average FPS from the frames array
      const avgFrameTime = framesRef.current.reduce((a, b) => a + b, 0) / framesRef.current.length
      const currentFps = Math.round(1000 / avgFrameTime)

      // Update FPS state (but not too frequently to avoid excessive re-renders)
      if (frameRef.current % 10 === 0) {
        setFps(currentFps)
      }

      frameRef.current++
      animationFrameId = requestAnimationFrame(calculateFps)
    }

    animationFrameId = requestAnimationFrame(calculateFps)

    return () => {
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Simulate memory usage (or use actual memory API if available)
  useEffect(() => {
    const updateMemory = () => {
      // Try to use actual memory info if available
      if (performance && "memory" in performance) {
        // TypeScript doesn't know about the memory property by default
        const memoryInfo = (performance as any).memory
        if (memoryInfo) {
          // Calculate memory usage percentage
          const usedMemory = memoryInfo.usedJSHeapSize
          const totalMemory = memoryInfo.jsHeapSizeLimit
          const memoryPercentage = Math.round((usedMemory / totalMemory) * 100)
          setMemory(memoryPercentage)
          return
        }
      }

      // Fallback to simulated memory if actual API not available
      // This simulates memory gradually increasing and occasionally decreasing
      setMemory((prev) => {
        const change = Math.random() * 5 - 1 // Random value between -1 and 4
        const newValue = prev + change
        return Math.min(Math.max(Math.round(newValue), 20), 95) // Keep between 20-95%
      })
    }

    const interval = setInterval(updateMemory, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <Card className="w-42 text-gray-800/80 fixed -bottom-2 -left-2 z-11 border-0 select-none absolute">
      {/*<CardHeader className="pb-2">*/}
      {/*  <CardTitle className="text-sm font-medium">性能监控</CardTitle>*/}
      {/*</CardHeader>*/}
        <CardContent className="flex items-center justify-between space-x-4 pt-2 pb-2">
          {/* 第一个项目 */}
            {/*<Gauge className="h-4 w-4 text-blue-500" />*/}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-medium">FPS</span>
              <div className="text-xs font-medium ">{fps}</div>
            </div>
          {/* 第二个项目 */}
            {/*<HardDrive className="h-4 w-4 text-green-500" />*/}
              <div className="flex items-center gap-1.5">
                  <span className="text-xs font-medium">内存</span>
                  <div className="text-xs font-medium">{memory}</div>
                  <span className="text-xs font-medium">%</span>
              </div>

        </CardContent>
    </Card>
  )
}
