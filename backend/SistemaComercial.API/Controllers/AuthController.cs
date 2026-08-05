using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Application.Models;
using SistemaComercial.Application.Security;

namespace SistemaComercial.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly JwtService _jwtService;

    public AuthController(IAuthService authService, JwtService jwtService)
    {
        _authService = authService;
        _jwtService = jwtService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var usuario = await _authService.LoginAsync(
            request.NombreUsuario,
            request.Contraseña);

        if (usuario == null)
            return Unauthorized();

        var token = _jwtService.GenerarToken(usuario);

        return Ok(new
        {
            token,
            usuario = usuario.NombreUsuario,
            nombre = usuario.Nombre + " " + usuario.Apellido,
            rol = usuario.Rol?.Nombre ?? string.Empty
        });
    }



}