import { useState } from 'react'

export default function Ejercicio3() {
  const [visible, setVisible] = useState(false)

  return (
    <section>
      <h2>Ejercicio 3: Mostrar y ocultar</h2>
      <h3>¿Qué son las props en React?</h3>

      <button onClick={() => setVisible(!visible)}>
        {visible ? 'Ocultar respuesta' : 'Mostrar respuesta'}
      </button>

      {visible && (
        <p>
          Las props son datos que un componente recibe desde otro componente.
        </p>
      )}
    </section>
  )
}