import { puntosBaseVictoria } from '../Utilies-constantes/Constantes.js';
import { Jefe } from '../Clases/Jefe.js';

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
    
    const detallesTurnos = [];
    let numeroTurno = 1;

    while (jugador.vida > 0 && enemigoBatalla.puntosVida > 0) {
        const turnoInfo = {
            numero: numeroTurno,
            acciones: []
        };

        const vidaEnemigoAntes = enemigoBatalla.puntosVida;
        enemigoBatalla.recibirDano(ataqueJugador);
        const danoRealizado = vidaEnemigoAntes - enemigoBatalla.puntosVida;
        
        turnoInfo.acciones.push({
            atacante: jugador.nombre,
            objetivo: enemigoBatalla.nombre,
            dano: danoRealizado,
            vidaRestante: enemigoBatalla.puntosVida
        });

        if (enemigoBatalla.puntosVida <= 0) {
            detallesTurnos.push(turnoInfo);
            break;
        }

        const ataqueEnemigoReal = enemigoBatalla.obtenerDanoReal();
        const danoRecibido = Math.max(0, ataqueEnemigoReal - defensaJugador);
        /*const vidaJugadorAntes = jugador.vida;*/
        jugador.vida -= danoRecibido;
        
        turnoInfo.acciones.push({
            atacante: enemigoBatalla.nombre,
            objetivo: jugador.nombre,
            dano: danoRecibido,
            danoBase: ataqueEnemigoReal,
            defensaAplicada: defensaJugador,
            vidaRestante: Math.max(0, jugador.vida)
        });

        detallesTurnos.push(turnoInfo);
        numeroTurno++;
    }

    if (jugador.vida > 0) {
        const puntosGanados = calcularPuntos(enemigoBatalla);
        jugador.sumarPuntos(puntosGanados);

        return {
            ganador: jugador.nombre,
            victoria: true,
            puntosGanados: puntosGanados,
            detallesTurnos: detallesTurnos,
            estadoFinal: {
                vidaJugador: jugador.vida,
                vidaEnemigo: 0
            }
        };
    } else {
        return {
            ganador: enemigoBatalla.nombre,
            victoria: false,
            puntosGanados: 0,
            detallesTurnos: detallesTurnos,
            estadoFinal: {
                vidaJugador: 0,
                vidaEnemigo: enemigoBatalla.puntosVida
            }
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