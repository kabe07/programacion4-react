import { useState } from "react";
import type { SubmitEvent } from "react";
import { UserList } from "./UserList";

export default function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);


  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setError(null);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail ?? data));
        return;
      }
      setToken(data.token);
      setPassword("");
    } catch {
      setError("No se pudo conectar con la API.");
    }
  }

  if (token) {
    return (
      <>
        <UserList token={token} />
      </>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Iniciar sesión</h1>
      <label>Email: <input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Contraseña: <input type="password" required value={password} onChange={e => setPassword(e.target.value)} /></label>
      <button type="submit">Ingresar</button>
      {error && <p role="alert">{error}</p>}
    </form>
  );
}
