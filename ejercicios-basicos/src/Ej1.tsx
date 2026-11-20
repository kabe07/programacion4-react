interface ProductoProps {
  nombre: string
  precio: number
  stock: number
}
function Producto({ nombre, precio, stock }: ProductoProps) {
  return (
    <div>
      <h3>{nombre}</h3>
      <p>Precio: ${precio}</p>
      <p>{stock === 0 ? "Sin stock" : `Stock: ${stock}`}</p>
    </div>
  )
}

export default function Ejercicio1() {
  return (
    <section>
      <h2>Ejercicio 1: Productos</h2>

      <Producto nombre="Teclado" precio={25000} stock={5} />
      <Producto nombre="Mouse" precio={15000} stock={0} />
      <Producto nombre="Monitor" precio={200000} stock={3} />
    </section>
  )
}