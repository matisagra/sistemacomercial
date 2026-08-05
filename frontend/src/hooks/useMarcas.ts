import { useQuery } from "@tanstack/react-query";
import { obtenerMarcas } from "@/api/marcas";

export function useMarcas() {
    return useQuery({
        queryKey: ["marcas"],
        queryFn: obtenerMarcas,
    });
}