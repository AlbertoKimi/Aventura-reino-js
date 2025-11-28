/**
 * Clase que representa un producto (Arma, Armadura o Consumible) en el juego.
 */

export class Producto {

    /**
     * @param {string} nombre Nombre del producto.
     * @param {string} imagen Ruta de la imagen del producto.
     * @param {number} precio Precio base del producto (multiplicado por 100).
     * @param {string} rareza Rareza del producto ("Comun", "Rara", "Epica", "Legendaria").
     * @param {string} tipo Tipo de producto ("Arma", "Armadura", "Consumible").
     * @param {number} bonus Bonus de estadística que otorga el producto.
     */

    constructor(nombre, imagen, precio, rareza, tipo, bonus) {
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
    }

    /**
     * Convierte el precio interno (multiplicado por 100) a un formato de visualización (Ryō).
     * @param {number} precio El precio a formatear.
     * @returns {number} El precio formateado dividido por 100.
     */

    formatearAtributos(precio) {
        return (precio / 100);
    }

    /**
     * Calcula el precio final del producto tras aplicar un descuento.
     * El descuento se aplica si la clave (rareza o tipo) y su valor coinciden.
     * @param {string} clave Atributo del producto para comprobar el descuento ("rareza" o "tipo").
     * @param {string} valor Valor del atributo a comprobar.
     * @param {number} descuento Porcentaje de descuento a aplicar (ej. 20 para 20%).
     * @returns {number} El precio final redondeado.
     */

    aplicarDescuento(clave, valor, descuento) {

        let precioConDescuento = this.precio;
        if (clave === "rareza" && this.rareza == valor) {
            precioConDescuento = this.precio * (1 - descuento / 100);
        } else if (clave === "tipo" && this.tipo == valor) {
            precioConDescuento = this.precio * (1 - descuento / 100);
        }

        return Math.round(precioConDescuento);

    }
}