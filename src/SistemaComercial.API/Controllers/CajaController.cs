using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Application.Requests;
using System.Security.Claims;

namespace SistemaComercial.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class CajaController : ControllerBase
{
    private readonly ICajaService _service;

    public CajaController(ICajaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await _service.ObtenerTodasAsync());
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(short id)
    {
        var caja = await _service.ObtenerPorIdAsync(id);

        if (caja == null)
            return NotFound();

        return Ok(caja);
    }

    [HttpPost("abrir")]
    public async Task<IActionResult> Abrir(AbrirCajaRequest request)
    {
        short idUsuario = short.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        return Ok(await _service.AbrirCajaAsync(request, idUsuario));
    }

    [HttpPut("cerrar/{id}")]
    public async Task<IActionResult> Cerrar(short id, CerrarCajaRequest request)
    {
        return Ok(await _service.CerrarCajaAsync(id, request));
    }
}