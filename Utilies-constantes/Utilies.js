import { lista_Productos } from './Constantes.js';
import { Producto } from '../Clases/Producto.js';

export function obtenerElementoAleatorio(array) {
    if (!array || array.length === 0) {
        return null;
    } else {
        const aleatorio = Math.random() * array.length;
        return array[Math.floor(aleatorio)];
    }
}

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