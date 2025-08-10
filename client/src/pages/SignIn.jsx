import { useState } from 'react'
import { Box, Button, Container, Link, TextField, Typography, Paper, Alert, IconButton, InputAdornment } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { AuthAPI } from '../lib/api'
import { setAuth } from '../lib/auth'
import { useNavigate, Link as RouterLink } from 'react-router-dom'

export default function SignIn() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const data = await AuthAPI.login({ email, password })
      setAuth(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    }
  }

  return (
      <Container maxWidth="sm" sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 8 }}>
        <Paper elevation={8} sx={{ p: { xs: 3, md: 4 }, width: '100%', maxWidth: 520 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center">Welcome back</Typography>
          <Typography color="text.secondary" mb={3} textAlign="center">Sign in to continue collaborating in real-time.</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box component="form" onSubmit={submit} display="flex" flexDirection="column" gap={2}>
            <TextField label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required fullWidth />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Button type="submit" variant="contained" size="large">Sign In</Button>
          </Box>
          <Typography mt={2} textAlign="center">Don't have an account? <Link component={RouterLink} to="/register">Create one</Link></Typography>
        </Paper>
      </Container>
  )
}

 
