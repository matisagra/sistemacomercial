using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IMarcaService
{
    Task<List<Marca>> ObtenerTodosAsync();

    Task<Marca?> ObtenerPorIdAsync(short id);

    Task<Marca> CrearAsync(Marca marca);

    Task<Marca?> ActualizarAsync(short id, Marca marca);

    Task<bool> EliminarAsync(short id);
}