using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class MovimientoCajaService : IMovimientoCajaService
{
    private readonly AppDbContext _context;

    public MovimientoCajaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<MovimientoCaja>> ObtenerTodosAsync()
    {
        return await _context.MovimientosCaja
            .Include(x => x.Caja)
            .Include(x => x.Venta)
            .OrderByDescending(x => x.FechaHora)
            .ToListAsync();
    }

    public async Task<IEnumerable<MovimientoCaja>> ObtenerPorCajaAsync(short idCaja)
    {
        return await _context.MovimientosCaja
            .Include(x => x.Venta)
            .Where(x => x.IdCaja == idCaja)
            .OrderByDescending(x => x.FechaHora)
            .ToListAsync();
    }

    public async Task RegistrarMovimientoAsync(
        short idCaja,
        long? idVenta,
        string tipoMovimiento,
        string? concepto,
        decimal importe,
        string? observaciones)
    {
        MovimientoCaja movimiento = new()
        {
            IdCaja = idCaja,
            IdVenta = idVenta,
            FechaHora = DateTime.UtcNow,
            TipoMovimiento = tipoMovimiento,
            Concepto = concepto,
            Importe = importe,
            Observaciones = observaciones
        };

        _context.MovimientosCaja.Add(movimiento);

        await _context.SaveChangesAsync();
    }
}