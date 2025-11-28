import { lista_Productos } from './Constantes.js';
import { Producto } from '../Clases/Producto.js';

/**
 * Selecciona un elemento al azar de un array.
 * @param {Array<any>} array El array del que se seleccionará un elemento.
 * @returns {any|null} Un elemento aleatorio del array, o null si el array está vacío o no es válido.
 */

export function obtenerElementoAleatorio(array) {
    if (!array || array.length === 0) {
        return null;
    } else {
        const aleatorio = Math.random() * array.length;
        return array[Math.floor(aleatorio)];
    }
}

/**
 * Crea una copia (clon) de la lista maestra de productos, instanciando nuevos objetos Producto.
 * Esto asegura que la lista maestra no se modifique al comprar.
 * @returns {Array<Producto>} Una nueva lista de objetos Producto.
 */

export function clonarProductos() {
    return lista_Productos.map(producto => {
        return new Producto(
            producto.nombre,
            producto.imagen,
            producto.precio,
            producto.rareza,
            producto.tipo,
            producto.bonus
        );
    });
}

/**
 * Muestra una escena específica y oculta todas las demás.
 * También desplaza la ventana de main al principio.
 * @param {string} id El ID de la escena (elemento con clase 'escena') a mostrar.
 */

export function mostrarEscena(id) {
    document.querySelectorAll('.escena').forEach(
        element => element.classList.remove('activa')
    );
    document.getElementById(id).classList.add('activa');

    const main = document.querySelector('main');
    if (main) {
        main.scrollTop = 0;
    }
}