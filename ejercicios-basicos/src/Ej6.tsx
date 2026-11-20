import { useState } from 'react'

const lenguajes = [
  'JavaScript',
  'Java',
  'Python',
  'C#',
  'TypeScript',
  'PHP',
  'Ruby'
]

export default function Ejercicio6() {
  const [busqueda, setBusqueda] = useState('')

  const resultados = lenguajes.filter(lenguaje =>
    lenguaje.toLowerCase().includes(busqueda.toLowerCase())
  )

  return (
    <section>
      <h2>Ejercicio 6: Buscador de lenguajes</h2>

      <input
        type="text"
        placeholder="Buscá un lenguaje"
        value={busqueda}
        onChange={(evento) => setBusqueda(evento.target.value)}
      />

      <p>Resultados: {resultados.length}</p>

      <ul>
        {resultados.map(lenguaje => (
          <li key={lenguaje}>{lenguaje}</li>
        ))}
      </ul>

      {resultados.length === 0 && <p>No se encontraron lenguajes.</p>}
    </section>
  )
}