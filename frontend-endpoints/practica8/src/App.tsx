
import type { SubmitEvent } from 'react'
import { UserList } from './UserList'
import { useCallback, useState } from 'react'

export default function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState<string | null>(() =>
  localStorage.getItem('token'),
)
  const [error, setError] = useState<string | null>(null)
const handleUnauthorized = useCallback(() => {
  localStorage.removeItem('token')
  setToken(null)
  setPassword('')
  setError('Tu sesión venció')
}, [])
async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
  event.preventDefault()
  setError(null)

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (!response.ok) {
      setError(typeof data.detail === 'string' ? data.detail : 'No se pudo iniciar sesión.')
      return
    }
    localStorage.setItem('token', data.token)

    setToken(data.token)
  } catch {
    setError('No se pudo completar el login. Verificá que FastAPI esté corriendo.')
  }
}
  function logout() {
    localStorage.removeItem('token')
    setToken(null)
    setPassword('')
  }

  if (token) {
    return (
      <>
        <button type="button" onClick={logout}>
          Salir
        </button>
        <UserList token={token} onUnauthorized={handleUnauthorized} />
      </>
    )
  }
  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>

      <label htmlFor="email">Correo electrónico</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label htmlFor="password">Contraseña</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />

      <button type="submit">Ingresar</button>
      {error && <p role="alert">{error}</p>}
    </form>
  )
}