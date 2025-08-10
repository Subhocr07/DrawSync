import { useEffect, useRef, useState } from 'react'
import { getSocket } from '../lib/socket'
import { getUser } from '../lib/auth'
import { Box, IconButton, Slider, Tooltip } from '@mui/material'
import ColorLensIcon from '@mui/icons-material/ColorLens'
import BrushIcon from '@mui/icons-material/Brush'

export default function CanvasBoard({ canvasId, initialStrokes = [], onClear }) {
  const canvasRef = useRef(null)
  const [strokes, setStrokes] = useState(initialStrokes)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#111')
  const [width, setWidth] = useState(3)
  const [currentStroke, setCurrentStroke] = useState({ points: [], color: '#111', width: 3, user: null })

  useEffect(() => {
    setStrokes(initialStrokes)
  }, [initialStrokes])

  useEffect(() => {
    const socket = getSocket()
    const user = getUser()
    socket.emit('join-canvas', { canvasId, userId: user?.id })
    const onRemoteStroke = ({ stroke }) => {
      setStrokes((s) => [...s, stroke])
      drawStroke(stroke)
    }
    const onRemoteClear = () => {
      clearCanvas()
      setStrokes([])
      onClear?.()
    }
    const onSetStrokes = ({ strokes }) => {
      setStrokes(strokes)
      clearCanvas()
      strokes.forEach(drawStroke)
    }
    socket.on('draw-stroke', onRemoteStroke)
    socket.on('clear-canvas', onRemoteClear)
    socket.on('set-strokes', onSetStrokes)
    return () => {
      socket.off('draw-stroke', onRemoteStroke)
      socket.off('clear-canvas', onRemoteClear)
      socket.off('set-strokes', onSetStrokes)
    }
  }, [canvasId, onClear])

  useEffect(() => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    clearCanvas()
    strokes.forEach(drawStroke)
  }, [strokes])

  useEffect(() => {
    // make canvas fill its container responsively
    const resize = () => {
      const el = canvasRef.current
      if (!el) return
      const parent = el.parentElement
      el.width = Math.max(300, parent.clientWidth)
      el.height = Math.max(300, parent.clientHeight)
      clearCanvas()
      strokes.forEach(drawStroke)
    }
    resize()
    window.addEventListener('resize', resize)
    return () => window.removeEventListener('resize', resize)
  }, [strokes])

  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const drawStroke = (stroke) => {
    const ctx = canvasRef.current.getContext('2d')
    if (stroke.points.length < 2) return
    ctx.strokeStyle = stroke.color
    ctx.lineWidth = stroke.width
    ctx.beginPath()
    ctx.moveTo(stroke.points[0].x, stroke.points[0].y)
    for (let i = 1; i < stroke.points.length; i++) {
      ctx.lineTo(stroke.points[i].x, stroke.points[i].y)
    }
    ctx.stroke()
  }

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d')
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
  }

  const onMouseDown = (e) => {
    const user = getUser()
    setIsDrawing(true)
    const p = getPos(e)
    setCurrentStroke({ points: [p], color, width, user: user?.id })
  }
  const onMouseMove = (e) => {
    if (!isDrawing) return
    const p = getPos(e)
    setCurrentStroke((s) => ({ ...s, points: [...s.points, p] }))
    drawStroke({ ...currentStroke, points: [...currentStroke.points, p] })
  }
  const onMouseUp = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    const stroke = currentStroke
    setStrokes((s) => [...s, stroke])
    getSocket().emit('draw-stroke', { canvasId, stroke })
    setCurrentStroke({ points: [], color, width, user: null })
  }

  // Undo and Clear removed per request

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      <canvas
        ref={canvasRef}
        style={{ border: '1px solid #ddd', borderRadius: 8, background: '#fff', width: '100%', height: '100%' }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      />

      <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: 'rgba(255,255,255,0.9)', p: 1.5, borderRadius: 3, boxShadow: 1, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Tooltip title="Brush color"><IconButton component="label"><ColorLensIcon />
          <input type="color" hidden value={color} onChange={(e) => setColor(e.target.value)} />
        </IconButton></Tooltip>
        <Tooltip title="Brush size"><BrushIcon /></Tooltip>
        <Slider min={1} max={24} value={width} onChange={(_, v) => setWidth(v)} sx={{ width: { xs: 90, sm: 140 } }} />
      </Box>
    </Box>
  )
}

 
