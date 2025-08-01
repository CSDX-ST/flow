"use client"

import { useEffect, useRef, memo } from "react"
import { useStore } from "@xyflow/react"

interface TrianglesBackgroundProps {
  /** Size of triangles in pixels */
  size?: number
  /** Gap between triangles in pixels */
  gap?: number
  /** Primary color of triangles */
  color?: string
  /** Secondary color for alternating triangles */
  alternateColor?: string
  /** Background color */
  backgroundColor?: string
  /** Opacity of triangles (0-1) */
  opacity?: number
  /** Whether to use a random pattern */
  random?: boolean
  /** Random seed for consistent randomness */
  seed?: number
  /** Whether to animate the triangles */
  animate?: boolean
  /** Animation speed (lower is faster) */
  animationSpeed?: number
  /** Pattern style: 'grid', 'staggered', or 'random' */
  pattern?: "grid" | "staggered" | "random"
  /** Whether to invert the triangles */
  invert?: boolean
  /** Whether to rotate the triangles */
  rotate?: boolean
}

const TrianglesBackground = ({
  size = 30,
  gap = 2,
  color = "#91a7ff",
  alternateColor = "#5c7cfa",
  backgroundColor = "transparent",
  opacity = 0.2,
  random = false,
  seed = 42,
  animate = false,
  animationSpeed = 100,
  pattern = "grid",
  invert = false,
  rotate = false,
}: TrianglesBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const timeRef = useRef<number>(0)

  // Get the transform from React Flow store
  const transform = useStore((state) => state.transform)
  const [x, y, zoom] = transform

  // Pseudo-random number generator with seed
  const seededRandom = (seed: number) => {
    return () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
  }

  const drawTriangles = (ctx: CanvasRenderingContext2D, width: number, height: number, time = 0) => {
    ctx.clearRect(0, 0, width, height)

    if (backgroundColor !== "transparent") {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)
    }

    const random = seededRandom(seed)

    // Important: We need to apply the React Flow transform to our canvas
    ctx.save()
    ctx.translate(x, y)
    ctx.scale(zoom, zoom)

    // Calculate the visible area in the untransformed coordinate space
    // This is key to fixing the scaling issue
    const visibleStartX = -x / zoom
    const visibleStartY = -y / zoom
    const visibleEndX = visibleStartX + width / zoom
    const visibleEndY = visibleStartY + height / zoom

    // Calculate how many triangles we need based on the visible area
    const totalSize = size + gap
    const startCol = Math.floor(visibleStartX / totalSize) - 1
    const startRow = Math.floor(visibleStartY / totalSize) - 1
    const endCol = Math.ceil(visibleEndX / totalSize) + 1
    const endRow = Math.ceil(visibleEndY / totalSize) + 1

    // Draw triangles
    for (let gridX = startCol; gridX < endCol; gridX++) {
      for (let gridY = startRow; gridY < endRow; gridY++) {
        const posX = gridX * totalSize
        const posY = gridY * totalSize

        // Adjust position based on pattern
        let adjustedX = posX
        const adjustedY = posY

        if (pattern === "staggered" && gridY % 2 === 1) {
          adjustedX += totalSize / 2
        }

        // Determine if we should draw this triangle based on random pattern
        if (pattern === "random" && random() > 0.5) {
          continue
        }

        // Animation offset
        let animOffset = 0
        if (animate) {
          animOffset = Math.sin(time / animationSpeed + gridX * 0.1 + gridY * 0.1) * 5
        }

        // Choose color
        const useAlternateColor = (gridX + gridY) % 2 === 0
        ctx.fillStyle = useAlternateColor ? alternateColor : color
        ctx.globalAlpha = opacity

        // Save context for rotation if needed
        if (rotate) {
          ctx.save()
          const centerX = adjustedX + size / 2
          const centerY = adjustedY + size / 2
          ctx.translate(centerX, centerY)
          ctx.rotate((time / animationSpeed / 10) % (Math.PI * 2))
          ctx.translate(-centerX, -centerY)
        }

        // Draw triangle
        ctx.beginPath()

        if (invert) {
          // Inverted triangle (pointing down)
          ctx.moveTo(adjustedX, adjustedY + animOffset)
          ctx.lineTo(adjustedX + size, adjustedY + animOffset)
          ctx.lineTo(adjustedX + size / 2, adjustedY + size + animOffset)
        } else {
          // Regular triangle (pointing up)
          ctx.arc(adjustedX, adjustedY + size + animOffset, size / 5, 0, Math.PI * 2)
          // ctx.moveTo(adjustedX, adjustedY + size + animOffset)
          // ctx.lineTo(adjustedX + size, adjustedY + size + animOffset)
          // ctx.lineTo(adjustedX + size / 2, adjustedY + animOffset)
        }

        ctx.closePath()
        ctx.fill()

        if (rotate) {
          // Restore context after rotation
          ctx.restore()
        }
      }
    }

    // Restore the canvas context to remove our transform
    ctx.restore()
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeObserver = new ResizeObserver(() => {
      // Set canvas dimensions to match its display size
      const { width, height } = canvas.getBoundingClientRect()

      // Important: Set the canvas dimensions to match the display size
      // This ensures proper rendering at the correct resolution
      canvas.width = width
      canvas.height = height

      drawTriangles(ctx, width, height, timeRef.current)
    })

    resizeObserver.observe(canvas)

    // Initial draw
    const { width, height } = canvas.getBoundingClientRect()
    canvas.width = width
    canvas.height = height
    drawTriangles(ctx, width, height)

    // Animation loop
    if (animate || rotate) {
      const animateTriangles = (timestamp: number) => {
        timeRef.current = timestamp
        const { width, height } = canvas.getBoundingClientRect()
        drawTriangles(ctx, width, height, timestamp)
        animationRef.current = requestAnimationFrame(animateTriangles)
      }

      animationRef.current = requestAnimationFrame(animateTriangles)
    }

    return () => {
      resizeObserver.disconnect()
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [
    size,
    gap,
    color,
    alternateColor,
    backgroundColor,
    opacity,
    random,
    seed,
    animate,
    animationSpeed,
    pattern,
    invert,
    rotate,
  ])

  // Redraw when React Flow transform changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    drawTriangles(ctx, canvas.width, canvas.height, timeRef.current)
  }, [transform])

  return (
    <div
      className="react-flow__triangles-background"
      style={{ position: "absolute", width: "100%", height: "100%", top: 0, left: 0, pointerEvents: "none" }}
    >
      <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />
    </div>
  )
}

export default memo(TrianglesBackground)
