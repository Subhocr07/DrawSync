import { useState } from 'react'
import { Box, Button, Container, Link, TextField, Typography, Paper, Alert, Grid, InputAdornment, IconButton } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { AuthAPI } from '../lib/api'
import { useNavigate, Link as RouterLink } from 'react-router-dom'

export default function SignUp() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    try {
      await AuthAPI.register({ fullName, email, password })
      setSuccess('Registration successful! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1200)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    }
  }

  return (
      <Container maxWidth="sm" sx={{ minHeight: 'calc(100vh - 64px)', display: 'flex', alignItems: 'center', justifyContent: 'center', pt: 8 }}>
        <Paper elevation={8} sx={{ p: { xs: 3, md: 4 }, width: '100%', maxWidth: 520 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom textAlign="center">Create account</Typography>
          <Typography color="text.secondary" mb={3} textAlign="center">Join DrawSync and start collaborating.</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          <Box component="form" onSubmit={submit} display="flex" flexDirection="column" gap={2}>
            <TextField label="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required fullWidth />
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
            <Button type="submit" variant="contained" size="large">Sign Up</Button>
          </Box>
          <Typography mt={2} textAlign="center">Already have an account? <Link component={RouterLink} to="/login">Sign in</Link></Typography>
        </Paper>
      </Container>
  )
}

 
