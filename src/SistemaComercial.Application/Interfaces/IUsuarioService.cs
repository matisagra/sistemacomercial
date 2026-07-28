using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IUsuarioService
{
    // falta login
    Task<List<Usuario>> ObtenerTodosAsync();

    Task<Usuario?> ObtenerPorIdAsync(short id);

    Task<Usuario> CrearAsync(Usuario usuario);

    Task<Usuario?> ActualizarAsync(short id, Usuario usuario);

    Task<bool> EliminarAsync(short id);
}