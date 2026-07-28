using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;

namespace SistemaComercial.API.Controllers;

// [Authorize]
[ApiController]
[Route("api/[controller]")]
public class MovimientoCajaController : ControllerBase
{
    private readonly IMovimientoCajaService _service;

    public MovimientoCajaController(IMovimientoCajaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await _service.ObtenerTodosAsync());
    }

    [HttpGet("caja/{idCaja}")]
    public async Task<IActionResult> GetCaja(short idCaja)
    {
        return Ok(await _service.ObtenerPorCajaAsync(idCaja));
    }
}