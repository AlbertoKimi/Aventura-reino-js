import { puntosBaseVictoria } from '../Utilies-constantes/Constantes.js';
import { Jefe } from '../Clases/Jefe.js';
import { Enemigo } from '../Clases/Enemigo.js';


export function combate(enemigo, jugador) {

    const enemigoBatalla = new enemigo.constructor(
        enemigo.nombre,
        enemigo.avatar,
        enemigo.nivelAtaque,
        enemigo.puntosVida,
        enemigo.multiplicadorDano
    );

    jugador.vida = jugador.obtenerVidaTotal();

    const ataqueJugador = jugador.obtenerAtaqueTotal();
    const defensaJugador = jugador.obtenerDefensaTotal();
    let ataqueEnemigoReal = 0;

    while (jugador.vida > 0 && enemigoBatalla.puntosVida > 0) {

        enemigoBatalla.recibirDano(ataqueJugador);
        if (enemigoBatalla.puntosVida <= 0) break;

        ataqueEnemigoReal = enemigoBatalla.obtenerDanoReal();

        const danoRecibido = Math.max(0, ataqueEnemigoReal - defensaJugador);
        jugador.vida -= danoRecibido;
    }

    if (jugador.vida > 0) {
        const puntosGanados = calcularPuntos(enemigoBatalla);
        jugador.sumarPuntos(puntosGanados);

        return {
            ganador: jugador.nombre,
            puntosGanados: puntosGanados
        };
    } else {
        return {
            ganador: enemigoBatalla.nombre,
            puntosGanados: 0
        };
    }
}


function calcularPuntos(enemigo) {
    let puntos = puntosBaseVictoria + enemigo.nivelAtaque;

    if (enemigo instanceof Jefe) {
        puntos = puntos * enemigo.multiplicadorDano;
    }

    return Math.round(puntos);
}