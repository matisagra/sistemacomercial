using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IConfiguracionService
{
    Task<Configuracion?> ObtenerAsync();

    Task<Configuracion> ActualizarAsync(Configuracion configuracion);
}