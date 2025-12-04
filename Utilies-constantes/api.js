// ============================================
// VERSIÓN 1: CON DATOS LOCALES (SIN API)
// ============================================

// 1. Añadir esta escena en index.html ANTES de la escena-1:

/*
<div id="escena-0" class="escena activa">
  <div id="escena-0-contenedor">
    <h2>Selecciona tu personaje</h2>
    <div id="contenedor-personajes" class="contenedor-personajes">
      <!-- Aquí se cargarán las tarjetas de personajes -->
    </div>
    <div class="contenedor-boton-seleccion">
      <button id="btn-confirmar-personaje" class="btn-continuar" disabled>
        Confirmar selección
      </button>
    </div>
  </div>
</div>
*/

// 2. Añadir estilos en style.css:

/*
#escena-0 {
    justify-content: center;
    align-items: flex-start;
    height: auto;
}

#escena-0-contenedor {
    background-color: var(--color-primario);
    border: 3px solid var(--color-acento-1);
    border-radius: 10px;
    padding: 24px;
    width: 100%;
    max-width: 1200px;
}

#escena-0-contenedor h2 {
    color: var(--color-secundario);
    text-align: center;
    margin-bottom: 24px;
}

.contenedor-personajes {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
}

.personaje-tarjeta {
    background: var(--color-secundario);
    border: 4px solid var(--color-acento-1);
    border-radius: 10px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.personaje-tarjeta:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 15px rgba(255, 150, 0, 0.6);
}

.personaje-tarjeta.seleccionado {
    border-color: var(--color-exito);
    background-color: var(--color-terciario);
    transform: scale(1.05);
}

.personaje-foto {
    width: 150px;
    height: 150px;
    border: 3px solid var(--color-acento-1);
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 12px;
}

.personaje-foto img {
    width: 100%;
    height: 100%;
    object-fit: contain;
}

.personaje-stats {
    text-align: center;
}

.personaje-stats h3 {
    color: var(--color-primario);
    margin-bottom: 8px;
}

.personaje-stats p {
    margin: 4px 0;
    color: var(--color-primario);
    font-weight: bold;
}

.contenedor-boton-seleccion {
    text-align: center;
}
*/

// 3. Datos locales de personajes (añadir en Utilies-constantes/Constantes.js):

export const personajesDisponibles = [
    {
        id: 1,
        nombre: "Nyxarius",
        avatar: "./Imagenes/Prota-armado.png",
        vida: 100,
        descripcion: "Guerrero equilibrado"
    },
    {
        id: 2,
        nombre: "Lyra",
        avatar: "./Imagenes/Protagonista.png",
        vida: 120,
        descripcion: "Alta resistencia"
    },
    {
        id: 3,
        nombre: "Zephyr",
        avatar: "./Imagenes/Prota-armado.png",
        vida: 80,
        descripcion: "Rápido y ágil"
    }
];

// 4. Modificaciones en main.js:

// Variables globales (añadir al inicio):
let personajeSeleccionado = null;

// Función para inicializar la escena de selección de personajes:
function inicializarSeleccionPersonajes() {
    const contenedor = document.getElementById('contenedor-personajes');
    contenedor.innerHTML = '';
    
    // VERSIÓN LOCAL: usar array de personajes
    const personajes = personajesDisponibles;
    
    personajes.forEach(personaje => {
        const tarjeta = crearTarjetaPersonaje(personaje);
        contenedor.appendChild(tarjeta);
    });
}

// Función para crear cada tarjeta de personaje:
function crearTarjetaPersonaje(personaje) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'personaje-tarjeta';
    tarjeta.dataset.personajeId = personaje.id;
    
    tarjeta.innerHTML = `
        <div class="personaje-foto">
            <img src="${personaje.avatar}" alt="${personaje.nombre}">
        </div>
        <div class="personaje-stats">
            <h3>${personaje.nombre}</h3>
            <p>Vida: ${personaje.vida}</p>
            <p>${personaje.descripcion}</p>
        </div>
    `;
    
    tarjeta.addEventListener('click', () => seleccionarPersonaje(personaje, tarjeta));
    
    return tarjeta;
}

// Función para manejar la selección:
function seleccionarPersonaje(personaje, tarjeta) {
    // Remover selección anterior
    document.querySelectorAll('.personaje-tarjeta').forEach(t => {
        t.classList.remove('seleccionado');
    });
    
    // Añadir selección a la tarjeta actual
    tarjeta.classList.add('seleccionado');
    
    // Guardar personaje seleccionado
    personajeSeleccionado = personaje;
    
    // Habilitar botón de confirmar
    document.getElementById('btn-confirmar-personaje').disabled = false;
}

