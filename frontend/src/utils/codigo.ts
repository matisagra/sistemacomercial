interface ConCodigo {
    codigo: string;
}

export function generarSiguienteCodigo(
    items: ConCodigo[],
    prefijoPorDefecto: string,
): string {
    const coincidencias = items
        .map((item) => item.codigo.match(/^([A-Za-z]*)(\d+)$/))
        .filter((m): m is RegExpMatchArray => m !== null)
        .map((m) => ({
            prefijo: m[1],
            numero: Number(m[2]),
            digitos: m[2].length,
        }));

    if (coincidencias.length === 0) {
        return `${prefijoPorDefecto}0001`;
    }

    const maximo = coincidencias.reduce((a, b) =>
        b.numero > a.numero ? b : a,
    );

    const siguiente = maximo.numero + 1;

    return `${maximo.prefijo}${String(siguiente).padStart(maximo.digitos, "0")}`;
}