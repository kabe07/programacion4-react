import { useState } from 'react'

export default function Ejercicio4() {
  const [celsius, setCelsius] = useState('')

  const fahrenheit = Number(celsius) * 9 / 5 + 32

  return (
    <section>
      <h2>Ejercicio 4: Conversor de temperatura</h2>

      <label>
        Temperatura en °C:
        <input
          type="number"
          value={celsius}
          onChange={(evento) => setCelsius(evento.target.value)}
        />
      </label>

      {celsius !== '' && (
        <div>
          <p>Equivalente: {fahrenheit.toFixed(1)} °F</p>
          {Number(celsius) > 30 && <p>Hace calor</p>}
        </div>
      )}
    </section>
  )
}