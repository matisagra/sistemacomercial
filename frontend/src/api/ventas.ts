import { api } from "./axios";

export interface DetalleVentaInput {
    idProducto: number;
    cantidad: number;
}

export interface PagoInput {
    idFormaPago: number;
    importe: number;
}

export interface VentaInput {
    idCliente: number;
    idCaja: number;
    descuentoPorcentaje: number;
    detalles: DetalleVentaInput[];
    pagos: PagoInput[];
}

// Lo que confirmamos que devuelve el GET de lista. El POST puede traer
// más campos (detalle, descuento, total) pero como no lo confirmamos
// todavía, el front no depende de ellos: el total/subtotal se calculan
// en el cliente a partir del carrito antes de mandar la venta.
export interface Venta {
    idVenta: number;
    idCliente: number;
    idUsuario: number;
    idCaja: number;
    numeroVenta: string;
    fechaHora: string;
    subTotal: number;
    estado: string;
}

export async function crearVenta(venta: VentaInput) {

    const response = await api.post<Venta>(
        "/Venta",
        venta,
    );

    return response.data;

}

export async function obtenerVentas() {

    const response = await api.get<Venta[]>(
        "/Venta",
    );

    return response.data;

}