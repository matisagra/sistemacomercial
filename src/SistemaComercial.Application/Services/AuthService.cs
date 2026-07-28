using BCrypt.Net;
using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;

    public AuthService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Usuario?> LoginAsync(string nombreUsuario, string contraseña)
{
    var usuario = await _context.Usuarios
        .Include(u => u.Rol)
        .FirstOrDefaultAsync(u => u.NombreUsuario == nombreUsuario);

    if (usuario == null)
    {
        return null;
    }

    if (!usuario.Estado)
    {
        return null;
    }

    if (usuario.BloqueadoHasta != null &&
        usuario.BloqueadoHasta > DateTime.UtcNow)
    {
        return null;
    }

    bool passwordCorrecta = BCrypt.Net.BCrypt.Verify(
        contraseña,
        usuario.ContraseñaHash);


    if (!passwordCorrecta)
    {
        usuario.IntentosFallidos++;

        if (usuario.IntentosFallidos >= 3)
        {
            usuario.BloqueadoHasta = DateTime.UtcNow.AddMinutes(15);
            usuario.IntentosFallidos = 0;
        }

        await _context.SaveChangesAsync();

        return null;
    }

    usuario.IntentosFallidos = 0;
    usuario.BloqueadoHasta = null;
    usuario.UltimoAcceso = DateTime.UtcNow;

    await _context.SaveChangesAsync();

    return usuario;
}
}