// Función para confirmar la selección:
function confirmarSeleccionPersonaje() {
    if (!personajeSeleccionado) {
        alert('Por favor, selecciona un personaje');
        return;
    }
    
    // Crear jugador con el personaje seleccionado
    jugador = new Jugador(
        personajeSeleccionado.nombre,
        personajeSeleccionado.avatar,
        personajeSeleccionado.vida
    );
    
    // Continuar con el flujo normal del juego
    mostrarEscena('escena-1');
    actualizarEstadoJugador();
}

// Modificar la función inicializarJuego():
function inicializarJuego() {
    // NO crear el jugador aquí, esperar a la selección
    // jugador = new Jugador("Nyxarius", "./Imagenes/Prota-armado.png", 100);
    
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
    
    // Mostrar escena de selección de personajes
    mostrarEscena('escena-0');
    inicializarSeleccionPersonajes();
    limpiarInventario();
}

// Modificar configurarEventListeners() para añadir:
function configurarEventListeners() {
    // Botón de confirmar personaje (NUEVO)
    const btnConfirmarPersonaje = document.getElementById('btn-confirmar-personaje');
    if (btnConfirmarPersonaje) {
        btnConfirmarPersonaje.addEventListener('click', confirmarSeleccionPersonaje);
    }
    
    // ... resto de event listeners existentes ...
}

// ============================================
// VERSIÓN 2: CON API
// ============================================

// Modificar inicializarSeleccionPersonajes() para usar API:

async function inicializarSeleccionPersonajes() {
    const contenedor = document.getElementById('contenedor-personajes');
    contenedor.innerHTML = '<p style="color: var(--color-secundario);">Cargando personajes...</p>';
    
    try {
        // VERSIÓN API: hacer petición a la API
        const response = await fetch('https://tu-api.com/personajes');
        
        if (!response.ok) {
            throw new Error('Error al cargar personajes');
        }
        
        const personajes = await response.json();
        
        // Limpiar contenedor
        contenedor.innerHTML = '';
        
        // Mapear datos de la API si tienen estructura diferente
        const personajesMapeados = personajes.map(p => ({
            id: p.id,
            nombre: p.name || p.nombre,
            avatar: p.image || p.avatar,
            vida: p.health || p.vida || 100,
            descripcion: p.description || p.descripcion || 'Sin descripción'
        }));
        
        // Crear tarjetas
        personajesMapeados.forEach(personaje => {
            const tarjeta = crearTarjetaPersonaje(personaje);
            contenedor.appendChild(tarjeta);
        });
        
    } catch (error) {
        console.error('Error cargando personajes:', error);
        contenedor.innerHTML = `
            <p style="color: var(--color-fallido);">
                Error al cargar personajes. Por favor, recarga la página.
            </p>
        `;
        
        // Opción: usar personajes de respaldo locales
        // mostrarPersonajesLocales(contenedor);
    }
}

// Función auxiliar para mostrar personajes locales si la API falla:
function mostrarPersonajesLocales(contenedor) {
    contenedor.innerHTML = '<p style="color: var(--color-secundario);">Cargando personajes predeterminados...</p>';
    
    setTimeout(() => {
        contenedor.innerHTML = '';
        personajesDisponibles.forEach(personaje => {
            const tarjeta = crearTarjetaPersonaje(personaje);
            contenedor.appendChild(tarjeta);
        });
    }, 500);
}

// ============================================
// EJEMPLO DE ESTRUCTURA DE RESPUESTA DE API
// ============================================

/*
// Formato esperado de la API:
[
    {
        "id": 1,
        "name": "Nyxarius",
        "image": "https://api.com/images/char1.png",
        "health": 100,
        "description": "Guerrero equilibrado"
    },
    {
        "id": 2,
        "name": "Lyra",
        "image": "https://api.com/images/char2.png",
        "health": 120,
        "description": "Alta resistencia"
    }
]
*/

// ============================================
// NOTAS IMPORTANTES
// ============================================

/*
1. CAMBIOS EN HTML:
   - Añadir escena-0 ANTES de escena-1
   - Cambiar "activa" de escena-1 a escena-0

2. CAMBIOS EN CSS:
   - Añadir todos los estilos para escena-0 y personajes

3. CAMBIOS EN main.js:
   - Importar personajesDisponibles (versión local)
   - Añadir variable personajeSeleccionado
   - Añadir funciones de selección de personajes
   - Modificar inicializarJuego()
   - Añadir event listener para botón confirmar

4. PARA VERSIÓN API:
   - Hacer función async
   - Añadir manejo de errores (try/catch)
   - Mapear datos si estructura es diferente
   - Considerar estado de carga y errores
   - Opcional: tener personajes de respaldo

5. CONSIDERACIONES:
   - Si la API requiere autenticación, añadir headers
   - Si tarda mucho, considerar spinner de carga
   - Validar que la API devuelva datos correctos
   - Cachear personajes si se recarga la página
*/