import { Jugador } from './Clases/Jugador.js';
import { Enemigo } from './Clases/Enemigo.js';
import { Jefe } from './Clases/Jefe.js';
import { descuentoFijo, opcionesRarezas, tipos } from './Utilies-constantes/Constantes.js';
import { mostrarEscena, obtenerElementoAleatorio, clonarProductos } from './Utilies-constantes/Utilies.js';
import { combate } from './Módulos/Batalla.js';
import { distinguirJugador } from './Módulos/Ranking.js';
import { aplicarDescuento } from './Módulos/Mercado.js';

// Variables globales

let jugador = new Jugador("", "./Imagenes/Prota-armado.png", 100, 500);
let productosEnCesta = [];
let enemigos = [];
let enemigoActual = 0;
let dinero_sobrante = 0;
let puntos_finales = 0;
const LS_KEY_PUNTUACIONES = 'puntuacionesHistoricas';

/**
 * Inicializa las clases principales (Jugador, Enemigos) y comienza el juego en la primera escena.
 */

function inicializarJuego() {

    /*jugador = new Jugador("Nyxarius", "./Imagenes/Prota-armado.png", 100);*/

    // Crear enemigos
    enemigos = [
        new Enemigo("Mecalobo", "./Imagenes/Enemigos/Lobo.png", 10, 100),
        new Enemigo("Nenji", "./Imagenes/Enemigos/Guerrero.png", 20, 200),
        new Enemigo("Dragón", "./Imagenes/Enemigos/Dragon.png", 25, 250),
        new Enemigo("Symercy", "./Imagenes/Enemigos/Maga.png", 35, 350),
        new Jefe("Xasper", "./Imagenes/Enemigos/Enemigo-final.png", 50, 500, 1.2)
    ];

    enemigoActual = 0;
    productosEnCesta = [];
    puntos_finales = 0;
    dinero_sobrante = 0;

    mostrarEscena('escena-1');
    actualizarEstadoJugador();

    limpiarInventario();
}

/**
 * Actualiza la visualización de las estadísticas actuales del jugador (Ataque, Defensa, Vida, Puntos)
 * en las escenas de estado del jugador (escena-1 y escena-3).
 */


function actualizarEstadoJugador() {

    const escenas = ['escena-1', 'escena-3'];
    console.log(jugador.ataque);
    console.log(jugador.defensa);

    escenas.forEach(escenaId => {
        const escena = document.getElementById(escenaId);
        if (escena) {
            const nombreElement = escena.querySelector('.nombre-jugador');
            const ataqueElement = escena.querySelector('.stat-ataque');
            const defensaElement = escena.querySelector('.stat-defensa');
            const vidaElement = escena.querySelector('.stat-vida');
            const puntosElement = escena.querySelector('.stat-puntos');

            if (nombreElement) nombreElement.textContent = jugador.nombre;
            if (ataqueElement) ataqueElement.textContent = `Ataque: ${jugador.obtenerAtaqueTotal()}`;
            if (defensaElement) defensaElement.textContent = `Defensa: ${jugador.obtenerDefensaTotal()}`;
            if (vidaElement) vidaElement.textContent = `Vida: ${jugador.obtenerVidaTotal()}`;
            if (puntosElement) puntosElement.textContent = `Puntos: ${jugador.puntos}`;
        }
    });
}

/**
 * Inicializa la Escena del Mercado (escena-2).
 * Selecciona una rareza aleatoria para aplicar los descuentos de esa rareza a los productos, crea las tarjetas 
 * con esos productos descontados y las añade
 */

