import { useEffect, useRef, useState } from 'react'
import { Box, IconButton, List, ListItem, ListItemText, TextField, Typography, Divider, Avatar, ListItemAvatar, Paper } from '@mui/material'
import SendIcon from '@mui/icons-material/Send'
import { getSocket } from '../lib/socket'
import { getUser } from '../lib/auth'
import { CanvasAPI } from '../lib/api'

export default function ChatPanel({ canvasId }) {
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const listRef = useRef(null)
  const me = getUser()

  useEffect(() => {
    const load = async () => {
      const data = await CanvasAPI.getMessages(canvasId)
      setMessages(data)
      scrollToBottom()
    }
    load()
  }, [canvasId])

  useEffect(() => {
    const socket = getSocket()
    const onMessage = (msg) => {
      setMessages((m) => [...m, msg])
      scrollToBottom()
    }
    socket.on('chat-message', onMessage)
    return () => socket.off('chat-message', onMessage)
  }, [])

  const scrollToBottom = () => {
    setTimeout(() => listRef.current?.lastElementChild?.scrollIntoView({ behavior: 'smooth' }), 0)
  }

  const send = () => {
    if (!text.trim()) return
    getSocket().emit('chat-message', { canvasId, userId: me.id, text })
    setText('')
  }

  const formatTime = (d) => {
    try {
      const date = new Date(d)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  return (
    <Box sx={{ width: { xs: 280, sm: 320, md: 360 }, borderLeft: '1px solid #eee', display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box p={1}>
        <Typography variant="subtitle1">Chat</Typography>
      </Box>
      <Divider />
      <List ref={listRef} sx={{ flex: 1, overflowY: 'auto', px: 1, py: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
        {messages.map((m) => {
          const isMe = (m.sender?._id || m.sender) === me.id
          const name = m.sender?.fullName || (isMe ? 'You' : 'User')
          return (
            <ListItem key={m._id} sx={{ display: 'flex', gap: 1, alignItems: 'flex-end', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
              {!isMe && (
                <ListItemAvatar sx={{ alignSelf: 'flex-end' }}>
                  <Avatar>{name.charAt(0).toUpperCase()}</Avatar>
                </ListItemAvatar>
              )}
              <Box sx={{ maxWidth: '75%' }}>
                {!isMe && (
                  <Typography variant="caption" color="text.secondary">{name}</Typography>
                )}
                <Paper elevation={0} sx={{
                  px: 1.5, py: 1,
                  bgcolor: isMe ? 'primary.main' : 'grey.100',
                  color: isMe ? 'primary.contrastText' : 'text.primary',
                  borderRadius: 2,
                }}>
                  <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{m.text}</Typography>
                  <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', opacity: 0.7, mt: 0.5 }}>
                    {formatTime(m.createdAt)}
                  </Typography>
                </Paper>
              </Box>
              {isMe && (
                <ListItemAvatar sx={{ alignSelf: 'flex-end', ml: 1 }}>
                  <Avatar sx={{ bgcolor: 'primary.main', color: 'primary.contrastText' }}>{(me.fullName || 'Y').charAt(0).toUpperCase()}</Avatar>
                </ListItemAvatar>
              )}
            </ListItem>
          )
        })}
      </List>
      <Divider />
      <Box p={1} display="flex" gap={1}>
        <TextField
          size="small"
          fullWidth
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <IconButton color="primary" onClick={send}>
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

 
