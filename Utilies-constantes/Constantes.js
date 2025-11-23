import { Producto } from '../Clases/Producto.js';

export const lista_Productos = [

    new Producto("Manzana", "Imagenes/apple.png", 400, "Comun", "Consumible", 10),
    new Producto("Poción de vida", "Imagenes/hp.png", 1500, "Rara", "Consumible", 30),
    new Producto("Armadura de Cuero", "Imagenes/armor.png", 900, "Comun", "Armadura", 5),
    new Producto("Casco acero", "Imagenes/helmets.png", 2500, "Rara", "Armadura", 15),
    new Producto("Libro Mágico", "Imagenes/book.png", 500, "Comun", "Arma", 8),
    new Producto("Hacha de Batalla", "Imagenes/axe.png", 1800, "Rara", "Arma", 20),
    new Producto("ArcoMístico", "Imagenes/b_t_01.png", 5000, "Epica", "Arma", 45),
]

export const puntosBaseVictoria = 100;

export const descuentoFijo = 20;

export const rarezas = {
    comun: "Comun",
    rara: "Rara",
    epica: "Epica",
    legendaria: "Legendaria"
}

export const opcionesRarezas =[
    rarezas.comun,
    rarezas.rara,
    rarezas.epica,
    rarezas.legendaria
]

export const tipos ={
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