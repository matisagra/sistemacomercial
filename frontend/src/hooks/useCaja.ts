import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { obtenerCajas, abrirCaja, cerrarCaja } from "@/api/caja";

// Asume un solo turno de caja activo por vez en todo el sistema
// (kiosco de un solo puesto). Si en algún momento hay varias cajas
// físicas en simultáneo, esto hay que filtrarlo también por idUsuario.
export function useCaja() {
    const queryClient = useQueryClient();

    const query = useQuery({
        queryKey: ["cajas"],
        queryFn: obtenerCajas,
    });

    const cajaAbierta = query.data?.find((c) => c.estado === "Abierta") ?? null;

    const invalidar = () =>
        queryClient.invalidateQueries({ queryKey: ["cajas"] });

    const abrir = useMutation({
        mutationFn: abrirCaja,
        onSuccess: invalidar,
    });

    const cerrar = useMutation({
        mutationFn: cerrarCaja,
        onSuccess: invalidar,
    });

    return {
        ...query,
        cajaAbierta,
        abrirCaja: abrir.mutateAsync,
        cerrarCaja: cerrar.mutateAsync,
        abriendo: abrir.isPending,
        cerrando: cerrar.isPending,
    };
}