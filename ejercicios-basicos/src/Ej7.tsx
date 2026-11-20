interface ProductoProps {
  nombre: string
  precio: number
  stock: number
  oferta?: boolean
}

function Producto({ nombre, precio, stock, oferta }: ProductoProps) {
  return (
    <div>
      <h3>{nombre}</h3>
      <p>Precio: ${precio}</p>
      <p>{stock === 0 ? 'Sin stock' : `Stock: ${stock}`}</p>
      {oferta && <p>¡Oferta!</p>}
    </div>
  )
}

export default function Ejercicio7() {
  return (
    <section>
      <h2>Ejercicio 7: Productos con TypeScript</h2>

      <Producto nombre="Teclado" precio={25000} stock={5} oferta={true} />
      <Producto nombre="Mouse" precio={15000} stock={0} />
      <Producto nombre="Monitor" precio={200000} stock={3} />
    </section>
  )
}