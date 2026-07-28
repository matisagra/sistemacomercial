using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Application.Requests;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class CajaService : ICajaService
{
    private readonly AppDbContext _context;
    private readonly IMovimientoCajaService _movimientoCajaService;

    public CajaService(AppDbContext context, IMovimientoCajaService movimientoCajaService)
    {
        _context = context;
        _movimientoCajaService = movimientoCajaService;
    }

    public async Task<IEnumerable<Caja>> ObtenerTodasAsync()
    {
        return await _context.Cajas
            .Include(c => c.Usuario)
            .ToListAsync();
    }

    public async Task<Caja?> ObtenerPorIdAsync(short id)
    {
        return await _context.Cajas
            .Include(c => c.Usuario)
            .FirstOrDefaultAsync(c => c.IdCaja == id);
    }

    public async Task<Caja?> ObtenerCajaAbiertaAsync(short idUsuario)
    {
        return await _context.Cajas
            .FirstOrDefaultAsync(c =>
                c.IdUsuario == idUsuario &&
                c.Estado == "Abierta");
    }

    public async Task<Caja> AbrirCajaAsync(AbrirCajaRequest request, short idUsuario)
    {
        var abierta = await ObtenerCajaAbiertaAsync(idUsuario);

        if (abierta != null)
            throw new Exception("El usuario ya posee una caja abierta.");

        Caja caja = new()
        {
            NumeroCaja = "",
            IdUsuario = idUsuario,
            FechaApertura = DateTime.UtcNow,
            SaldoInicial = request.SaldoInicial,
            SaldoFinal = 0,
            SaldoEsperado = request.SaldoInicial,
            Diferencia = 0,
            Observaciones = request.Observaciones,
            Estado = "Abierta"
        };

        _context.Cajas.Add(caja);

        await _context.SaveChangesAsync();

        caja.NumeroCaja = $"CAJ-{DateTime.Now:yyyyMMdd}-{caja.IdCaja:D4}";

        await _context.SaveChangesAsync();

        await _movimientoCajaService.RegistrarMovimientoAsync(
        caja.IdCaja,
        null,
        "Apertura",
        "Apertura de caja",
        caja.SaldoInicial,
        caja.Observaciones);

        return caja;
    }

    public async Task<Caja> CerrarCajaAsync(short idCaja, CerrarCajaRequest request)
    {
        Caja? caja = await _context.Cajas.FindAsync(idCaja);

        if (caja == null)
            throw new Exception("Caja inexistente.");

        if (caja.Estado != "Abierta")
            throw new Exception("La caja ya está cerrada.");

        caja.FechaCierre = DateTime.UtcNow;
        caja.SaldoFinal = request.SaldoFinal;

        caja.Diferencia =
            caja.SaldoFinal - caja.SaldoEsperado;

        caja.Observaciones = request.Observaciones;

        caja.Estado = "Cerrada";

        await _context.SaveChangesAsync();

        await _movimientoCajaService.RegistrarMovimientoAsync(
        caja.IdCaja,
        null,
        "Cierre",
        "Cierre de caja",
        caja.SaldoFinal ?? 0,
        caja.Observaciones);

        return caja;
    }
}