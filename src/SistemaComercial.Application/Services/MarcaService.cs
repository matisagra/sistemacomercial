using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class MarcaService : IMarcaService
{
    private readonly AppDbContext _context;

    public MarcaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Marca>> ObtenerTodosAsync()
    {
        return await _context.Marcas.ToListAsync();
    }

    public async Task<Marca?> ObtenerPorIdAsync(short id)
    {
        return await _context.Marcas.FindAsync(id);
    }

    public async Task<Marca> CrearAsync(Marca marca)
    {
        _context.Marcas.Add(marca);

        await _context.SaveChangesAsync();

        return marca;
    }

    public async Task<Marca?> ActualizarAsync(short id, Marca marca)
    {
        var existente = await _context.Marcas.FindAsync(id);

        if (existente == null)
            return null;

        existente.Nombre = marca.Nombre;
        existente.Descripcion = marca.Descripcion;
        existente.Estado = marca.Estado;

        await _context.SaveChangesAsync();

        return existente;
    }

    public async Task<bool> EliminarAsync(short id)
    {
        var marca = await _context.Marcas.FindAsync(id);

        if (marca == null)
            return false;

        _context.Marcas.Remove(marca);

        await _context.SaveChangesAsync();

        return true;
    }
}