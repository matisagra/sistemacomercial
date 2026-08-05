using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Application.Requests;
using System.Security.Claims;

namespace SistemaComercial.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class VentaController : ControllerBase
{
    private readonly IVentaService _service;

    public VentaController(IVentaService service)
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
        var venta = await _service.ObtenerPorIdAsync(id);

        if (venta == null)
            return NotFound();

        return Ok(venta);
    }

    [HttpPost]
    public async Task<IActionResult> Post(CrearVentaRequest request)
    {
        short idUsuario = short.Parse(
            User.FindFirst(ClaimTypes.NameIdentifier)!.Value);

        var venta = await _service.CrearAsync(request, idUsuario);

        return Ok(venta);
    }
}