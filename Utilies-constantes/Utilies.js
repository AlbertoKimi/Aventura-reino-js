import { lista_Productos } from './Constantes.js';
import { Producto } from './Producto.js';

export function obtenerElementoAleatorio(array){
    if(!array || array.length===0){
        return null;
    } else {
        const aleatorio = Math.random()*array.lenght;
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