/**
 * Clase base para todos los enemigos del juego.
 */

export class Enemigo {

    /**
     * @param {string} nombre Nombre del enemigo.
     * @param {string} avatar Ruta de la imagen del enemigo.
     * @param {number} nivelAtaque Daño base que inflige el enemigo.
     * @param {number} puntosVida Vida inicial del enemigo.
     */

    constructor(nombre, avatar, nivelAtaque, puntosVida) {

        this.nombre = nombre;
        this.avatar = avatar;
        this.nivelAtaque = nivelAtaque;
        this.puntosVida = puntosVida;
    }

    /**
     * Obtiene el daño que infligirá el enemigo (ataque base).
     * Este método puede ser sobrescrito por subclases (como Jefe) para modificar el daño.
     * @returns {number} El nivel de ataque base del enemigo.
     */

    obtenerDanoReal(){
        return this.nivelAtaque;
    }

    /**
     * Reduce los puntos de vida del enemigo por la cantidad de daño recibida.
     * Asegura que los puntos de vida no caigan por debajo de cero.
     * @param {number} herida Cantidad de daño a recibir.
     */

    recibirDano(herida){
        this.puntosVida-=herida;
        if(this.puntosVida<0){
            this.puntosVida=0
        }

    }
}