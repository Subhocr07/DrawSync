import { AppBar, Toolbar, Typography, Button, Box, Container, Avatar, IconButton, Tooltip } from '@mui/material'
import DrawIcon from '@mui/icons-material/Draw'
import MenuIcon from '@mui/icons-material/Menu'
import { useAtom } from 'jotai'
import { sidebarOpenAtom } from '../lib/uiState'
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom'
import { clearAuth, getUser } from '../lib/auth'

export default function TopNav() {
  const user = getUser()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useAtom(sidebarOpenAtom)

  const logout = () => {
    clearAuth()
    navigate('/login')
  }

  const initials = (user?.fullName || '').split(' ').map(s => s[0]).join('').slice(0,2).toUpperCase()

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        backdropFilter: 'blur(8px)',
        bgcolor: 'rgba(255,255,255,0.7)',
        color: 'text.primary',
        borderBottom: '1px solid rgba(0,0,0,0.08)'
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 64 }}>
          <Box component={RouterLink} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'inherit', mr: 2 }}>
            <DrawIcon sx={{ mr: 1 }} />
            <Typography variant="h6" fontWeight={700}>DrawSync</Typography>
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          {user && (
            <Tooltip title="Toggle sidebar">
              <IconButton sx={{ display: { xs: 'inline-flex', md: 'none' } }} onClick={() => setSidebarOpen(!sidebarOpen)}>
                <MenuIcon />
              </IconButton>
            </Tooltip>
          )}
          {!user ? (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {location.pathname !== '/login' && (
                <Button variant="text" color="inherit" component={RouterLink} to="/login">Login</Button>
              )}
              {location.pathname !== '/register' && (
                <Button variant="contained" color="primary" component={RouterLink} to="/register">Register</Button>
              )}
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Avatar sx={{ width: 28, height: 28 }}>{initials || 'U'}</Avatar>
              <Typography sx={{ display: { xs: 'none', sm: 'block' } }}>{user.fullName}</Typography>
              <Button variant="outlined" size="small" onClick={logout}>Logout</Button>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}


