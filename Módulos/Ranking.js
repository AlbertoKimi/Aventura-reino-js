/**
 * Determina el rango del jugador basado en su puntuación.
 * @param {number} puntuacion Puntuación total del jugador.
 * @param {number} [umbral=500] Puntuación mínima para ser considerado "Veterano".
 * @returns {string} El rango del jugador ("Veterano" o "Novato").
 */

export function distinguirJugador(puntuacion, umbral = 500) {

    if (puntuacion > umbral) {
        return "Veterano";
    } else {
        return "Novato";
    }
}