import { Producto } from './Producto.js';

export class Jugador {

    constructor(nombre, avatar, vidaBase = 100) {
        this.nombre = nombre;
        this.avatar = avatar;
        this.puntos = 0;
        this.inventario = [];
        this.vida = vidaBase;
        this.vidaMaxima = vidaBase;
    }

    anadirObjetoInvemtario(producto) {

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

    sumarPuntos(puntosGanados) {
        this.puntos += puntosGanados;
    }

    obtenerAtaqueTotal() {

        let ataqueTotal = 0;

        for (const item of this.inventario) {
            if (item.tipo == "arma") {
                ataqueTotal += item.bonus;
            }
        }
        return ataqueTotal;
    }

    obtenerDefensaTotal() {

        let defensaTotal = 0;

        for (const item of this.inventario) {
            if (item.tipo == "armadura") {
                defensaTotal += item.bonus;
            }
        }
        return defensaTotal;
    }

    obtenerVidaTotal() {

        let vidaSumada = 0;

        for (const item of this.inventario) {
            if (item.tipo == "consumible") {
                vidaSumada += item.bonus;
            }
        }
        return this.vidaMaxima + vidaSumada;
    }
}
