using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IMovimientoCajaService
{
    Task<IEnumerable<MovimientoCaja>> ObtenerTodosAsync();

    Task<IEnumerable<MovimientoCaja>> ObtenerPorCajaAsync(short idCaja);

    Task RegistrarMovimientoAsync(
        short idCaja,
        long? idVenta,
        string tipoMovimiento,
        string? concepto,
        decimal importe,
        string? observaciones);
}