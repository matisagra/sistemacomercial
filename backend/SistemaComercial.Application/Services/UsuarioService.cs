using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;
using BCrypt.Net;

namespace SistemaComercial.Application.Services;

public class UsuarioService : IUsuarioService
{
    private readonly AppDbContext _context;

    public UsuarioService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Usuario>> ObtenerTodosAsync()
    {
        return await _context.Usuarios.ToListAsync();
    }

    public async Task<Usuario?> ObtenerPorIdAsync(short id)
    {
        return await _context.Usuarios.FindAsync(id);
    }

    public async Task<Usuario> CrearAsync(Usuario usuario)
    {
        usuario.ContraseñaHash = BCrypt.Net.BCrypt.HashPassword(usuario.ContraseñaHash);
        
        _context.Usuarios.Add(usuario);

        await _context.SaveChangesAsync();

        return usuario;
    }

    public async Task<Usuario?> ActualizarAsync(short id, Usuario usuario)
    {
        var existente = await _context.Usuarios.FindAsync(id);

        if (existente == null)
            return null;

        existente.Nombre = usuario.Nombre;
        existente.Apellido = usuario.Apellido;
        existente.Estado = usuario.Estado;
        existente.NombreUsuario = usuario.NombreUsuario;
        existente.ContraseñaHash = BCrypt.Net.BCrypt.HashPassword(usuario.ContraseñaHash);


        await _context.SaveChangesAsync();

        return existente;
    }

    public async Task<bool> EliminarAsync(short id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);

        if (usuario == null)
            return false;

        _context.Usuarios.Remove(usuario);

        await _context.SaveChangesAsync();

        return true;
    }
}