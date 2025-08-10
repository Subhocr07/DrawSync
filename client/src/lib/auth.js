const TOKEN_KEY = 'drawsync_token'
const USER_KEY = 'drawsync_user'

export const setAuth = ({ token, user }) => {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export const getToken = () => localStorage.getItem(TOKEN_KEY)
export const getUser = () => {
  const v = localStorage.getItem(USER_KEY)
  return v ? JSON.parse(v) : null
}

 