function inicializarMercado() {

    const dineroElement = document.getElementById('dinero');
    if (dineroElement) dineroElement.textContent = `Dinero: ${jugador.monedero} Ryō`;

    const rarezaAleatoria = obtenerElementoAleatorio(opcionesRarezas);
    const productosBase = clonarProductos();

    const preciosBase = new Map();
    productosBase.forEach(p => {
        preciosBase.set(p.nombre, p.precio)
    });

    const productosDescontados = aplicarDescuento(rarezaAleatoria, descuentoFijo);

    const contenedorProductos = document.querySelector('#escena-2 .fila1');
    contenedorProductos.innerHTML = '';

    productosDescontados.forEach((producto) => {

        const nombreProducto = producto.nombre;
        const precioOrigen = preciosBase.get(nombreProducto);
        const precioFinal = producto.precio;
        const tieneDescuento = producto.rareza === rarezaAleatoria; //Esto es como un if: si rareza es igual a rarezaAleatoria es true, si no false 

        const productoDiv = document.createElement('div');
        productoDiv.className = 'productos';


        productoDiv.innerHTML = `
            <div class="foto">
                <img src="${producto.imagen}" alt="${producto.nombre}">
            </div>
            <div class="stats2">
                <p><strong>${producto.nombre}</strong></p>
                <p>Tipo: ${producto.tipo}</p>
                <p>Bonus: +${producto.bonus}</p>
                <p>Rareza: ${producto.rareza}</p>
                <p class="precio ${tieneDescuento ? 'con-descuento' : ''}">
                    ${tieneDescuento ? `<span class="precio-tachado">${producto.formatearAtributos(precioOrigen)} Ryō</span> ` : ''}
                    ${producto.formatearAtributos(precioFinal)} Ryō
                </p>
            </div>
            <div>
                <button class="btn-comprar" data-nombre="${producto.nombre}">Añadir</button>
            </div>
        `;

        contenedorProductos.appendChild(productoDiv);


        const btnComprar = productoDiv.querySelector('.btn-comprar');
        btnComprar.addEventListener('click', () => alternarProducto(producto, productoDiv, btnComprar));
    });

    if (rarezaAleatoria) {

        const mensajeDescuento = document.createElement('p');
        mensajeDescuento.className = 'mensaje-descuento';
        mensajeDescuento.textContent = `¡${descuentoFijo}% de descuento en productos ${rarezaAleatoria}!`;
        contenedorProductos.parentElement.insertBefore(mensajeDescuento, contenedorProductos);
    }
}

/**
 * Añade o retira un producto de la cesta de la compra (productosEnCesta).
 * Aplica restricciones: máximo 6 productos en total y solo un objeto legendario por tipo (Arma, Armadura, Consumible).
 * @param {Producto} producto El producto seleccionado/deseleccionado.
 * @param {HTMLElement} productoDiv El div que representa el producto en el mercado.
 * @param {HTMLElement} btnComprar El botón de "Añadir"/"Retirar".
 */

function alternarProducto(producto, productoDiv, btnComprar) {

    const indexEnCesta = productosEnCesta.findIndex(p => p.nombre === producto.nombre);

    if (indexEnCesta === -1) {

        if (productosEnCesta.length >= 6) {
            alert('¡Inventario lleno! Solo puedes comprar 6 productos.');
            return;
        }

        if (producto.rareza === "Legendaria") {
            const legendario = producto.tipo;
            const yaHayLegendaria = productosEnCesta.some(item => item.rareza === "Legendaria" && item.tipo === legendario);

            if (yaHayLegendaria) {
                alert('Solamente puedes comprar un objeto legendario por atributo');
                return;
            }
        }

        crearAnimacionCompra(btnComprar, productosEnCesta.length);

        productosEnCesta.push(producto);
        productoDiv.classList.add('seleccionado');
        btnComprar.textContent = 'Retirar';
        btnComprar.classList.add('retirar');
    } else {

        productosEnCesta.splice(indexEnCesta, 1);
        productoDiv.classList.remove('seleccionado');
        btnComprar.textContent = 'Añadir';
        btnComprar.classList.remove('retirar');
    }

    actualizarInventarioVisual();
    actualizarCosteCesta();
}

/**
 * Crea monedas que vuelan desde el botón hacia el slot específico del inventario
 * @param {HTMLElement} boton - El botón desde donde salen las monedas
 * @param {number} slotIndex - Índice del slot de inventario destino (0-5)
 */
