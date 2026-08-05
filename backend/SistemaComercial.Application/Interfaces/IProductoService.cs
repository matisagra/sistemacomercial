using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IProductoService
{
    Task<IEnumerable<Producto>> ObtenerTodosAsync();

    Task<Producto?> ObtenerPorIdAsync(int id);

    Task<Producto> CrearAsync(Producto producto);

    Task<bool> ActualizarAsync(int id, Producto producto);

    Task<bool> EliminarAsync(int id);
}