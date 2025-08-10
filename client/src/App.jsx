import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Dashboard from './pages/Dashboard'
import CanvasPage from './pages/CanvasPage'
import RequireAuth from './components/RequireAuth'
import TopNav from './components/TopNav'

const theme = createTheme({ palette: { mode: 'light' } })

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* TopNav is also rendered inside Dashboard for consistent spacing; we add it globally to show auth links on other routes */}
      <TopNav />
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/canvas/:id" element={<RequireAuth><CanvasPage /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