function crearAnimacionCompra(boton, slotIndex) {
    // Animar el botón
    boton.classList.add('comprando');
    setTimeout(() => boton.classList.remove('comprando'), 600);
    
    // Obtener posiciones
    const rectBoton = boton.getBoundingClientRect();
    const slotDestino = document.querySelectorAll('#inventario-contenedor .item')[slotIndex];
    const rectSlot = slotDestino.getBoundingClientRect();
    
    // Calcular centro de cada elemento
    const origenX = rectBoton.left + rectBoton.width / 2;
    const origenY = rectBoton.top + rectBoton.height / 2;
    const destinoX = rectSlot.left + rectSlot.width / 2 - origenX;
    const destinoY = rectSlot.top + rectSlot.height / 2 - origenY;
    
    // Crear 6 monedas
    for (let i = 0; i < 6; i++) {
        const moneda = document.createElement('i');
        moneda.className = 'particula-compra fa-solid fa-coins';
        moneda.style.left = origenX + 'px';
        moneda.style.top = origenY + 'px';
        moneda.style.setProperty('--destino-x', `${destinoX + (Math.random() - 0.5) * 40}px`);
        moneda.style.setProperty('--destino-y', `${destinoY + (Math.random() - 0.5) * 40}px`);
        moneda.style.animationDelay = `${i * 0.05}s`;
        
        document.body.appendChild(moneda);
        setTimeout(() => moneda.remove(), 1050 + i * 50);
    }
}


/**
 * Actualiza visualmente los íconos de los productos seleccionados en el footer (inventario-contenedor).
 */

function actualizarInventarioVisual() {
    const items = document.querySelectorAll('#inventario-contenedor .item');

    items.forEach((item, index) => {
        const hayImagen = item.querySelector('img') !== null;
        item.innerHTML = '';
        if (productosEnCesta[index]) {
            const img = document.createElement('img');
            img.src = productosEnCesta[index].imagen;
            img.alt = productosEnCesta[index].nombre;
            item.appendChild(img);

            if (!hayImagen) {
                item.classList.add('item-añadido');
                setTimeout(() => {
                    item.classList.remove('item-añadido');
                }, 1500);
            }
        } else {
            item.classList.remove('item-añadido');

        }
    });
}

/**
 * Limpia todos los espacios visuales de íconos en el footer.
 */

function limpiarInventario() {
    const items = document.querySelectorAll('#inventario-contenedor .item');
    items.forEach(item => item.innerHTML = '');
}

/**
 * Confirma la compra: transfiere los productos de la cesta al inventario permanente del jugador.
 * Restablece la vida del jugador a la vida máxima total (incluidos los bonus).
 * Pasa a la escena de actualización de datos (escena-3).
 */

function confirmarCompra() {
    const costeTotal = jugador.obtenerCostoTotal(productosEnCesta);

    if (productosEnCesta.length > 0 && jugador.monedero < costeTotal) {
        alert('¡No tienes suficiente Ryō para completar esta compra!');
        return;
    }

    if (costeTotal > 0) {
        const transaccionExitosa = jugador.descontarDinero(costeTotal);
        if (!transaccionExitosa) {
            alert('Error en la transacción. Dinero insuficiente.');
            return;
        }
    }

    productosEnCesta.forEach(producto => {
        jugador.anadirObjetoInventario(producto);
    });

    jugador.vida = jugador.obtenerVidaTotal();
    actualizarEstadoJugador();
    mostrarEscena('escena-3');
    dinero_sobrante = jugador.monedero;
    console.log("El dinero sobrante es: ", dinero_sobrante);

    return dinero_sobrante;

}

//Actualizar el valor de la cesta

function actualizarCosteCesta() {
    const costeTotal = jugador.obtenerCostoTotal(productosEnCesta);
    const costeElement = document.getElementById('coste-total-cesta');
    const dineroElement = document.querySelector('#escena-2 .stat-dinero');

    if (costeElement) {
        costeElement.textContent = `Coste Total: ${costeTotal} Ryō`;
    }

    if (dineroElement) {
        dineroElement.textContent = `Dinero: ${jugador.monedero} Ryō`;
    }

    return costeTotal;
}

/**
 * Inicializa y renderiza la Escena de Enemigos (escena-4), mostrando las tarjetas de los enemigos.
 */

function inicializarEnemigos() {
    const contenedorEnemigos = document.querySelector('#escena-4 .contenedor-enemigos');
    contenedorEnemigos.innerHTML = '';

    enemigos.forEach((enemigo) => {
        const enemigoDiv = document.createElement('div');
        enemigoDiv.className = 'enemigo-tarjeta';

        enemigoDiv.innerHTML = `
            <div class="enemigo-foto">
                <img src="${enemigo.avatar}" alt="${enemigo.nombre}">
            </div>
            <div class="enemigo-stats">
                <h3>${enemigo.nombre}</h3>
                <p>Ataque: ${enemigo.nivelAtaque}</p>
                <p>Vida: ${enemigo.puntosVida}</p>
                ${enemigo instanceof Jefe ? `<p class="jefe-tag">¡JEFE! x${enemigo.multiplicadorDano}</p>` : ''}
            </div>
        `;

        contenedorEnemigos.appendChild(enemigoDiv);
    });
}

