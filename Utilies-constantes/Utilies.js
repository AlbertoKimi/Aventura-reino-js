import { lista_Productos } from './Constantes.js';
import { Producto } from '../Clases/Producto.js';

export function obtenerElementoAleatorio(array){
    if(!array || array.length===0){
        return null;
    } else {
        const aleatorio = Math.random()*array.length;
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

export function mostrarEscena(id){
    document.querySelectorAll('.scene').forEach(
        element => element.classList.remove('active')
    );
    document.getElementById(id).classList.add('active');
}