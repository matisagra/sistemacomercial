using SistemaComercial.Application.Requests;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface ICajaService
{
    Task<IEnumerable<Caja>> ObtenerTodasAsync();

    Task<Caja?> ObtenerPorIdAsync(short id);

    Task<Caja> AbrirCajaAsync(AbrirCajaRequest request, short idUsuario);

    Task<Caja> CerrarCajaAsync(short idCaja, CerrarCajaRequest request);

    Task<Caja?> ObtenerCajaAbiertaAsync(short idUsuario);
}