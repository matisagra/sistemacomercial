using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Application.Models;

namespace SistemaComercial.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CompraController : ControllerBase
{
    private readonly ICompraService _service;

    public CompraController(ICompraService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await _service.ObtenerTodasAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(long id)
    {
        var compra = await _service.ObtenerPorIdAsync(id);

        if (compra == null)
            return NotFound();

        return Ok(compra);
    }

    [HttpPost]
    public async Task<IActionResult> Post(CrearCompraRequest request)
    {
       
        short idUsuario = short.Parse(User.FindFirst("id")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value!);
       
       if (string.IsNullOrEmpty(idUsuario.ToString()))
        return Unauthorized(new { message = "Token inválido o sin ID de usuario." });

        var compra = await _service.CrearAsync(request, idUsuario);

        return Ok(compra);
    }
}