"use client"

import { useEffect, useRef, memo } from "react"
import { useStore,useReactFlow} from "@xyflow/react"

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

  // const { getZoom } = useReactFlow();
  // const zoomLevel =getZoom();
  // console.log("zoomLevel",zoomLevel)
  const [x, y, zoom] = transform

  console.log("transform", transform)

  // Pseudo-random number generator with seed
  const seededRandom = (seed: number) => {
    return () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }
  }

  const drawTriangles = (ctx: CanvasRenderingContext2D, width: number, height: number, time = 0) => {
    ctx.clearRect(0, 0, width, height)

    ctx.save()
    ctx.translate(x, y)
    ctx.scale(zoom, zoom)

    if (backgroundColor !== "transparent") {
      ctx.fillStyle = backgroundColor
      ctx.fillRect(0, 0, width, height)
    }
    // const dpr = window.devicePixelRatio || 1;
    // console.log("drawTriangles", dpr)

    const random = seededRandom(seed)
    const effectiveSize = size * zoom
    const effectiveGap = gap * zoom
    const totalSize =   effectiveGap

    // Calculate the visible area based on transform
    const startX = Math.floor(-x / zoom / totalSize) - 1
    const startY = Math.floor(-y / zoom / totalSize) - 1
    const endX = Math.ceil((width / zoom - x) / totalSize) + 1
    const endY = Math.ceil((height / zoom - y) / totalSize) + 1
    console.log("startX", startX, "startY", startY, "endX", endX, "endY", endY)

    // Draw triangles
    for (let gridX = startX; gridX < endX; gridX++) {
      for (let gridY = startY; gridY < endY; gridY++) {
        const posX = gridX * totalSize * zoom + x
        const posY = gridY * totalSize * zoom + y

        // Adjust position based on pattern
        let adjustedX = posX
        const adjustedY = posY

        if (pattern === "staggered" && gridY % 2 === 1) {
          adjustedX += (totalSize * zoom) / 2
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

        // Draw triangle
        ctx.beginPath()

        if (invert) {
          // Inverted triangle (pointing down)
          ctx.moveTo(adjustedX, adjustedY + animOffset)
          ctx.lineTo(adjustedX + effectiveSize, adjustedY + animOffset)
          ctx.lineTo(adjustedX + effectiveSize / 2, adjustedY + effectiveSize + animOffset)
        } else {
          // Regular triangle (pointing up)
          ctx.moveTo(adjustedX, adjustedY + effectiveSize + animOffset)
          ctx.lineTo(adjustedX + effectiveSize, adjustedY + effectiveSize + animOffset)
          ctx.lineTo(adjustedX + effectiveSize / 2, adjustedY + animOffset)
        }

        if (rotate) {
          // Rotate around center
          const centerX = adjustedX + effectiveSize / 2
          const centerY = adjustedY + effectiveSize / 2
          ctx.translate(centerX, centerY)
          ctx.rotate((time / animationSpeed / 10) % (Math.PI * 2))
          ctx.translate(-centerX, -centerY)
        }

        ctx.closePath()
        ctx.fill()

        if (rotate) {
          // Reset transformation
          ctx.setTransform(1, 0, 0, 1, 0, 0)
        }
      }
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
    if (!ctx) return

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = canvas.getBoundingClientRect()
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
    if (animate) {
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

    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
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
