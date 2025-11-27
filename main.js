import { Jugador } from './Clases/Jugador.js';
import { Enemigo } from './Clases/Enemigo.js';
import { Jefe } from './Clases/Jefe.js';
import { descuentoFijo, opcionesRarezas, tipos } from './Utilies-constantes/Constantes.js';
import { mostrarEscena, obtenerElementoAleatorio, clonarProductos } from './Utilies-constantes/Utilies.js';
import { combate } from './Módulos/Batalla.js';
import { distinguirJugador } from './Módulos/Ranking.js';

// Variables globales

let jugador;
let productosEnCesta = [];
let enemigos = [];
let enemigoActual = 0;

//Iniciamos el juego

function inicializarJuego() {

    jugador = new Jugador("Nyxarius", "./Imagenes/Prota-armado.png", 100);

    // Crear enemigos
    enemigos = [
        new Enemigo("Mecalobo", "./Imagenes/Enemigos/Lobo.png", 10, 50),
        new Enemigo("Nenji", "./Imagenes/Enemigos/guerrero.png", 15, 60),
        new Enemigo("Dragón", "./Imagenes/Enemigos/Dragon.png", 25, 100),
        new Enemigo("Symercy", "./Imagenes/Enemigos/Maga.png", 35, 150),
        new Jefe("Xasper", "./Imagenes/Enemigos/Enemigo-final.png", 40, 250, 1.2)
    ];

    enemigoActual = 0;
    productosEnCesta = [];

    mostrarEscena('scene-1');
    actualizarEstadoJugador();

    limpiarInventario();
}

// Actualizar los datos del jugador

function actualizarEstadoJugador() {
    const scenes = ['scene-1', 'scene-3'];

    scenes.forEach(sceneId => {
        const scene = document.getElementById(sceneId);
        if (scene) {
            const nombreElement = scene.querySelector('.nombre-jugador');
            const ataqueElement = scene.querySelector('.stat-ataque');
            const defensaElement = scene.querySelector('.stat-defensa');
            const vidaElement = scene.querySelector('.stat-vida');
            const puntosElement = scene.querySelector('.stat-puntos');

            if (nombreElement) nombreElement.textContent = jugador.nombre;
            if (ataqueElement) ataqueElement.textContent = `Ataque: ${jugador.obtenerAtaqueTotal()}`;
            if (defensaElement) defensaElement.textContent = `Defensa: ${jugador.obtenerDefensaTotal()}`;
            if (vidaElement) vidaElement.textContent = `Vida: ${jugador.obtenerVidaTotal()}`;
            if (puntosElement) puntosElement.textContent = `Puntos: ${jugador.puntos}`;
        }
    });
}

//Inicializamos el mercado

