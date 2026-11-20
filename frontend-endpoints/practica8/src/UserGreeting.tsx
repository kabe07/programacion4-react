import { useEffect, useState } from "react";

interface CurrentUser {
  name: string;
  roles: { id: number; name: string }[];
}

interface UserGreetingProps {
  token: string;
  onUnauthorized: () => void;
}

export function UserGreeting({
  token,
  onUnauthorized,
}: UserGreetingProps) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCurrentUser() {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const idResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/user/me/id`,
          { headers }
        );

        if (!active) return;

        if (idResponse.status === 401) {
          onUnauthorized();
          return;
        }

        const idData = await idResponse.json();

        if (!idResponse.ok) {
          throw new Error(
            typeof idData.detail === "string"
              ? idData.detail
              : "No se pudo obtener el usuario conectado."
          );
        }

        const userResponse = await fetch(
          `${import.meta.env.VITE_API_URL}/user/${idData.id}`,
          { headers }
        );

        if (!active) return;

        if (userResponse.status === 401) {
          onUnauthorized();
          return;
        }

        const userData = await userResponse.json();

        if (!userResponse.ok) {
          throw new Error(
            typeof userData.detail === "string"
              ? userData.detail
              : "No se pudo obtener el detalle del usuario."
          );
        }

        if (active) {
          setUser(userData);
        }
      } catch (error) {
        if (active) {
          setError(
            error instanceof Error
              ? error.message
              : "No se pudo cargar el saludo."
          );
        }
      }
    }

    loadCurrentUser();

    return () => {
      active = false;
    };
  }, [token, onUnauthorized]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!user) {
    return <p>Cargando saludo...</p>;
  }

  const roles = user.roles.map((role) => role.name).join(", ");

  return (
    <h2>
      Hola, {user.name} ({roles || "Sin roles"})
    </h2>
  );
}
