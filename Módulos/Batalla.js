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
    
    let defensaActualJugador = jugador.obtenerDefensaTotal();
    
    const listaTurnos = [];
    let contadorTurnos = 1;

    while (jugador.vida > 0 && enemigo.puntosVida > 0) {

        console.log(`\n=== TURNO ${contadorTurnos} ===`);
        console.log(`Defensa actual del jugador: ${defensaActualJugador}`);

        let datosTurno = {
            numero: contadorTurnos,
            atacante1: jugador.nombre,
            dano1: ataqueJugador,
            defensaInicial: defensaActualJugador,
            defensaFinal: defensaActualJugador,
            vidaRestanteEnemigo: 0,
            enemigoRespondio: false,
            atacante2: "",
            dano2: 0,
            danoAbsorbido: 0,
            danoRealVida: 0,
            vidaRestanteJugador: jugador.vida
        };

        enemigo.recibirDano(ataqueJugador);
        datosTurno.vidaRestanteEnemigo = enemigo.puntosVida;

        console.log(`${jugador.nombre} ataca con ${ataqueJugador} de daño`);
        console.log(`Vida restante del enemigo: ${enemigo.puntosVida}`);

        if (enemigo.puntosVida > 0) {
            datosTurno.enemigoRespondio = true;
            datosTurno.atacante2 = enemigo.nombre;
            
            const ataqueEnemigo = enemigo.obtenerDanoReal();
            datosTurno.dano2 = ataqueEnemigo;

            console.log(`${enemigo.nombre} contraataca con ${ataqueEnemigo} de daño`);

            if (defensaActualJugador > 0) {

                const danoAbsorbido = Math.min(ataqueEnemigo, defensaActualJugador);
                const danoRestante = ataqueEnemigo - danoAbsorbido;
                
                defensaActualJugador = Math.max(0, defensaActualJugador - ataqueEnemigo);
                
                if (danoRestante > 0) {
                    jugador.vida = Math.max(0, jugador.vida - danoRestante);
                    datosTurno.danoRealVida = danoRestante;
                } else {
                    datosTurno.danoRealVida = 0;
                }
                
                datosTurno.danoAbsorbido = danoAbsorbido;
                
            } else {

                datosTurno.danoAbsorbido = 0;
                datosTurno.danoRealVida = ataqueEnemigo;
                jugador.vida = Math.max(0, jugador.vida - ataqueEnemigo);
            }

            datosTurno.defensaFinal = defensaActualJugador;
            datosTurno.vidaRestanteJugador = jugador.vida;

            console.log(`Daño absorbido por defensa: ${datosTurno.danoAbsorbido}`);
            console.log(`Daño recibido en vida: ${datosTurno.danoRealVida}`);
            console.log(`Defensa final: ${defensaActualJugador}`);
            console.log(`Vida restante del jugador: ${jugador.vida}`);
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
        listaTurnos: listaTurnos,
        defensaFinalJugador: defensaActualJugador
    };
}

function calcularPuntos(enemigo) {
    let puntos = puntosBaseVictoria + enemigo.nivelAtaque;
    if (enemigo instanceof Jefe) {
        puntos = puntos * enemigo.multiplicadorDano;
    }
    return Math.round(puntos);
}