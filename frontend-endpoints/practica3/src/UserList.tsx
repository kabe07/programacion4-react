import { useEffect, useState } from 'react'

interface User {
  id: number
  name: string
}
interface UserDetail extends User {
  email: string
  age: number
  country: { name: string } | null
  roles: { id: number; name: string }[]
}

export function UserList({ token }: { token: string }) {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [me, setMe] = useState<User | null>(null)
  const [meError, setMeError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null)
const [detailError, setDetailError] = useState<string | null>(null)
const [loading, setLoading] = useState(true)
const [searchInput, setSearchInput] = useState('')
const [searchName, setSearchName] = useState('')

  // Carga la lista de usuarios.
  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      try {
        const path = searchName
  ? `/user/search/${encodeURIComponent(searchName)}`
  : '/user'

const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
  headers: { Authorization: `Bearer ${token}` },
  signal: controller.signal,
})
          

        const data = await response.json()

        if (!response.ok) {
          setError(
            typeof data.detail === 'string'
              ? data.detail
              : 'No se pudieron cargar los usuarios.',
          )
          return
        }

        setUsers(data)
            } catch {
        if (!controller.signal.aborted) {
          setError('No se pudo conectar con la API.')
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }
      
    

    void loadUsers()

    return () => controller.abort()
  }, [token, searchName])

  // Busca el ID del usuario que inició sesión y luego pide sus datos.
  useEffect(() => {
    const controller = new AbortController()
    const apiUrl = import.meta.env.VITE_API_URL
    const options = {
      headers: { Authorization: `Bearer ${token}` },
      signal: controller.signal,
    }

    async function loadCurrentUser() {
      try {
        const idResponse = await fetch(`${apiUrl}/user/me/id`, options)
        if (!idResponse.ok) throw new Error()

        const { id } = await idResponse.json()

        const userResponse = await fetch(`${apiUrl}/user/${id}`, options)
        if (!userResponse.ok) throw new Error()

        setMe(await userResponse.json())
      } catch {
        if (!controller.signal.aborted) {
          setMeError('No se pudo cargar el usuario que inició sesión.')
        }
      }
    }

    void loadCurrentUser()

    return () => controller.abort()
  }, [token])

  useEffect(() => {
  if (selectedId === null) return

  const controller = new AbortController()

  async function loadUserDetail() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${selectedId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          signal: controller.signal,
        },
      )

      const data = await response.json()
      if (controller.signal.aborted) return

      if (!response.ok) {
        setDetailError(
          typeof data.detail === 'string'
            ? data.detail
            : 'No se pudo cargar el detalle.',
        )
        return
      }

      setSelectedUser(data)
    } catch {
      if (!controller.signal.aborted) {
        setDetailError('No se pudo cargar el detalle del usuario.')
      }
    }
  }

  void loadUserDetail()

  return () => controller.abort()
}, [selectedId, token])
function applySearch(name: string) {
  const nextName = name.trim()
  if (nextName === searchName) return

  setLoading(true)
  setError(null)
  setSearchName(nextName)
}
  return (
    <section>
      {me && <p>Hola, {me.name}</p>}
      {meError && <p role="alert">{meError}</p>}

      <h1>Usuarios</h1>
<form
  onSubmit={(event) => {
    event.preventDefault()
    applySearch(searchInput)
  }}
>
  <label htmlFor="search-name">Buscar por nombre</label>
  <input
    id="search-name"
    value={searchInput}
    onChange={(event) => setSearchInput(event.target.value)}
  />
  <button type="submit">Buscar</button>
  <button
    type="button"
    onClick={() => {
      setSearchInput('')
      applySearch('')
    }}
  >
    Limpiar
  </button>
</form>
      {loading ? (
  <p role="status">Cargando...</p>
) : error ? (
        <p role="alert">{error}</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>
  <button
    type="button"
    onClick={() => {
      if (selectedId === user.id) return
      setSelectedUser(null)
      setDetailError(null)
      setSelectedId(user.id)
    }}
  >
    {user.name}
  </button>
</li>
          ))}
        </ul>
      )}
      {detailError && <p role="alert">{detailError}</p>}

{selectedUser && (
  <div>
    <h2>{selectedUser.name}</h2>
    <p>Email: {selectedUser.email}</p>
    <p>Edad: {selectedUser.age}</p>
    <p>País: {selectedUser.country?.name ?? 'Sin país'}</p>
    <p>Roles: {selectedUser.roles.map((role) => role.name).join(', ') || 'Sin roles'}</p>
  </div>
)}
    </section>
  )
}