/**
 * Inicia el combate contra el enemigo actual.
 * Muestra la escena de combate (escena-5), aplica animación de entrada y llama a la lógica de combate.
 */

function iniciarCombate() {
    if (enemigoActual >= enemigos.length) {
        mostrarEscenaFinal();
        return;
    }

    const enemigo = enemigos[enemigoActual];

    const imgJugador = document.getElementById('img-jugador-batalla');
    const imgEnemigo = document.getElementById('img-enemigo-batalla');
    const contenedorJugador = document.querySelector('.combatiente.jugador-combate');
    const contenedorEnemigo = document.querySelector('.combatiente.enemigo-combate');

    imgJugador.src = jugador.avatar;
    imgEnemigo.src = enemigo.avatar;
    mostrarEscena('escena-5');

    contenedorJugador.classList.add('posicion-Inicial');
    contenedorEnemigo.classList.add('posicion-Inicial');

    requestAnimationFrame(() => {

        //requestAnimationFrame es una función que dice al navegador que ejecute una función antes del repintado de la pantalla

        contenedorJugador.classList.remove('posicion-Inicial');
        contenedorEnemigo.classList.remove('posicion-Inicial');
    });


    const resultado = combate(enemigo, jugador);
    mostrarResultadoCombate(resultado, enemigo);
}

/**
 * Muestra los resultados principales del combate y genera el resumen de turnos.
 * @param {Object} resultado Objeto de resultado retornado por la función `combate`.
 * @param {Enemigo|Jefe} enemigo La instancia del enemigo que se combatió (original, no clonada).
 */

function mostrarResultadoCombate(resultado, enemigo) {

    document.getElementById('img-jugador-batalla').src = jugador.avatar;
    document.getElementById('nombre-jugador-batalla').textContent = "Héroe: " + jugador.nombre;
    document.getElementById('vida-jugador-batalla').textContent = "Vida: " + jugador.obtenerVidaTotal();
    document.getElementById('img-enemigo-batalla').src = enemigo.avatar;
    document.getElementById('nombre-enemigo-batalla').textContent = "Enemigo: " + enemigo.nombre;
    document.getElementById('vida-enemigo-batalla').textContent = "Vida: " + enemigo.puntosVida;

    const resultadoDiv = document.getElementById('resultado-principal');
    const textoResultado = document.getElementById('texto-resultado');
    const puntosGanados = document.getElementById('puntos-ganados');

    if (resultado.victoria) {
        resultadoDiv.className = 'resultado-principal victoria';
        textoResultado.textContent = `Ganador: ${jugador.nombre}`;
        puntosGanados.textContent = `Puntos ganados: ${resultado.puntosGanados}`;
        puntosGanados.style.display = 'block';
    } else {
        resultadoDiv.className = 'resultado-principal derrota';
        textoResultado.textContent = 'Has sido derrotado';
        puntosGanados.style.display = 'none';
    }


    const resumenDiv = document.getElementById('resumen-combate');
    generarResumenTurnos(resultado.listaTurnos, resumenDiv);


    actualizarBotonBatalla(resultado.victoria);


    dinero_sobrante += enemigo.moneda;
    console.log(dinero_sobrante);


    mostrarEscena('escena-5');
}

/**
 * Genera y muestra visualmente el resumen detallado de cada turno del combate.
 * @param {Array<Object>} turnos Lista de objetos de turno generados por `combate`.
 * @param {HTMLElement} contenedor El elemento DOM donde se renderizará el resumen.
 */

