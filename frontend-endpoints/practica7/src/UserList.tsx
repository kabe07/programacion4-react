import { useEffect, useState } from "react";

interface User {
  id: number;
  name: string;
}

interface UserDetail extends User {
  email: string;
  age: number;
  country: { id: number; name: string } | null;
  roles: { id: number; name: string }[];
}

interface UserListProps {
  token: string;
  refreshVersion: number;
}

export function UserList({ token, refreshVersion }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState({ path: "/user", adults: false, version: 0 });
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}${query.path}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!active) return;
        const data = await response.json();
        if (!active) return;
        if (!response.ok) {
          setError(typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail ?? data));
          return;
        }
        setUsers(data);
      } catch {
        if (active) setError("No se pudo conectar con la API.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadUsers();
    return () => { active = false; };
  }, [token, refreshVersion, query]);

  useEffect(() => {
    if (selectedId === null) return;
    let active = true;

    async function loadDetail() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user/${selectedId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!active) return;
        const data = await response.json();
        if (!active) return;
        if (!response.ok) {
          setError(typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail ?? data));
          return;
        }
        setDetail(data);
      } catch {
        if (active) setError("No se pudo obtener el detalle.");
      }
    }

    loadDetail();
    return () => { active = false; };
  }, [selectedId, token]);

  function selectUser(id: number) {
    setError(null);
    setDetail(null);
    setSelectedId(id);
  }

  function searchUsers(clear = false) {
    const name = clear ? "" : search.trim();
    if (clear) setSearch("");
    setError(null);
    setDetail(null);
    setSelectedId(null);
    setQuery(previous => ({
      path: name ? `/user/search/${encodeURIComponent(name)}` : "/user",
      adults: false,
      version: previous.version + 1,
    }));
  }

  function toggleAdults() {
    setSearch("");
    setError(null);
    setDetail(null);
    setSelectedId(null);
    setQuery(previous => ({
      path: previous.adults ? "/user" : "/user_mayores",
      adults: !previous.adults,
      version: previous.version + 1,
    }));
  }

  async function deleteUser(user: User) {
    if (!window.confirm(`¿Querés borrar a ${user.name}?`)) {
      return;
    }

    setDeletingId(user.id);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user/${user.id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();

        setError(
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail ?? data)
        );
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.filter((item) => item.id !== user.id)
      );

      if (selectedId === user.id) {
        setSelectedId(null);
        setDetail(null);
      }
    } catch {
      setError("No se pudo conectar con la API.");
    } finally {
      setDeletingId(null);
    }
  }


  const busy = loading || deletingId !== null;

  return (
    <main>
      <h1>Usuarios</h1>
      <p>Mostrando: {query.adults ? "Solo mayores de edad" : "Todos"}</p>
      <button type="button" onClick={toggleAdults} disabled={busy}>
        {query.adults ? "Mostrar todos" : "Mostrar solo mayores"}
      </button>
      <form onSubmit={event => { event.preventDefault(); searchUsers(); }}>
        <input aria-label="Buscar por nombre" placeholder="Buscar por nombre" value={search}
          onChange={event => setSearch(event.target.value)} disabled={busy} />
        <button type="submit" disabled={busy}>Buscar</button>
        <button type="button" onClick={() => searchUsers(true)} disabled={busy}>Limpiar</button>
      </form>
      {loading && <p>Cargando...</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && (
        <>
          {users.length === 0 && <p>No se encontraron usuarios.</p>}
          <ul>
            {users.map(user => (
              <li key={user.id}>
                <button onClick={() => selectUser(user.id)} disabled={busy}>{user.name}</button>
                <button type="button" onClick={() => deleteUser(user)} disabled={busy}>
                  {deletingId === user.id ? "Borrando..." : "Borrar"}
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {detail && (
        <section>
          <h2>{detail.name}</h2>
          <p>Email: {detail.email}</p>
          <p>Edad: {detail.age}</p>
          <p>País: {detail.country?.name ?? "Sin país"}</p>
          <p>Roles: {detail.roles.map(role => role.name).join(", ") || "Sin roles"}</p>
        </section>
      )}
    </main>
  );
}
