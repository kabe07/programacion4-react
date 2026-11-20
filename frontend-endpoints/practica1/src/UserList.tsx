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
}

export function UserList({ token }: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<UserDetail | null>(null);

  useEffect(() => {
    let active = true;

    async function loadUsers() {
      setError(null);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/user`, {
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
      }
    }

    loadUsers();
    return () => { active = false; };
  }, [token]);

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

  return (
    <main>
      <h1>Usuarios</h1>
      {error && <p role="alert">{error}</p>}
      {!error && (
        <>
          {users.length === 0 && <p>No se encontraron usuarios.</p>}
          <ul>
            {users.map(user => (
              <li key={user.id}>
                <button onClick={() => selectUser(user.id)}>{user.name}</button>
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
