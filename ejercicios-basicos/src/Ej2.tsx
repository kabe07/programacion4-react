import { useState } from 'react'

export default function Ejercicio2() {
  const [contador, setContador] = useState(0)

  return (
    <section>
      <h2>Ejercicio 2: Contador</h2>
      <p>{contador}</p>

      <button
        onClick={() => setContador(contador - 1)}
        disabled={contador === 0}
      >
        Restar
      </button>

      <button
        onClick={() => setContador(contador + 1)}
        disabled={contador === 10}
      >
        Sumar
      </button>

      <button onClick={() => setContador(0)}>
        Reiniciar
      </button>
    </section>
  )
}