import { useState } from 'react'
interface Item {
  id: string
  nombre: string
}

export default function Ejercicio5() {
  const [texto, setTexto] = useState('')
 const [items, setItems] = useState<Item[]>([])

  function agregarItem() {
    const nombre = texto.trim()

    if (nombre === '') {
      return
    }

    const nuevoItem = {
      id: crypto.randomUUID(),
      nombre: nombre
    }

    setItems([...items, nuevoItem])
    setTexto('')
  }

function eliminarItem(id: string) {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <section>
      <h2>Ejercicio 5: Lista de compras</h2>

      <input
        type="text"
        placeholder="Ingresá un producto"
        value={texto}
        onChange={(evento) => setTexto(evento.target.value)}
      />

      <button onClick={agregarItem}>Agregar</button>

      {items.length === 0 ? (
        <p>No hay nada para comprar</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              {item.nombre}
              <button onClick={() => eliminarItem(item.id)}>
                Eliminar
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}