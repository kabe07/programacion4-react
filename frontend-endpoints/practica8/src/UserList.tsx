import { useEffect, useState } from 'react'
import type { SubmitEvent } from 'react'
import './App.css'

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

export function UserList({
  token,
  onUnauthorized,
}: {
  token: string
  onUnauthorized: () => void
}) {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState<string | null>(null)
  const [meError, setMeError] = useState<string | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [selectedUser, setSelectedUser] = useState<UserDetail | null>(null)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [searchName, setSearchName] = useState('')
  const [me, setMe] = useState<UserDetail | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [listVersion, setListVersion] = useState(0)
  const [onlyAdults, setOnlyAdults] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Carga la lista de usuarios.
  useEffect(() => {
    const controller = new AbortController()

    async function loadUsers() {
      try {
        let path = '/user'

if (onlyAdults) {
  path = '/user_mayores'
} else if (searchName) {
  path = `/user/search/${encodeURIComponent(searchName)}`
}
  

const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
  
  headers: { Authorization: `Bearer ${token}` },
  signal: controller.signal,
})
if (response.status === 401) {
  onUnauthorized()
  return
}
          

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
  }, [token, searchName, listVersion, onlyAdults, onUnauthorized])

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

    if (idResponse.status === 401) {
      onUnauthorized()
      return
    }

    if (!idResponse.ok) throw new Error()

    const { id } = await idResponse.json()
    const userResponse = await fetch(`${apiUrl}/user/${id}`, options)

    if (userResponse.status === 401) {
      onUnauthorized()
      return
    }

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
  }, [token, onUnauthorized])

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
      if (response.status === 401) {
  onUnauthorized()
  return
}

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
  }, [selectedId, token, onUnauthorized])
function applySearch(name: string) {
  const nextName = name.trim()
  if (nextName === searchName && !onlyAdults) return

  setLoading(true)
  setError(null)
  setOnlyAdults(false)
  setSearchName(nextName)
}

function toggleOnlyAdults() {
  setLoading(true)
  setError(null)
  setSearchInput('')
  setSearchName('')
  setOnlyAdults((current) => !current)
}
async function handleCreateUser(event: SubmitEvent<HTMLFormElement>) {
  event.preventDefault()
  if (creating) return

  const form = event.currentTarget
  const fields = new FormData(form)

  setCreateError(null)
  setCreating(true)

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: String(fields.get('name')).trim(),
        age: Number(fields.get('age')),
        email: String(fields.get('email')).trim(),
        password: String(fields.get('password')),
        country_id: Number(fields.get('country_id')),
      }),
    })
if (response.status === 401) {
  onUnauthorized()
  return
}
    if (!response.ok) {
      const data = await response.json()
      setCreateError(
        typeof data.detail === 'string'
          ? data.detail
          : 'No se pudo crear el usuario.',
      )
      return
    }

    form.reset()
    setLoading(true)
    setError(null)
    setListVersion((version) => version + 1)
  } catch {
    setCreateError('No se pudo completar el alta.')
  } finally {
    setCreating(false)
  }
}
async function handleDeleteUser(user: User) {
  if (!window.confirm(`¿Querés borrar a ${user.name}?`)) return

  setDeleteError(null)

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/user/${user.id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
    )
if (response.status === 401) {
  onUnauthorized()
  return
}
    if (!response.ok) {
      const data = await response.json()
      setDeleteError(
        typeof data.detail === 'string'
          ? data.detail
          : 'No se pudo borrar el usuario.',
      )
      return
    }

    setUsers((currentUsers) =>
      currentUsers.filter((currentUser) => currentUser.id !== user.id),
    )

    if (selectedId === user.id) {
      setSelectedId(null)
      setSelectedUser(null)
      setDetailError(null)
    }
  } catch {
    setDeleteError('No se pudo completar el borrado.')
  }
}
  return (
    <section>
      {me && (
  <p>
    Hola, {me.name} ({me.roles.map((role) => role.name).join(', ') || 'Sin roles'})
  </p>
)}
      {meError && <p role="alert">{meError}</p>}

      <h1>Usuarios</h1>
      <form
        className="search-user-form"
        onSubmit={(event) => {
          event.preventDefault()
          applySearch(searchInput)
        }}
      >
        <label htmlFor="search-name">Buscar por nombre</label>
        <div className="search-user-controls">
          <input
            id="search-name"
            type="search"
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
        </div>
      </form>

      <form className="create-user-form" onSubmit={handleCreateUser}>
        <h2>Crear usuario</h2>

        <label>
          Nombre
          <input name="name" required />
        </label>

        <label>
          Edad
          <input name="age" type="number" min={0} required />
        </label>

        <label>
          Correo electrónico
          <input name="email" type="email" required />
        </label>

        <label>
          Contraseña
          <input name="password" type="password" minLength={4} required />
        </label>

        <label>
          País
          <select name="country_id" defaultValue="" required>
            <option value="" disabled>Elegí un país</option>
            <option value="1">Argentina</option>
            <option value="2">Brasil</option>
          </select>
        </label>

        <button type="submit" disabled={creating}>
          {creating ? 'Guardando...' : 'Crear usuario'}
        </button>

        {createError && <p role="alert">{createError}</p>}
      </form>

      <button type="button" onClick={toggleOnlyAdults}>
  {onlyAdults ? 'Todos' : 'Solo mayores'}
</button>
{deleteError && <p role="alert">{deleteError}</p>}
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

    <button type="button" onClick={() => void handleDeleteUser(user)}>
      Borrar
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