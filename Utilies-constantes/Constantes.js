import { Producto } from '../Clases/Producto.js';

export const lista_Productos = [

    new Producto("Poción Rebitalitante", "Imagenes/Consumible/Pocion.png", 400, "Comun", "Consumible", 8),
    new Producto("Bebida Energética", "Imagenes/Consumible/Lata.png", 1000, "Rara", "Consumible", 15),
    new Producto("Fruta Meluce", "Imagenes/Consumible/Fruta.png", 1200, "Rara", "Consumible", 22),
    new Producto("Fideos", "Imagenes/Consumible/Fideos.png", 2400, "Epica", "Consumible", 38),
    new Producto("Jeringa de poder", "Imagenes/Consumible/Inyeccion.png", 3500, "Epica", "Consumible", 45),
    new Producto("Frasco inmortal", "Imagenes/Consumible/Frasco.png", 5400, "Legendaria", "Consumible", 60),

    new Producto("Escudo", "Imagenes/Defensa/Escudo.png", 300, "Comun", "Armadura", 5),
    new Producto("Guantes Electropulso", "Imagenes/Defensa/Guantes-Pulso.png", 900, "Comun", "Armadura", 12),
    new Producto("Casco de Marte", "Imagenes/Defensa/Casco.png", 1600, "Rara", "Armadura", 24),
    new Producto("Capa del erudito", "Imagenes/Defensa/Capa.png", 2500, "Epica", "Armadura", 30),
    new Producto("Guantes del Lobo", "Imagenes/Defensa/Guantes-lobo.png", 3900, "Epica", "Armadura", 40),
    new Producto("Amuleto del todopoderoso", "Imagenes/Defensa/Amuleto.png", 4900, "Legendaria", "Armadura", 50),
    new Producto("Cinturón de Wukong", "Imagenes/Defensa/Cinturon.png", 5800, "Legendaria", "Armadura", 55),

    new Producto("Kunai", "Imagenes/Ataque/Kunai.png", 500, "Comun", "Arma", 9),
    new Producto("Escopeta mortal", "Imagenes/Ataque/Escopeta.png", 1300, "Rara", "Arma", 22),
    new Producto("Metralleta vampírica", "Imagenes/Ataque/Metralladora.png", 2700, "Epica", "Arma", 30),
    new Producto("Guantelete del Sol", "Imagenes/Ataque/Guantelete.png", 4500, "Epica", "Arma", 40),
    new Producto("Espada Demoniáca", "Imagenes/Ataque/Espada.png", 5000, "Legendaria", "Arma", 50),
    new Producto("Arma del caos", "Imagenes/Ataque/Espada-Poder.png", 6000, "Legendaria", "Arma", 60),
]

export const puntosBaseVictoria = 100;

export const descuentoFijo = 20;

export const rarezas = {
    comun: "Comun",
    rara: "Rara",
    epica: "Epica",
    legendaria: "Legendaria"
}

export const opcionesRarezas = [
    rarezas.comun,
    rarezas.rara,
    rarezas.epica,
    rarezas.legendaria
]

export const tipos = {
    arma: "Arma",
    armadura: "Armadura",
    vida: "Consumible"
}

export const opcionesTipos = [
    tipos.arma,
    tipos.armadura,
    tipos.vida
]

export const opcionesDescuento = ["rareza", "tipo"]