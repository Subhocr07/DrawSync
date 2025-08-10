import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getToken } from '../lib/auth'

export default function RequireAuth({ children }) {
  const navigate = useNavigate()
  useEffect(() => {
    const token = getToken()
    if (!token) navigate('/login')
  }, [navigate])
  return children
}

 
