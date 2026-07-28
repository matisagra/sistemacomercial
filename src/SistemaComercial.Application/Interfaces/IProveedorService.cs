using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IProveedorService
{
    Task<List<Proveedor>> ObtenerTodosAsync();

    Task<Proveedor?> ObtenerPorIdAsync(short id);

    Task<Proveedor> CrearAsync(Proveedor proveedor);

    Task<Proveedor?> ActualizarAsync(short id, Proveedor proveedor);

    Task<bool> EliminarAsync(short id);
}