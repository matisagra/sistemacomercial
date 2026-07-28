using SistemaComercial.Application.Models;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface ICompraService
{
    Task<IEnumerable<Compra>> ObtenerTodasAsync();

    Task<Compra?> ObtenerPorIdAsync(long id);

    Task<Compra> CrearAsync(CrearCompraRequest request, short idUsuario);
}