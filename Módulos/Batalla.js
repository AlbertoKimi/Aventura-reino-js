import { puntosBaseVictoria } from '../Utilies-constantes/Constantes.js';
import { Jefe } from '../Clases/Jefe.js';

export function combate(enemigoOriginal, jugador) {

    const enemigo = new enemigoOriginal.constructor(
        enemigoOriginal.nombre,
        enemigoOriginal.avatar,
        enemigoOriginal.nivelAtaque,
        enemigoOriginal.puntosVida,
        enemigoOriginal.multiplicadorDano
    );

  
    const ataqueJugador = jugador.obtenerAtaqueTotal();
    const defensaJugador = jugador.obtenerDefensaTotal();

    const listaTurnos = [];
    let contadorTurnos = 1;

    while (jugador.vida > 0 && enemigo.puntosVida > 0) {

        console.log("turno en el que estamos: " + contadorTurnos)

        let datosTurno = {
            numero: contadorTurnos,
            atacante1: jugador.nombre,
            dano1: ataqueJugador,
            vidaRestanteEnemigo: 0,
            enemigoRespondio: false,
            atacante2: "",
            dano2: 0,
            vidaRestanteJugador: 0
        };

        enemigo.recibirDano(ataqueJugador);
        datosTurno.vidaRestanteEnemigo = enemigo.puntosVida;

        console.log("La vida del jugador es: " + datosTurno.vidaRestanteJugador)
        console.log("La vida del enemigo es: " + datosTurno.vidaRestanteEnemigo)

        if (enemigo.puntosVida > 0) {
            datosTurno.enemigoRespondio = true;
            datosTurno.atacante2 = enemigo.nombre;

            const ataqueEnemigo = enemigo.obtenerDanoReal();
            const nuevaVida = (jugador.vida + defensaJugador) - ataqueEnemigo;
            /*const danoRecibido = Math.max(0, ataqueEnemigo - defensaJugador);*/

            jugador.vida = Math.max(0,nuevaVida);
            if (jugador.vida < 0) jugador.vida = 0;

            datosTurno.dano2 = ataqueEnemigo;
            datosTurno.vidaRestanteJugador = jugador.vida;
            

            console.log("La vida del jugador es: " + datosTurno.vidaRestanteJugador)
            console.log("La vida del enemigo es: " + datosTurno.vidaRestanteEnemigo)


        }

        listaTurnos.push(datosTurno);
        contadorTurnos++;
    }

    const victoria = jugador.vida > 0;
    let puntos = 0;
    if (victoria) {
        puntos = calcularPuntos(enemigo);
        jugador.sumarPuntos(puntos);
    }

    return {
        victoria: victoria,
        puntosGanados: puntos,
        listaTurnos: listaTurnos
    };
}

function calcularPuntos(enemigo) {
    let puntos = puntosBaseVictoria + enemigo.nivelAtaque;
    if (enemigo instanceof Jefe) {
        puntos = puntos * enemigo.multiplicadorDano;
    }
    return Math.round(puntos);
}