import { useEffect, useState } from 'react'
import { AppBar, Box, Button, Toolbar, Typography, Badge, Fab, Drawer, Avatar, Stack } from '@mui/material'
import ChatIcon from '@mui/icons-material/Chat'
import Sidebar from '../components/Sidebar'
import { useAtom } from 'jotai'
import { sidebarOpenAtom } from '../lib/uiState'
import CanvasBoard from '../components/CanvasBoard'
import ChatPanel from '../components/ChatPanel'
import { onPresence } from '../lib/socket'
import { useNavigate, useParams } from 'react-router-dom'
import { CanvasAPI } from '../lib/api'
import { clearAuth, getUser } from '../lib/auth'
import { getSocket } from '../lib/socket'

export default function CanvasPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = getUser()
  const [canvas, setCanvas] = useState(null)
  const [chatOpen, setChatOpen] = useState(false)
  const [unread, setUnread] = useState(0)
  const [onlineUsers, setOnlineUsers] = useState([])
  const [sidebarOpen] = useAtom(sidebarOpenAtom)

  useEffect(() => {
    CanvasAPI.get(id).then(setCanvas)
  }, [id])

  useEffect(() => {
    // presence listener
    const off = onPresence((users) => setOnlineUsers(users))
    return off
  }, [])

  const logout = () => { clearAuth(); navigate('/login') }
  const clearAll = () => getSocket().emit('clear-canvas', { canvasId: id })

  // unread counter via global socket listener
  useEffect(() => {
    const s = getSocket()
    const onMsg = () => {
      if (!chatOpen) setUnread((u) => u + 1)
    }
    s.on('chat-message', onMsg)
    return () => s.off('chat-message', onMsg)
  }, [chatOpen])

  if (!canvas) return null

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1400 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>{canvas.name}</Typography>
          <Typography sx={{ mr: 2 }}>{user?.fullName}</Typography>
          <Button onClick={clearAll} color="inherit">Clear</Button>
          <Button color="inherit" onClick={logout}>Logout</Button>
        </Toolbar>
      </AppBar>
      <Sidebar open={sidebarOpen} onClose={() => {}} />
      <Box component="main" sx={{ flexGrow: 1, p: 2, mt: 8, display: 'flex', gap: 2, height: 'calc(100vh - 64px)', position: 'relative' }}>
        <Box sx={{ flex: 1, minWidth: 0, height: '100%' }}>
          <CanvasBoard canvasId={id} initialStrokes={canvas.strokes} onClear={() => {}} />
        </Box>

        <Fab color="primary" sx={{ position: 'absolute', right: 24, bottom: 24 }} onClick={() => { setChatOpen(true); setUnread(0) }}>
          <Badge color="error" badgeContent={unread} overlap="circular">
            <ChatIcon />
          </Badge>
        </Fab>

        <Drawer anchor="right" open={chatOpen} onClose={() => setChatOpen(false)} sx={{ '& .MuiDrawer-paper': { width: { xs: 320, sm: 360, md: 380 } } }}>
          <Box sx={{ p: 2, borderBottom: '1px solid #eee' }}>
            <Typography variant="subtitle1">Chat</Typography>
            <Typography variant="caption" color="text.secondary">Online</Typography>
            <Stack direction="row" spacing={1} mt={1} sx={{ flexWrap: 'wrap' }}>
              {onlineUsers.map((u) => (
                <Avatar key={u._id} sx={{ width: 28, height: 28 }}>{(u.fullName || 'U').charAt(0).toUpperCase()}</Avatar>
              ))}
            </Stack>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <ChatPanel canvasId={id} />
          </Box>
        </Drawer>
      </Box>
    </Box>
  )
}

 
