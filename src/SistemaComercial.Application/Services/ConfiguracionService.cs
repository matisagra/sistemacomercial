using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class ConfiguracionService : IConfiguracionService
{
    private readonly AppDbContext _context;

    public ConfiguracionService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Configuracion?> ObtenerAsync()
    {
        return await _context.Configuraciones.FirstOrDefaultAsync();
    }

    public async Task<Configuracion> ActualizarAsync(Configuracion configuracion)
    {
        Configuracion? actual =
            await _context.Configuraciones.FirstOrDefaultAsync(x =>
                x.IdConfiguracion == configuracion.IdConfiguracion);

        if (actual == null)
            throw new Exception("La configuración no existe.");

        actual.NombreNegocio = configuracion.NombreNegocio;
        actual.RazonSocial = configuracion.RazonSocial;
        actual.Cuit = configuracion.Cuit;
        actual.Direccion = configuracion.Direccion;
        actual.Telefono = configuracion.Telefono;
        actual.Email = configuracion.Email;
        actual.Logo = configuracion.Logo;
        actual.Moneda = configuracion.Moneda;
        actual.PermitirStockNegativo = configuracion.PermitirStockNegativo;
        actual.SugerirPrecioVenta = configuracion.SugerirPrecioVenta;
        actual.StockMinimoDefecto = configuracion.StockMinimoDefecto;
        actual.IntentosLogin = configuracion.IntentosLogin;

        await _context.SaveChangesAsync();

        return actual;
    }
}