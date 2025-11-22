export class Enemigo {

    constructor(nombre, avatar, nivelAtaque, puntosVida) {

        this.nombre = nombre;
        this.avatar = avatar;
        this.nivelAtaque = nivelAtaque;
        this.puntosVida = puntosVida;
    }

    obtenerDanoReal(){
        return this.nivelAtaque;
    }

    recibirDano(herida){
        this.puntosVida-=herida;
        if(this.puntosVida<0){
            this.puntosVida=0
        }

    }
}