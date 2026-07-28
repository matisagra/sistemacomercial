using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IClienteService
{
    Task<List<Cliente>> ObtenerTodosAsync();

    Task<Cliente?> ObtenerPorIdAsync(short id);

    Task<Cliente> CrearAsync(Cliente cliente);

    Task<Cliente?> ActualizarAsync(short id, Cliente cliente);

    Task<bool> EliminarAsync(short id);
}