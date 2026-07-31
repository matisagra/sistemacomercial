using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IAuditoriaService
{
    Task<IEnumerable<Auditoria>> ObtenerTodasAsync();

    Task<Auditoria?> ObtenerPorIdAsync(long id);

    Task<IEnumerable<Auditoria>> ObtenerPorUsuarioAsync(short idUsuario);

    Task<IEnumerable<Auditoria>> ObtenerPorTablaAsync(string tabla);
}