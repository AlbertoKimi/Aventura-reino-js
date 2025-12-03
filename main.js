import { Jugador } from './Clases/Jugador.js';
import { Enemigo } from './Clases/Enemigo.js';
import { Jefe } from './Clases/Jefe.js';
import { descuentoFijo, opcionesRarezas, tipos } from './Utilies-constantes/Constantes.js';
import { mostrarEscena, obtenerElementoAleatorio, clonarProductos } from './Utilies-constantes/Utilies.js';
import { combate } from './Módulos/Batalla.js';
import { distinguirJugador } from './Módulos/Ranking.js';
import { filtrarProductos, buscarProducto, aplicarDescuento } from './Módulos/Mercado.js';

// Variables globales

let jugador = new Jugador("", "./Imagenes/Prota-armado.png", 100,500);
let productosEnCesta = [];
let enemigos = [];
let enemigoActual = 0;

// Constante para la clave de localStorage
const LS_KEY_PUNTUACIONES = 'puntuacionesHistoricas';
// Constante para el nombre de la cookie
const COOKIE_NAME = 'ultimaPartida';

/**
 * Función de utilidad para establecer una cookie.
 * @param {string} name Nombre de la cookie.
 * @param {string} value Valor de la cookie.
 * @param {number} days Días de expiración.
 */
function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

/**
 * Función de utilidad para obtener el valor de una cookie.
 * @param {string} name Nombre de la cookie.
 * @returns {string | null} El valor de la cookie o null si no existe.
 */
function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

/**
 * Obtiene el historial de puntuaciones guardadas en localStorage.
 * @returns {Array<Object>} Lista de objetos de puntuación histórica.
 */
function obtenerPuntuacionesHistoricas() {
    try {
        const data = localStorage.getItem(LS_KEY_PUNTUACIONES);
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error al leer localStorage:", e);
        return [];
    }
}

/**
 * Guarda los datos finales del jugador (nombre, puntos, rango) en localStorage y en una cookie.
 * @param {string} rango El rango final del jugador.
 */
