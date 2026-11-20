import { useCallback, useState } from "react";
import type { SubmitEvent } from "react";
import { UserList } from "./UserList";
import { UserGreeting } from "./UserGreeting";
import { UserForm } from "./UserForm";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token")
  );

  const [refreshVersion, setRefreshVersion] = useState(0);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("token");
    setToken(null);
    setPassword("");
    setError("Tu sesión venció");
  }, []);

  async function handleSubmit(evento: SubmitEvent) {
    evento.preventDefault();
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(
          typeof data.detail === "string"
            ? data.detail
            : JSON.stringify(data.detail ?? data)
        );
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      setPassword("");
    } catch {
      setError("No se pudo conectar con la API.");
    }
  }

  if (token) {
    return (
      <>
        <UserGreeting
          token={token}
          onUnauthorized={handleUnauthorized}
        />

        <UserForm
          token={token}
          onUnauthorized={handleUnauthorized}
          onCreated={() => setRefreshVersion((value) => value + 1)}
        />

        <UserList
          token={token}
          refreshVersion={refreshVersion}
          onUnauthorized={handleUnauthorized}
        />
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>

      <input
        type="email"
        placeholder="Email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <input
        type="password"
        placeholder="Contraseña"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button type="submit">Ingresar</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
