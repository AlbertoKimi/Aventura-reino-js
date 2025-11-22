import { clonarProductos } from '../Utilies-constantes/Utilies.js'


export function filtrarProductos(rareza) {

    const productos = clonarProductos();
    return productos.filter(producto => producto.rareza === rareza);

}

export function aplicarDescuento(rareza, descuento) {

    const productos = clonarProductos();
    const productosDescontados = productos.map(producto => {
        return producto.aplicarDescuento("rareza", rareza, descuento);
    });

    return productosDescontados;

}


export function buscarProducto(nombre) {
    const productos = clonarProductos();
    const nombreMinus = nombre.toLowerCase();

    return productos.filter(producto => producto.nombre.toLowerCase().include(nombreMinus));

}