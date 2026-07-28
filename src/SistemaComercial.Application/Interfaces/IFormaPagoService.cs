using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IFormaPagoService
{
    Task<List<FormaPago>> ObtenerTodosAsync();

    Task<FormaPago?> ObtenerPorIdAsync(short id);

    Task<FormaPago> CrearAsync(FormaPago formaPago);

    Task<FormaPago?> ActualizarAsync(short id, FormaPago formaPago);

    Task<bool> EliminarAsync(short id);
}