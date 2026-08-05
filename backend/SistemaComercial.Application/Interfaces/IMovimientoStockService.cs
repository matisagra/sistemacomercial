using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IMovimientoStockService
{
    Task<IEnumerable<MovimientoStock>> ObtenerTodosAsync();

    Task<IEnumerable<MovimientoStock>> ObtenerPorProductoAsync(int idProducto);

    Task RegistrarMovimientoAsync(
        int idProducto,
        short idUsuario,
        long? idCompra,
        long? idVenta,
        string tipoMovimiento,
        int cantidad,
        int stockAnterior,
        int stockNuevo,
        string? motivo);
}