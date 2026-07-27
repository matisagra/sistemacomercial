using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IRolService
{
    Task<List<Rol>> ObtenerTodosAsync();

    Task<Rol?> ObtenerPorIdAsync(short id);

    Task<Rol> CrearAsync(Rol rol);

    Task<Rol?> ActualizarAsync(short id, Rol rol);

    Task<bool> EliminarAsync(short id);
}