import { Producto } from './Producto.js';

export const lista_Productos = [

    new Producto("Manzana", "img/manzana.png", 400, "Común", "consumible", 10),
    new Producto("Poción de vida", "img/poción.png", 1500, "Rara", "consumible", 30),

    new Producto("Armadura de Cuero", "img/armadura_cuero.png", 900, "Común", "armadura", 5),
    new Producto("Escudo de Acero", "img/escudo.png", 2500, "Rara", "armadura", 15),

    new Producto("Daga Oxidada", "img/daga.png", 500, "Común", "Arma", 8),
    new Producto("Hacha de Batalla", "img/hacha.png", 1800, "Rara", "Arma", 20),
    new Producto("Espada Mística", "img/espada.png", 5000, "Épica", "Arma", 45),
]

export const puntosBaseVictoria = 100;

export const descuentoFijo = 20;

export const rarezas = {
    comun: "Comun",
    rara: "Rara",
    epica: "Epica",
    legendaria: "legendaria"
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