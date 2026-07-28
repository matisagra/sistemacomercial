using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class CategoriaService : ICategoriaService
{
    private readonly AppDbContext _context;

    public CategoriaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Categoria>> ObtenerTodosAsync()
    {
        return await _context.Categorias.ToListAsync();
    }

    public async Task<Categoria?> ObtenerPorIdAsync(short id)
    {
        return await _context.Categorias.FindAsync(id);
    }

    public async Task<Categoria> CrearAsync(Categoria categoria)
    {
        _context.Categorias.Add(categoria);

        await _context.SaveChangesAsync();

        return categoria;
    }

    public async Task<Categoria?> ActualizarAsync(short id, Categoria categoria)
    {
        var existente = await _context.Categorias.FindAsync(id);

        if (existente == null)
            return null;

        existente.Nombre = categoria.Nombre;
        existente.Descripcion = categoria.Descripcion;
        existente.Estado = categoria.Estado;

        await _context.SaveChangesAsync();

        return existente;
    }

    public async Task<bool> EliminarAsync(short id)
    {
        var categoria = await _context.Categorias.FindAsync(id);

        if (categoria == null)
            return false;

        _context.Categorias.Remove(categoria);

        await _context.SaveChangesAsync();

        return true;
    }
}