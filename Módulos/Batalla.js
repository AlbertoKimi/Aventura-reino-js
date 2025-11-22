import { Enemigo } from './Enemigo.js';

function combate(enemigo,jugador){
    const enemigoBatalla = new Enemigo.constructor(
        enemigo.nombre, 
        enemigo.avatar, 
        enemigo.nivelAtaque, 
        enemigo.puntosVida,
        enemigo.multiplicadorDano
    );

    jugador.vida= jugador.obtenerVidaTotal();
    const ataqueJugador = jugador.obtenerAtaqueTotal();
    const defensaJugador = jugador.obtenerDefensaTotal();

    while (jugador.vida>0 && enemigoBatalla.puntosVida<0){

        enemigoBatalla.recibirDano(ataqueJugador);
        if(enemigoBatalla.puntosVida<=0) break;
        const ataqueEnemigo = enemigoBatalla.obtenerDanoReal();
        const danoRecibido = Math.max(0, ataqueEnemigo - defensaJugador);
        jugador.vida -= danoRecibido;
    }
}