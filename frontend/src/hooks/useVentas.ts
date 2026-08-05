import { useQuery } from "@tanstack/react-query";
import { obtenerVentas } from "@/api/ventas";

export function useVentas() {
    return useQuery({
        queryKey: ["ventas"],
        queryFn: obtenerVentas,
    });
}