function generarResumenTurnos(turnos, contenedor) {
    contenedor.innerHTML = '';

    turnos.forEach(turno => {
        const turnoDiv = document.createElement('div');
        turnoDiv.className = 'turno';

        turnoDiv.innerHTML = `
            <h3>Turno ${turno.numero}</h3>
            <p><strong>${turno.atacante1}</strong> Ataca con <span class="dano">${turno.dano1}</span> de daño.</p>
            <p>Vida restante del Enemigo: <span class="positivo">${turno.vidaRestanteEnemigo}</span></p>
            
            ${turno.enemigoRespondio ? `
                <hr>
                <p><strong>${turno.atacante2}</strong> Contraataca con <span class="dano">${turno.dano2}</span> de daño.</p>
                <p>Defensa inicial del héroe: <span class="positivo">${turno.defensaInicial}</span></p>
                <p>Daño absorbido por la defensa: <span class="positivo">${turno.danoAbsorbido}</span></p>
                ${turno.danoRealVida > 0 ? `<p>Daño que recibe el héroe: <span class="dano">${turno.danoRealVida}</span></p>` : ''}
                <p>Defensa después del ataque: <span class="${turno.defensaFinal > 0 ? 'positivo' : 'dano'}">${turno.defensaFinal}</span></p>
                <p>Vida restante del Héroe: <span class="positivo">${turno.vidaRestanteJugador}</span></p>
            ` : ''}
        `;

        contenedor.appendChild(turnoDiv);
    });
}

/**
 * Configura el botón de acción después del combate.
 * Si es derrota, establece "Reiniciar". Si es victoria, establece "Continuar" o "Ver resultados" si es el último enemigo.
 * @param {boolean} victoria Indica si el jugador ganó el combate actual.
 */

function actualizarBotonBatalla(victoria) {
    const btn = document.getElementById('btn-accion-batalla');

    if (!victoria) {
        btn.textContent = 'Ver resultados';
        btn.className = 'btn-reiniciar';
        btn.onclick = () => mostrarEscenaFinal();
        return;
    }

    enemigoActual++;

    if (enemigoActual < enemigos.length) {
        btn.textContent = 'Continuar';
        btn.className = 'btn-continuar';
        btn.onclick = () => iniciarCombate();
    } else {
        btn.textContent = 'Ver resultados';
        btn.className = 'btn-continuar';
        btn.onclick = () => mostrarEscenaFinal();
    }
}

/**
 * Muestra la escena final (escena-6).
 * Calcula el rango del jugador basado en sus puntos y lo muestra.
 * Activa la animación de confeti.
 */

function mostrarEscenaFinal() {
    puntos_finales = jugador.puntos + dinero_sobrante;
    const rango = distinguirJugador(puntos_finales);

    guardarDatosFinales(rango);

    document.getElementById('puntos-finales').textContent = `Puntuación final: ${puntos_finales}`;

    const rangoElement = document.getElementById('rango-final');
    rangoElement.textContent = `Rango: ${rango}`;
    rangoElement.className = `rango ${rango.toLowerCase()}`;


    if (typeof confetti === 'function') {
        confetti({
            particleCount: 300,
            spread: 90,
            origin: { y: 0.8 } // Por dónde dispara los confettis en la pantalla
        });
    }

    mostrarEscena('escena-6');
}

/**
 * Configura todos los Event Listeners para los botones de navegación entre escenas.
 */

