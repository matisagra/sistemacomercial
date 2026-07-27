using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class RolService : IRolService
{
    private readonly AppDbContext _context;

    public RolService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Rol>> ObtenerTodosAsync()
    {
        return await _context.Roles.ToListAsync();
    }

    public async Task<Rol?> ObtenerPorIdAsync(short id)
    {
        return await _context.Roles.FindAsync(id);
    }

    public async Task<Rol> CrearAsync(Rol rol)
    {
        _context.Roles.Add(rol);

        await _context.SaveChangesAsync();

        return rol;
    }

    public async Task<Rol?> ActualizarAsync(short id, Rol rol)
    {
        var existente = await _context.Roles.FindAsync(id);

        if (existente == null)
            return null;

        existente.Nombre = rol.Nombre;
        existente.Descripcion = rol.Descripcion;
        existente.Estado = rol.Estado;

        await _context.SaveChangesAsync();

        return existente;
    }

    public async Task<bool> EliminarAsync(short id)
    {
        var rol = await _context.Roles.FindAsync(id);

        if (rol == null)
            return false;

        _context.Roles.Remove(rol);

        await _context.SaveChangesAsync();

        return true;
    }
}