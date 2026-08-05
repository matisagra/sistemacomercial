using SistemaComercial.Application.Requests;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IVentaService
{
    Task<IEnumerable<Venta>> ObtenerTodasAsync();

    Task<Venta?> ObtenerPorIdAsync(long id);

    Task<Venta> CrearAsync(CrearVentaRequest request, short idUsuario);
}