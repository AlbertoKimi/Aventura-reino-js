import { Enemigo } from './Enemigo.js'

export class Jefe extends Enemigo {

    constructor(nombre, avatar, nivelAtaque, puntosVida, multiplicadorDano = 1.2) {
        super(nombre, avatar, nivelAtaque, puntosVida);
        this.multiplicadorDano = multiplicadorDano;

    }

    obtenerDanoReal(){
        return Math.round(this.nivelAtaque*this.multiplicadorDano);
    }

}