function guardarDatosFinales(rango) {
    const nuevaPuntuacion = {
        nombre: jugador.nombre,
        puntos: jugador.puntos,
        rango: rango,
        fecha: new Date().toLocaleString()
    };

    const historico = obtenerPuntuacionesHistoricas();
    historico.push(nuevaPuntuacion);
    try {
        localStorage.setItem(LS_KEY_PUNTUACIONES, JSON.stringify(historico));
    } catch (e) {
        console.error("Error al escribir en localStorage:", e);
    }

    const datosCookie = JSON.stringify({
        nombre: jugador.nombre,
        puntos: jugador.puntos,
        rango: rango
    });
    setCookie(COOKIE_NAME, datosCookie, 7); // Guardar por 7 días
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
                <th>Rango</th>
                <th>Fecha</th>
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
            <td>${partida.rango}</td>
            <td>${partida.fecha}</td>
        `;
        tbody.appendChild(fila);
    });

    const titulo = document.createElement('h3');
    titulo.textContent = 'Historial de Puntuaciones';
    contenedorTabla.appendChild(titulo);
    contenedorTabla.appendChild(tabla);
}

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

    /*mostrarEscena('escena-1');*/
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
 * Renderiza los productos en el mercado aplicando los filtros activos.
 * @param {Array<Producto>} productosFiltrados Lista de productos a mostrar.
 * @param {string} rarezaDescuento Rareza que tiene descuento aplicado.
 */
function renderizarProductos(productosFiltrados, rarezaDescuento, preciosBase) {
    const contenedorProductos = document.querySelector('#escena-2 .fila1');
    contenedorProductos.innerHTML = '';

    if (productosFiltrados.length === 0) {
        contenedorProductos.innerHTML = '<p class="mensaje-sin-resultados">No se encontraron productos con esos criterios.</p>';
        return;
    }

    productosFiltrados.forEach((producto) => {
        const nombreProducto = producto.nombre;
        const precioOrigen = preciosBase.get(nombreProducto);
        const precioFinal = producto.precio;
        const tieneDescuento = producto.rareza === rarezaDescuento;

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

        // Si el producto está en la cesta
        const estaEnCesta = productosEnCesta.some(p => p.nombre === producto.nombre);
        if (estaEnCesta) {
            productoDiv.classList.add('seleccionado');
            btnComprar.textContent = 'Retirar';
            btnComprar.classList.add('retirar');
        }
    });
}

/**
 * Aplica los filtros de búsqueda (rareza y nombre) a la lista de productos.
 * @param {string} rarezaDescuento La rareza que tiene descuento activo.
 */
function aplicarFiltros(rarezaDescuento, preciosBase) {
    const inputNombre = document.getElementById('filtro-nombre');
    const selectRareza = document.getElementById('filtro-rareza');

    const nombreBusqueda = inputNombre.value.trim();
    const rarezaSeleccionada = selectRareza.value;

    let productos = clonarProductos();

    if (rarezaSeleccionada !== 'todas') {
        productos = filtrarProductos(rarezaSeleccionada);
    }

    if (nombreBusqueda !== '') {
        productos = buscarProducto(nombreBusqueda);

        if (rarezaSeleccionada !== 'todas') {
            productos = productos.filter(p => p.rareza === rarezaSeleccionada);
        }
    }

    renderizarProductos(productos, rarezaDescuento, preciosBase);
}

/**
 * Limpia todos los filtros y muestra todos los productos.
 * @param {string} rarezaDescuento La rareza que tiene descuento activo.
 */
function limpiarFiltros(rarezaDescuento, preciosBase) {
    const inputNombre = document.getElementById('filtro-nombre');
    const selectRareza = document.getElementById('filtro-rareza');

    inputNombre.value = '';
    selectRareza.value = 'todas';

    const productos = clonarProductos();
    renderizarProductos(productos, rarezaDescuento, preciosBase);
}

/**
 * Inicializa el mercado, limpiando mensajes anteriores, limpiando el formulario, imprimiendo
 * la lista de productos y controlando los listener de los filtros
 */

function inicializarMercado() {

    const dineroElement = document.getElementById('dinero');
    if (dineroElement) dineroElement.textContent = `Dinero: ${jugador.monedero} Ryō`;

    const rarezaAleatoria = obtenerElementoAleatorio(opcionesRarezas);
    const productosBase = clonarProductos();

    const preciosBase = new Map();
    productosBase.forEach(p => {
        preciosBase.set(p.nombre, p.precio)
    });;

    const mensajePrevio = document.querySelector('.mensaje-descuento');
    if (mensajePrevio) {
        mensajePrevio.remove();
    }

    if (rarezaAleatoria) {
        const mensajeDescuento = document.createElement('p');
        mensajeDescuento.className = 'mensaje-descuento';
        mensajeDescuento.textContent = `¡${descuentoFijo}% de descuento en productos ${rarezaAleatoria}!`;

        const formulario = document.getElementById('form-filtros');
        formulario.parentElement.insertBefore(mensajeDescuento, formulario);
    }

    const form = document.getElementById('form-filtros');
    form.reset();

    renderizarProductos(productosBase, rarezaAleatoria, preciosBase);

    const inputNombre = document.getElementById('filtro-nombre');
    const selectRareza = document.getElementById('filtro-rareza');
    const btnLimpiar = document.getElementById('btn-limpiar-filtros');

    /*form.addEventListener('submit', (e) => {
        e.preventDefault();
        aplicarFiltros(rarezaAleatoria, preciosBase);
    });*/

    inputNombre.addEventListener('input', () => {
        aplicarFiltros(rarezaAleatoria, preciosBase);
    });

    selectRareza.addEventListener('change', () => {
        aplicarFiltros(rarezaAleatoria, preciosBase);
    });

    btnLimpiar.addEventListener('click', () => {
        limpiarFiltros(rarezaAleatoria, preciosBase);
    });
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
    actualizarCosteCesta();
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
 * Actualiza el coste total de la cesta en la escena del mercado (escena-2).
 */
function actualizarCosteCesta() {
    const costeTotal = jugador.obtenerCostoTotal(productosEnCesta);
    const costeElement = document.getElementById('coste-total-cesta');
    const dineroElement = document.querySelector('#escena-2 .stat-dinero');

    if (costeElement) {
        costeElement.textContent = `Coste Total: ${costeTotal} Ryō`;
    }
    
    // Asegurar que el dinero se actualice si estamos en escena-2
    if (dineroElement) {
        dineroElement.textContent = `Dinero: ${jugador.monedero} Ryō`;
    }
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

    productosEnCesta = []

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
        btn.textContent = 'Ver Resultado';
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
 * Tabla de puntuaciones del localStorage
 * Activa la animación de confeti.
 */

function mostrarEscenaFinal() {
    const rango = distinguirJugador(jugador.puntos);

    guardarDatosFinales(rango);

    document.getElementById('puntos-finales').textContent = `Puntuación final: ${jugador.puntos}`;

    document.getElementById('puntos-finales').textContent = `Puntuación final: ${jugador.puntos}`;

    const rangoElement = document.getElementById('rango-final');
    rangoElement.textContent = `Rango: ${rango}`;
    rangoElement.className = `rango ${rango.toLowerCase()}`;

    const historial = obtenerPuntuacionesHistoricas();
    generarTablaPuntuaciones(historial);

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

    //Aquí configuro el botón de la escena-0

    const formSesion = document.getElementById('sesion');
    const inputHeroe = document.getElementById('heroe');
    const regexNombre = /^[A-Z][a-z]{0,9}$/;

    if (formSesion) {
        formSesion.addEventListener('submit', (e) => {
            e.preventDefault();
            const nombreHeroe = inputHeroe.value.trim();
            if (!nombreHeroe) {
                alert("Introduce un nombre para el héroe");
                return;
            } else if(!regexNombre.test(nombreHeroe)){
                alert("Nombre no válido. Vuelve a probar");
                return;
            }

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

    //He puesto otro botón para que elija volver a jugar o poner otro nombre

    const btnOtroNombre = document.getElementById('btn-otro-nombre');
    const btnMismoNombre = document.getElementById('btn-mismo-nombre');

    if (btnOtroNombre) {
        btnOtroNombre.addEventListener('click', () => {
            console.log('Botón poner otro nombre presionado. Recargando...');
            location.reload();
        });
    }

    if (btnMismoNombre) {
        btnMismoNombre.addEventListener('click', () => {
            console.log('Botón jugar con mismo nombre presionado. Volviendo a escena-1...');
            reiniciarPartidaMismoNombre();
        });
    }
}

/**
 * Reinicia el estado del jugador y del juego (enemigos, inventario, puntos)
 * para empezar una nueva partida desde escena-1, manteniendo el nombre actual.
 */
function reiniciarPartidaMismoNombre() {
    console.log(`Reiniciando partida para ${jugador.nombre}...`);

    jugador.puntos = 0;
    jugador.inventario = [];
    jugador.vida = jugador.vidaMaxima;
    jugador.monedero = 500;

    enemigos = [
        new Enemigo("Mecalobo", "./Imagenes/Enemigos/Lobo.png", 10, 100),
        new Enemigo("Nenji", "./Imagenes/Enemigos/Guerrero.png", 20, 200),
        new Enemigo("Dragón", "./Imagenes/Enemigos/Dragon.png", 25, 250),
        new Enemigo("Symercy", "./Imagenes/Enemigos/Maga.png", 35, 350),
        new Jefe("Xasper", "./Imagenes/Enemigos/Enemigo-final.png", 50, 500, 1.2)
    ];
    enemigoActual = 0;
    productosEnCesta = [];

    actualizarEstadoJugador();
    limpiarInventario();
    mostrarEscena('escena-1');
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
