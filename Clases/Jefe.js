import { Enemigo } from './Enemigo.js'

/**
 * Clase que representa a un enemigo tipo Jefe, extendiendo las propiedades de Enemigo
 * para aplicar un multiplicador de daño.
 */

export class Jefe extends Enemigo {

    /**
     * @param {string} nombre Nombre del jefe.
     * @param {string} avatar Ruta de la imagen del jefe.
     * @param {number} nivelAtaque Ataque base del jefe.
     * @param {number} puntosVida Vida inicial del jefe.
     * @param {number} multiplicadorDano Multiplicador para calcular el daño real (por defecto 1.2).
     */

    constructor(nombre, avatar, nivelAtaque, puntosVida, multiplicadorDano = 1.2) {
        super(nombre, avatar, nivelAtaque, puntosVida);
        this.multiplicadorDano = multiplicadorDano;
        this.moneda = 10;

    }

    /**
     * Sobrescribe el método de Enemigo.
     * Calcula el daño real aplicando el multiplicador.
     * @returns {number} El daño total redondeado que inflige el Jefe.
     */

    obtenerDanoReal(){
        return Math.round(this.nivelAtaque*this.multiplicadorDano);
    }

}