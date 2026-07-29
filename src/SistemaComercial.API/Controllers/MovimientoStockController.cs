using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;

namespace SistemaComercial.API.Controllers;

// [Authorize]
[ApiController]
[Route("api/[controller]")]
public class MovimientoStockController : ControllerBase
{
    private readonly IMovimientoStockService _service;

    public MovimientoStockController(IMovimientoStockService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await _service.ObtenerTodosAsync());
    }

    [HttpGet("producto/{id}")]
    public async Task<IActionResult> GetProducto(short id)
    {
        return Ok(await _service.ObtenerPorProductoAsync(id));
    }
}