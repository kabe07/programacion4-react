# Práctica 2: Cargando y errores

Alumno: Martín Fernandez

Este proyecto incluye las prácticas 1 a 2:

- Práctica 1: Detalle de usuario.
- Práctica 2: Cargando y errores.

## Para ejecutarlo

Usa el backend `clase-1-sqlmodel` del repositorio de clase:
https://github.com/ffumaneri/utn-tup-2026-python

Con el backend funcionando, abrir una terminal en esta carpeta:

```powershell
Copy-Item .env.example .env
```

Editar la copia `.env` y completar `VITE_API_URL` con la dirección
del backend local (por defecto, `http://localhost:8000`).
El `.env.example` se deja vacío para que cada persona lo configure.

```bash
npm install
npm run dev
```

Abrir la dirección que indique Vite. Para compilar: `npm run build`.

Consultar las cuentas de prueba en el README del backend de clase.

Para borrar, usar solamente usuarios que hayamos creado nosotros.
