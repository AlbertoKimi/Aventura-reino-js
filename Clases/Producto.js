export class Producto {

    constructor(nombre, imagen, precio, rareza, tipo, bonus) {
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
    }

    formatearAtributos(precio) {
        return (precio / 100);
    }

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