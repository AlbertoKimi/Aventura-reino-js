import { clonarProductos } from '../Utilies-constantes/Utilies.js'

/**
 * Filtra la lista completa de productos para devolver solo aquellos con la rareza especificada.
 * @param {string} rareza La rareza por la cual filtrar ("Comun", "Rara", "Epica", "Legendaria").
 * @returns {Array<Producto>} Una lista de productos que coinciden con la rareza.
 */

export function filtrarProductos(rareza) {

    const productos = clonarProductos();
    return productos.filter(producto => producto.rareza === rareza);

}

/**
 * Aplica un descuento de rareza a todos los productos y devuelve los precios finales.
 * Nota: El descuento solo se aplica a los productos que coincidan con la rareza dada.
 * @param {string} rareza La rareza a la cual aplicar el descuento.
 * @param {number} descuento El porcentaje de descuento a aplicar.
 * @returns {Array<number>} Un array con los precios finales (con o sin descuento aplicado) de todos los productos.
 */

export function aplicarDescuento(rareza, descuento) {

    const productos = clonarProductos();
    const productosDescontados = productos.map(producto => {
        return producto.aplicarDescuento("rareza", rareza, descuento);
    });

    return productosDescontados;

}

/**
 * Busca productos por nombre (búsqueda parcial e insensible a mayúsculas).
 * @param {string} nombre La cadena de texto a buscar dentro de los nombres de los productos.
 * @returns {Array<Producto>} Una lista de productos que contienen la cadena de búsqueda en su nombre.
 */

export function buscarProducto(nombre) {
    const productos = clonarProductos();
    const nombreMinus = nombre.toLowerCase();

    return productos.filter(producto => producto.nombre.toLowerCase().includes(nombreMinus));

}