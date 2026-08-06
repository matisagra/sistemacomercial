import { useQuery } from "@tanstack/react-query";
import { obtenerFormasPago } from "@/api/formaPago";

export function useFormasPago() {
    return useQuery({
        queryKey: ["formasPago"],
        queryFn: obtenerFormasPago,
    });
}