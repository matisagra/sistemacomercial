using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface ICategoriaService
{
    Task<List<Categoria>> ObtenerTodosAsync();

    Task<Categoria?> ObtenerPorIdAsync(short id);

    Task<Categoria> CrearAsync(Categoria categoria);

    Task<Categoria?> ActualizarAsync(short id, Categoria categoria);

    Task<bool> EliminarAsync(short id);
}