function inicializarMercado() {

    const rarezaAleatoria = obtenerElementoAleatorio(opcionesRarezas);
    const productos = clonarProductos();

    const contenedorProductos = document.querySelector('#scene-2 .fila1');
    contenedorProductos.innerHTML = '';

    productos.forEach((producto) => {

        const precioFinal = producto.aplicarDescuento("rareza", rarezaAleatoria, descuentoFijo);
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
                    ${tieneDescuento ? `<span class="precio-tachado">${producto.formatearAtributos(producto.precio)} Ryō</span> ` : ''}
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
 * Alterna la selección de un producto
 */
function alternarProducto(producto, productoDiv, btnComprar) {
  
    const indexEnCesta = productosEnCesta.findIndex(p => p.nombre === producto.nombre);

    //He puesto una restricción de que solamente se pueda comprar un objeto legendario por atributo (consumible,ataque o defensa)
    if (indexEnCesta === -1) {
        if (producto.rareza === "Legendaria") {
            const legendario = producto.tipo;
            const yaHayLegendaria = productosEnCesta.some(item => item.rareza === "Legendaria" && item.tipo === legendario);

            if (yaHayLegendaria) {
                alert('Solamente puedes comprar un objeto legendario por atributo');
                return;
            }
        }
        // Añadir a la cesta 
        productosEnCesta.push(producto);
        productoDiv.classList.add('seleccionado');
        btnComprar.textContent = 'Retirar';
        btnComprar.classList.add('retirar');
    } else {
        // Quitar de la cesta
        productosEnCesta.splice(indexEnCesta, 1);
        productoDiv.classList.remove('seleccionado');
        btnComprar.textContent = 'Añadir';
        btnComprar.classList.remove('retirar');
    }

    actualizarInventarioVisual();
}

//Actualizar footer

function actualizarInventarioVisual() {
    const items = document.querySelectorAll('#inventory-container .item');

    items.forEach((item, index) => {
        item.innerHTML = '';
        if (productosEnCesta[index]) {
            const img = document.createElement('img');
            img.src = productosEnCesta[index].imagen;
            img.alt = productosEnCesta[index].nombre;
            item.appendChild(img);
        }
    });
}

//Limpiar inventario:

function limpiarInventario() {
    const items = document.querySelectorAll('#inventory-container .item');
    items.forEach(item => item.innerHTML = '');
}

//Confirmación de la compra

function confirmarCompra() {
    productosEnCesta.forEach(producto => {
        jugador.anadirObjetoInventario(producto);
    });

    jugador.vida = jugador.obtenerVidaTotal();
    actualizarEstadoJugador();
    mostrarEscena('scene-3');
}

//Escena enemigos:

function inicializarEnemigos() {
    const contenedorEnemigos = document.querySelector('#scene-4 .contenedor-enemigos');
    contenedorEnemigos.innerHTML = '';

    enemigos.forEach((enemigo) => {
        const enemigoDiv = document.createElement('div');
        enemigoDiv.className = 'enemigo-card';

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

//Combates:

function iniciarCombate() {
    if (enemigoActual >= enemigos.length) {
        mostrarEscenaFinal();
        return;
    }

    const enemigo = enemigos[enemigoActual];

    // 1. Obtener referencias
    const $imgJugador = document.getElementById('img-jugador-batalla');
    const $imgEnemigo = document.getElementById('img-enemigo-batalla');
    const $contenedorJugador = $imgJugador.closest('.combatiente');
    const $contenedorEnemigo = $imgEnemigo.closest('.combatiente');

    // 2. Mostrar la escena y actualizar imágenes
    $imgJugador.src = jugador.avatar;
    $imgEnemigo.src = enemigo.avatar;
    mostrarEscena('scene-5');

    $contenedorJugador.classList.remove('initial-position');
    $contenedorEnemigo.classList.remove('initial-position');

    requestAnimationFrame(() => {

        $contenedorJugador.classList.add('initial-position');
        $contenedorEnemigo.classList.add('initial-position');

        requestAnimationFrame(() => {

            $contenedorJugador.classList.remove('initial-position');
            $contenedorEnemigo.classList.remove('initial-position');
        });
    });

    const resultado = combate(enemigo, jugador);
    mostrarResultadoCombate(resultado, enemigo);
}

//Mostrar turnos y resultados:

function mostrarResultadoCombate(resultado, enemigo) {

    document.getElementById('img-jugador-batalla').src = jugador.avatar;
    document.getElementById('nombre-jugador-batalla').textContent = "Héroe:" + jugador.nombre;
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

    mostrarEscena('scene-5');
}

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
                <p>El héroe mitiga <span class="positivo">${jugador.obtenerDefensaTotal()}</span> del ataque del enemigo.</p>
                <p>Vida restante del Héroe: <span class="positivo">${turno.vidaRestanteJugador}</span></p>
            ` : ''}
        `;

        contenedor.appendChild(turnoDiv);
    });
}

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

// Ranking: 

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

    mostrarEscena('scene-6');
}

//Aquí están todos los Listener de los botones:

function configurarEventListeners() {

    const btnContinuar1 = document.querySelector('#scene-1 #btn-continuar-1');
    if (btnContinuar1) {
        btnContinuar1.addEventListener('click', () => {
            console.log('Botón continuar 1 presionado');
            inicializarMercado();
            mostrarEscena('scene-2');
        });
    }


    const btnContinuar2 = document.querySelector('#scene-2 #btn-continuar-2');
    if (btnContinuar2) {
        btnContinuar2.addEventListener('click', () => {
            console.log('Botón continuar 2 presionado');
            confirmarCompra();
        });
    }


    const btnContinuar3 = document.querySelector('#scene-3 #btn-continuar-3');
    if (btnContinuar3) {
        btnContinuar3.addEventListener('click', () => {
            console.log('Botón continuar 3 presionado');
            inicializarEnemigos();
            mostrarEscena('scene-4');
        });
    }


    const btnContinuar4 = document.querySelector('#scene-4 #btn-continuar-4');
    if (btnContinuar4) {
        btnContinuar4.addEventListener('click', () => {
            console.log('Botón continuar 4 presionado');
            iniciarCombate();
        });
    }
}

//Función para iniciar el juego: 

function iniciar() {
    console.log('Inicializando juego...');
    inicializarJuego();
    configurarEventListeners();
    console.log('Juego inicializado correctamente');
}

iniciar();
