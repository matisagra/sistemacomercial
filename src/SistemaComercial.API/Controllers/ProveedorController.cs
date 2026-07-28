using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProveedorController : ControllerBase
{
    private readonly IProveedorService _service;

    public ProveedorController(IProveedorService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<Proveedor>>> Get()
    {
        return Ok(await _service.ObtenerTodosAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Proveedor>> Get(short id)
    {
        var proveedor = await _service.ObtenerPorIdAsync(id);

        if (proveedor == null)
            return NotFound();

        return Ok(proveedor);
    }

    [HttpPost]
    public async Task<ActionResult<Proveedor>> Post(Proveedor proveedor)
    {
        var nuevo = await _service.CrearAsync(proveedor);

        return CreatedAtAction(nameof(Get), new { id = nuevo.IdProveedor }, nuevo);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Proveedor>> Put(short id, Proveedor proveedor)
    {
        var actualizado = await _service.ActualizarAsync(id, proveedor);

        if (actualizado == null)
            return NotFound();

        return Ok(actualizado);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(short id)
    {
        var eliminado = await _service.EliminarAsync(id);

        if (!eliminado)
            return NotFound();

        return NoContent();
    }
}
