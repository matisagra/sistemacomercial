using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class MovimientoStockService : IMovimientoStockService
{
    private readonly AppDbContext _context;

    public MovimientoStockService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MovimientoStock>> ObtenerTodosAsync()
    {
        return await _context.MovimientosStock
            .Include(x => x.Producto)
            .Include(x => x.Usuario)
            .Include(x => x.Compra)
            .Include(x => x.Venta)
            .OrderByDescending(x => x.FechaHora)
            .ToListAsync();
    }

    public async Task<IEnumerable<MovimientoStock>> ObtenerPorProductoAsync(int idProducto)
    {
        return await _context.MovimientosStock
            .Where(x => x.IdProducto == idProducto)
            .OrderByDescending(x => x.FechaHora)
            .ToListAsync();
    }

    public async Task RegistrarMovimientoAsync(
        int idProducto,
        short idUsuario,
        long? idCompra,
        long? idVenta,
        string tipoMovimiento,
        int cantidad,
        int stockAnterior,
        int stockNuevo,
        string? motivo)
    {
        MovimientoStock movimiento = new()
        {
            IdProducto = idProducto,
            IdUsuario = idUsuario,
            IdCompra = idCompra,
            IdVenta = idVenta,
            FechaHora = DateTime.UtcNow,
            TipoMovimiento = tipoMovimiento,
            Cantidad = cantidad,
            StockAnterior = stockAnterior,
            StockNuevo = stockNuevo,
            Motivo = motivo
        };

        _context.MovimientosStock.Add(movimiento);

        await _context.SaveChangesAsync();
    }
}