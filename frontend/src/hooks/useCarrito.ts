import { useCallback, useMemo, useState } from "react";
import type { Producto } from "@/api/productos";

export interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

export function useCarrito() {
    const [items, setItems] = useState<ItemCarrito[]>([]);

    // Si el producto ya está en el carrito, suma cantidad en vez de
    // duplicar la fila (así funciona un lector de código de barras real).
    const agregarProducto = useCallback((producto: Producto, cantidad = 1) => {
        setItems((prev) => {
            const existente = prev.find(
                (i) => i.producto.idProducto === producto.idProducto
            );

            if (existente) {
                return prev.map((i) =>
                    i.producto.idProducto === producto.idProducto
                        ? { ...i, cantidad: i.cantidad + cantidad }
                        : i
                );
            }

            return [...prev, { producto, cantidad }];
        });
    }, []);

    const incrementar = useCallback((idProducto: number) => {
        setItems((prev) =>
            prev.map((i) =>
                i.producto.idProducto === idProducto
                    ? { ...i, cantidad: i.cantidad + 1 }
                    : i
            )
        );
    }, []);

    // Si llega a 0, se saca del carrito directamente
    const decrementar = useCallback((idProducto: number) => {
        setItems((prev) =>
            prev
                .map((i) =>
                    i.producto.idProducto === idProducto
                        ? { ...i, cantidad: i.cantidad - 1 }
                        : i
                )
                .filter((i) => i.cantidad > 0)
        );
    }, []);

    const eliminar = useCallback((idProducto: number) => {
        setItems((prev) => prev.filter((i) => i.producto.idProducto !== idProducto));
    }, []);

    const vaciar = useCallback(() => setItems([]), []);

    const cantidadItems = useMemo(
        () => items.reduce((acc, i) => acc + i.cantidad, 0),
        [items]
    );

    const subtotal = useMemo(
        () => items.reduce((acc, i) => acc + i.cantidad * i.producto.precioVenta, 0),
        [items]
    );

    return {
        items,
        cantidadItems,
        subtotal,
        total: subtotal, // acá se sumarían descuentos/recargos a futuro
        agregarProducto,
        incrementar,
        decrementar,
        eliminar,
        vaciar,
    };
}