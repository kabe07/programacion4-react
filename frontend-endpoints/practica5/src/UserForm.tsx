import { useState } from "react";
import type { SubmitEvent } from "react";

interface UserFormProps {
  token: string;
  onCreated: () => void;
}

export function UserForm({
  token,
  onCreated,
}: UserFormProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [countryId, setCountryId] = useState("1");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setMessage("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: name.trim(),
            age: Number(age),
            email: email.trim(),
            password,
            country_id: Number(countryId),
          }),
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

      setMessage("Usuario creado correctamente.");
      setName("");
      setAge("");
      setEmail("");
      setPassword("");
      setCountryId("1");
      onCreated();
    } catch {
      setError("No se pudo conectar con la API.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section>
      <h2>Crear usuario</h2>

      <form onSubmit={handleSubmit}>
        <fieldset disabled={saving}>
          <div>
            <label>
              Nombre:
              <input
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              Edad:
              <input
                type="number"
                required
                min={0}
                step={1}
                value={age}
                onChange={(e) => setAge(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              Email:
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              Contraseña:
              <input
                type="password"
                required
                minLength={4}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>
          </div>

          <div>
            <label>
              País:
              <select
                value={countryId}
                onChange={(e) => setCountryId(e.target.value)}
              >
                <option value="1">Argentina</option>
                <option value="2">Brasil</option>
              </select>
            </label>
          </div>

          <button type="submit">
            {saving ? "Guardando..." : "Crear usuario"}
          </button>
        </fieldset>
      </form>

      {error && <p role="alert">{error}</p>}
      {message && <p>{message}</p>}
    </section>
  );
}
