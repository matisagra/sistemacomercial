import { useQuery } from "@tanstack/react-query";
import { obtenerConfiguracion } from "@/api/configuracion";

export function useConfiguracion() {
    return useQuery({
        queryKey: ["configuracion"],
        queryFn: obtenerConfiguracion,
    });
}