function configurarEventListeners() {

    const formSesion = document.getElementById('sesion');
    const inputHeroe = document.getElementById('heroe');
    const inputAtaque = document.getElementById('ataque');
    const inputDefensa = document.getElementById('defensa');
    const inputVida = document.getElementById('vida');
    const regexNombre = /^[A-Z][a-z]{0,19}$/;

    function manejarEnvioFormulario(e) {
        e.preventDefault();

        const nombreHeroe = inputHeroe.value.trim();
        const numeroA = parseInt(inputAtaque.value, 10);
        const numeroD = parseInt(inputDefensa.value, 10);
        const numeroV = parseInt(inputVida.value, 10);

        if (!nombreHeroe) {
            alert("Introduce un nombre para el héroe");
            return;
        } else if (!regexNombre.test(nombreHeroe)) {
            alert("Nombre no válido. Vuelve a probar");
            return;
        }

        if (isNaN(numeroA) || isNaN(numeroD) || isNaN(numeroV)) {
            alert("Ataque, defensa y vida deben ser números enteros válidos.");
            return;
        }

        const suma = numeroA + numeroD + numeroV;

        if (suma > 110) {
            alert("La suma del ataque,la defensa y la vida no pueden superar 110");
            return;
        } else if (numeroA < 0 || numeroD < 0) {
            alert("El ataque o la defensa no puede ser menor que 0");
            return;
        } else if (numeroA > 10 || numeroD > 10) {
            alert("El ataque o la defensa no pueden ser mayores que 10")
            return;
        } else if (numeroV < 100) {
            alert("La vida no puede ser menor que 100")
            return;
        }

        jugador.nombre = nombreHeroe;
        jugador.ataque = numeroA;
        jugador.defensa = numeroD;
        jugador.vidaMaxima = numeroV;

        setTimeout(() => {
            inicializarJuego();
            mostrarEscena('escena-1');
        }, 0);
    }


    if (formSesion) {
        formSesion.addEventListener('submit', manejarEnvioFormulario);
    }

    const btnContinuar1 = document.querySelector('#escena-1 #btn-continuar-1');
    if (btnContinuar1) {
        btnContinuar1.addEventListener('click', () => {
            console.log('Botón continuar 1 presionado');
            inicializarMercado();
            mostrarEscena('escena-2');
        });
    }


    const btnContinuar2 = document.querySelector('#escena-2 #btn-continuar-2');
    if (btnContinuar2) {
        btnContinuar2.addEventListener('click', () => {
            console.log('Botón continuar 2 presionado');
            confirmarCompra();
        });
    }


    const btnContinuar3 = document.querySelector('#escena-3 #btn-continuar-3');
    if (btnContinuar3) {
        btnContinuar3.addEventListener('click', () => {
            console.log('Botón continuar 3 presionado');
            inicializarEnemigos();
            mostrarEscena('escena-4');
        });
    }


    const btnContinuar4 = document.querySelector('#escena-4 #btn-continuar-4');
    if (btnContinuar4) {
        btnContinuar4.addEventListener('click', () => {
            console.log('Botón continuar 4 presionado');
            iniciarCombate();
        });
    }

    const btnContinuar5 = document.querySelector('#escena-6 #btn-continuar-5');
    if (btnContinuar5) {
        btnContinuar5.addEventListener('click', () => {
            console.log('Botón continuar 5 presionado');
            const historial = obtenerPuntuacionesHistoricas();
            console.log("Este es el historial de puntuaciones: ", historial);
            
        });
    }
}

//Obtener las puntuaciones

function obtenerPuntuacionesHistoricas() {
    try {
        const data = localStorage.getItem(LS_KEY_PUNTUACIONES);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error al leer localStorage:", e);
        return [];
    }
}

//Guardar los datos finales

function guardarDatosFinales(rango) {
    const nuevaPuntuacion = {
        nombre: jugador.nombre,
        puntos: puntos_finales,
        dinero: dinero_sobrante,
        rango: rango
    };

    const historico = obtenerPuntuacionesHistoricas();
    historico.push(nuevaPuntuacion);

    try {
        localStorage.setItem(LS_KEY_PUNTUACIONES, JSON.stringify(historico));
    } catch (e) {
        console.error("Error al escribir en localStorage:", e);
    }

}

/**
 * Genera y muestra la tabla de puntuaciones históricas en la escena final.
 * @param {Array<Object>} puntuaciones El historial de puntuaciones a mostrar.
 */
function generarTablaPuntuaciones(puntuaciones) {
    const contenedorTabla = document.getElementById('historial-puntuaciones');
    contenedorTabla.innerHTML = '';

    if (puntuaciones.length === 0) {
        contenedorTabla.innerHTML = '<p>No hay partidas anteriores registradas.</p>';
        return;
    }

    // Ordenar puntos
    puntuaciones.sort((a, b) => b.puntos - a.puntos);

    const tabla = document.createElement('table');
    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Puntos</th>
                <th>Dinero</th>
                <th>Rango</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;

    const tbody = tabla.querySelector('tbody');
    puntuaciones.forEach(partida => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${partida.nombre}</td>
            <td>${partida.puntos}</td>
            <td>${partida.dinero_sobrante}</td>
            <td>${partida.rango}</td>
        `;
        tbody.appendChild(fila);
    });

    const titulo = document.createElement('h3');
    titulo.textContent = 'Historial de Puntuaciones';
    contenedorTabla.appendChild(titulo);
    contenedorTabla.appendChild(tabla);
}


/**
 * Función principal para arrancar el juego.
 * Llama a las funciones de inicialización y configuración de eventos.
 */

function iniciar() {
    console.log('Inicializando juego...');
    /*inicializarJuego();*/
    configurarEventListeners();
    console.log('Juego inicializado correctamente');
}

iniciar();
