# Programación 4 - React

Alumno: Martín Fernandez

## Contenido

- `ejercicios-basicos`: un proyecto con los siete ejercicios en TypeScript.
- `frontend-endpoints/practica1` a `practica8`: un proyecto completo por práctica.
  Cada carpeta incluye lo hecho hasta ese punto.

El código parte de los ejercicios y del proyecto de clase:
https://github.com/marianoggg/utn-tup-2026-frontend-clase

## Cómo probar los proyectos

Se necesita Node.js con npm. Abrir una terminal en el proyecto que se quiera
probar (en esa carpeta tiene que estar `package.json`):

```bash
npm install
npm run dev
```

Abrir la dirección que muestre Vite. Para revisar los tipos y compilar:

```bash
npm run build
```

## Backend de endpoints

Las ocho prácticas usan la API de `clase-1-sqlmodel`:
https://github.com/ffumaneri/utn-tup-2026-python

Se necesita Python 3.12 o superior. En una terminal dentro de esa carpeta:

```powershell
py -m venv .venv
```

En Windows, cambiar la línea de uvloop en `requirements.txt` por:

```text
uvloop==0.22.1; sys_platform != "win32"
```

Después:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
.\.venv\Scripts\python.exe -m uvicorn main:app --reload
```

La documentación se abre en `http://localhost:8000/docs`.

Antes de ejecutar cada práctica, copiar su `.env.example` como `.env`
y completar `VITE_API_URL` con la dirección del backend.
Por defecto el backend se ejecuta en `http://localhost:8000`.
No se sube `.env` a GitHub.

El backend y el frontend deben quedar funcionando a la vez.

## Para probar

- Las cuentas de prueba están indicadas en el README del backend de clase.
- Con el usuario común, el alta y el borrado muestran errores de permisos.
- Crear un usuario de 16 años para comparar Todos y Solo mayores.
- Borrar solamente usuarios de prueba propios.
- En práctica 8, cambiar una letra del token desde Application > Local Storage
  y recargar: debe volver al login con el mensaje "Tu sesión venció".

La práctica 9 y las preguntas para pensar se responden en el cuestionario
del campus, no tienen una carpeta de proyecto.
