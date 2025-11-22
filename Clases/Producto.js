export class Producto {

    constructor(nombre, imagen, precio, rareza, tipo, bonus) { //Tenemos que hacer que cada producto herede de producto, es decir
        //espada heredda de producto y hace lo que sea,poción de producto,etc
        this.nombre = nombre;
        this.imagen = imagen;
        this.precio = precio;
        this.rareza = rareza;
        this.tipo = tipo;
        this.bonus = bonus;
    }

    formatearAtributos() {
        const precioFormateado = (this.precio / 100)
        return this.precio = precioFormateado;
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