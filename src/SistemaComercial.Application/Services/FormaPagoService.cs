using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class FormaPagoService : IFormaPagoService
{
    private readonly AppDbContext _context;

    public FormaPagoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<FormaPago>> ObtenerTodosAsync()
    {
        return await _context.FormasPago.ToListAsync();
    }

    public async Task<FormaPago?> ObtenerPorIdAsync(short id)
    {
        return await _context.FormasPago.FindAsync(id);
    }

    public async Task<FormaPago> CrearAsync(FormaPago formaPago)
    {
        _context.FormasPago.Add(formaPago);

        await _context.SaveChangesAsync();

        return formaPago;
    }

    public async Task<FormaPago?> ActualizarAsync(short id, FormaPago formaPago)
    {
        var existente = await _context.FormasPago.FindAsync(id);

        if (existente == null)
            return null;

        existente.Nombre = formaPago.Nombre;
        existente.Estado = formaPago.Estado;

        await _context.SaveChangesAsync();

        return existente;
    }


    public async Task<bool> EliminarAsync(short id)
    {
        var formaPago = await _context.FormasPago.FindAsync(id);

        if (formaPago == null)
            return false;

        _context.FormasPago.Remove(formaPago);

        await _context.SaveChangesAsync();

        return true;
    }
}