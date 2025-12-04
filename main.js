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
    productosEnCesta.forEach(producto => {
        jugador.anadirObjetoInventario(producto);
    });

    jugador.vida = jugador.obtenerVidaTotal();
    actualizarEstadoJugador();
    mostrarEscena('escena-3');
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
        btn.textContent = 'Reiniciar';
        btn.className = 'btn-reiniciar';
        btn.onclick = () => location.reload();
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
    const rango = distinguirJugador(jugador.puntos);

    document.getElementById('puntos-finales').textContent = `Puntuación final: ${jugador.puntos}`;

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

    if (formSesion) {
        formSesion.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombreHeroe = inputHeroe.value.trim();
            if (!nombreHeroe) {
                alert("Introduce un nombre para el héroe");
                return;
            } else if (!regexNombre.test(nombreHeroe)) {
                alert("Nombre no válido. Vuelve a probar");
                return;
            } /*else if(int(inputAtaque)+int(inputDefensa)+int(inputVida)>110){
                alert("La suma del ataque, la defansa y la vida no pueden ser mayor a 110")
            }*/

            jugador.nombre = nombreHeroe;
            inicializarJuego();
            mostrarEscena('escena-1');
        });
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
