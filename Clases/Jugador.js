import { Producto } from './Producto.js';

/**
 * Clase que representa al jugador (héroe) en el juego.
 */

export class Jugador {

    /**
     * @param {string} nombre Nombre del jugador.
     * @param {string} avatar Ruta de la imagen del jugador.
     * @param {number} vidaBase Vida máxima base del jugador (por defecto 100).
     */

    constructor(nombre, avatar, vidaBase = 100, dineroInicial = 500) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.puntos = 0;
        this.inventario = [];
        this.vida = vidaBase;
        this.vidaMaxima = vidaBase;
        this.monedero = dineroInicial;
    }

    /**
     * Añade un nuevo Producto al inventario del jugador.
     * Crea un clon para evitar referencias al objeto original del mercado.
     * @param {Producto} producto Objeto Producto a añadir.
     */

    anadirObjetoInventario(producto) {

        const productoClonado = new Producto(
            producto.nombre,
            producto.imagen,
            producto.precio,
            producto.rareza,
            producto.tipo,
            producto.bonus
        );
        this.inventario.push(productoClonado);
    }

    /**
     * Aumenta la puntuación total del jugador.
     * @param {number} puntosGanados Puntos a sumar.
     */

    sumarPuntos(puntosGanados) {
        this.puntos += puntosGanados;
    }

    /**
     * Calcula el ataque total del jugador sumando el bonus de todos los ítems de tipo "Arma".
     * @returns {number} El valor total de ataque.
     */

    obtenerAtaqueTotal() {

        let ataqueTotal = 0;

        for (const item of this.inventario) {
            if (item.tipo == "Arma") {
                ataqueTotal += item.bonus;
            }
        }
        return ataqueTotal;
    }

    /**
     * Calcula la defensa total del jugador sumando el bonus de todos los ítems de tipo "Armadura".
     * @returns {number} El valor total de defensa.
     */

    obtenerDefensaTotal() {

        let defensaTotal = 0;

        for (const item of this.inventario) {
            if (item.tipo == "Armadura") {
                defensaTotal += item.bonus;
            }
        }
        return defensaTotal;
    }

    /**
     * Calcula la vida total (máxima) del jugador sumando la vida base y el bonus de todos los ítems de tipo "Consumible".
     * @returns {number} El valor total de vida máxima.
     */

    obtenerVidaTotal() {

        let vidaSumada = 0;

        for (const item of this.inventario) {
            if (item.tipo == "Consumible") {
                vidaSumada += item.bonus;
            }
        }
        return this.vidaMaxima + vidaSumada;
    }

    /**
     * Descuenta una cantidad de dinero del monedero del jugador.
     * @param {number} cantidad Cantidad a descontar.
     * @returns {boolean} True si la transacción fue exitosa, false si no había suficiente dinero.
     */
    descontarDinero(cantidad) {
        if (this.monedero >= cantidad) {
            this.monedero -= cantidad;
            return true;
        }
        return false;
    }
    
    // NUEVO: Método para calcular el costo total de los productos en un array (cesta o inventario)
    /**
     * Calcula el coste total de una lista de productos.
     * @param {Array<Producto>} listaProductos Lista de productos a sumar.
     * @returns {number} El coste total.
     */
obtenerCostoTotal(listaProductos) {
        // CORRECCIÓN: Agregar el valor inicial '0' al final del reduce
        return listaProductos.reduce((total, producto) => {
            return total + producto.formatearAtributos(producto.precio)
        }, 0); 
    }
}
