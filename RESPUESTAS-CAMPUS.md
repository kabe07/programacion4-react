# Respuestas para el cuestionario

Estas respuestas se copian en las preguntas del campus. Este archivo no
reemplaza responder el cuestionario ni pegar el enlace del repositorio.

## Lista y detalle de usuarios

La lista trae solamente el id y el nombre porque es lo que se necesita
para mostrarla. Los otros datos se piden al seleccionar una persona.
Si hubiera 10.000 usuarios, mandar todos sus datos en la primera consulta
haría más pesada la respuesta y se enviarían muchos datos que no usamos.
También sería conveniente usar paginación para no traer toda la lista junta.

## Buscar el carácter #

Con encodeURIComponent, el carácter # se convierte en %23 y llega al backend
como parte del nombre que buscamos. Sin codificarlo, el navegador interpreta
lo que sigue al # como un fragmento y no lo envía al servidor. Por eso la URL
que recibe la API cambia y puede responder un error.

## Crear y borrar con sfer

Santiago Fernández tiene el rol REGULAR. Al intentar crear un usuario,
la API responde 403 con "Missing permission: write_users".
Al intentar borrarlo, responde 403 con "Missing permission: delete_users".
La aplicación muestra esos mensajes y no realiza la operación.

## El botón Borrar y los permisos

Sería mejor ocultar o deshabilitar el botón cuando el usuario no tiene permiso,
para no ofrecerle una acción que no puede hacer. Igual el backend tiene que
comprobar el permiso, porque ocultar el botón no evita que alguien intente
enviar la petición por otro medio.

## Práctica 9: código repetido

Contando solamente los archivos de src de practica8:

- import.meta.env.VITE_API_URL aparece 7 veces.
- Authorization: aparece 5 veces.
- if (!response.ok) aparece 5 veces.
- Además hay otras 2 comprobaciones equivalentes en UserGreeting.tsx:
  if (!idResponse.ok) e if (!userResponse.ok).
- Hay estados de carga en UserList (loading) y UserForm (saving).
- Los cuatro componentes App, UserList, UserForm y UserGreeting tienen
  un estado para los errores.

En UserGreeting el encabezado Authorization se declara una vez y se usa
para dos peticiones. Por eso hay 5 declaraciones del encabezado, aunque
hay 6 peticiones autenticadas.

Si cambia la forma de mandar el token, hay que modificar UserList.tsx,
UserForm.tsx y UserGreeting.tsx. Si nos olvidamos de una petición, esa parte
puede dejar de funcionar aunque las otras sigan andando.

Una mejora sería hacer un archivo compartido para las peticiones, con
la URL base, el token y el manejo común de errores. Así los cambios se
hacen en un solo lugar. En este trabajo todavía están repetidos para
resolver la práctica con lo visto hasta ese punto.
