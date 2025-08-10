import { Box, Container, Typography, Grid, Paper, Button } from '@mui/material'
import Sidebar from '../components/Sidebar'
import { useAtom } from 'jotai'
import { sidebarOpenAtom } from '../lib/uiState'
import TopNav from '../components/TopNav'
import { getUser } from '../lib/auth'
import { Link as RouterLink } from 'react-router-dom'

export default function Dashboard() {
  const user = getUser()
  const [sidebarOpen] = useAtom(sidebarOpenAtom)
  return (
    <Box sx={{ display: 'flex' }}>
      <TopNav />
      {!!user && <Sidebar open={sidebarOpen} onClose={() => {}} />}
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" gutterBottom>Welcome to DrawSync</Typography>
          <Typography color="text.secondary" gutterBottom>
            Real-time collaborative whiteboard with chat. Create or select a canvas from the sidebar to start.
          </Typography>
          {!user && (
            <Box mt={3} display="flex" gap={2}>
              <Button variant="contained" component={RouterLink} to="/login">Login</Button>
              <Button variant="outlined" component={RouterLink} to="/register">Register</Button>
            </Box>
          )}
        </Container>
      </Box>
    </Box>
  )
}

 
