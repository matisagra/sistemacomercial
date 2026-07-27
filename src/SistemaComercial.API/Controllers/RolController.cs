using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolController : ControllerBase
{
    private readonly IRolService _service;

    public RolController(IRolService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<Rol>>> Get()
    {
        return Ok(await _service.ObtenerTodosAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Rol>> Get(short id)
    {
        var rol = await _service.ObtenerPorIdAsync(id);

        if (rol == null)
            return NotFound();

        return Ok(rol);
    }

    [HttpPost]
    public async Task<ActionResult<Rol>> Post(Rol rol)
    {
        var nuevo = await _service.CrearAsync(rol);

        return CreatedAtAction(nameof(Get), new { id = nuevo.IdRol }, nuevo);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Rol>> Put(short id, Rol rol)
    {
        var actualizado = await _service.ActualizarAsync(id, rol);

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