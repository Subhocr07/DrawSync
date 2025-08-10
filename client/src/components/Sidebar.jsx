import { useEffect, useState } from 'react'
import { Box, Button, Divider, Drawer, List, ListItem, ListItemButton, ListItemText, TextField, Typography, IconButton, Tooltip } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
// import MenuIcon from '@mui/icons-material/Menu'
import { useAtom } from 'jotai'
import { sidebarOpenAtom } from '../lib/uiState'
import { CanvasAPI } from '../lib/api'
import { useNavigate } from 'react-router-dom'

export default function Sidebar({ open, onClose }) {
  const [canvases, setCanvases] = useState([])
  const [name, setName] = useState('')
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)

  const load = async () => {
    const data = await CanvasAPI.list()
    setCanvases(data)
  }

  useEffect(() => { load() }, [])

  const create = async () => {
    if (!name.trim()) return
    const canvas = await CanvasAPI.create({ name })
    setName('')
    await load()
    navigate(`/canvas/${canvas._id}`)
  }

  return (
    <>
    <Drawer
      open={sidebarOpen}
      onClose={() => setSidebarOpen(false)}
      variant="temporary"
      sx={{ display: { xs: 'block', md: 'none' }, '& .MuiDrawer-paper': { width: 280 } }}
    >
      {renderContent()}
    </Drawer>
    <Drawer open variant="permanent" sx={{ width: { xs: 0, md: 280 }, flexShrink: 0,
      display: { xs: 'none', md: 'block' },
      '& .MuiDrawer-paper': { width: 280, boxSizing: 'border-box' } }}>
      {renderContent()}
    </Drawer>
    </>
  )

  function renderContent() {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box p={2} display="flex" alignItems="center" gap={1}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Your Canvases</Typography>
          <Tooltip title="Create canvas"><IconButton size="small" onClick={create}><AddIcon /></IconButton></Tooltip>
        </Box>
        <Divider />
        <Box p={2}>
          <TextField size="small" fullWidth placeholder="New canvas name" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key==='Enter' && create()} />
          <Button sx={{ mt: 1 }} fullWidth variant="contained" onClick={create} startIcon={<AddIcon />}>Create</Button>
        </Box>
        <Divider />
        <List dense sx={{ flex: 1, overflowY: 'auto' }}>
          {canvases.map(c => (
            <ListItem key={c._id} disablePadding>
              <ListItemButton onClick={() => navigate(`/canvas/${c._id}`)}>
                <ListItemText primary={c.name} secondary={new Date(c.updatedAt).toLocaleString()} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    )
  }
}

 
