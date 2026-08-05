using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Application.Interfaces;

public interface IAuthService
{
    Task<Usuario?> LoginAsync(string nombreUsuario, string contraseña);
}