using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MarcaController : ControllerBase
{
    private readonly IMarcaService _service;

    public MarcaController(IMarcaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<Marca>>> Get()
    {
        return Ok(await _service.ObtenerTodosAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Marca>> Get(short id)
    {
        var marca = await _service.ObtenerPorIdAsync(id);

        if (marca == null)
            return NotFound();

        return Ok(marca);
    }

    [HttpPost]
    public async Task<ActionResult<Marca>> Post(Marca marca)
    {
        var nuevo = await _service.CrearAsync(marca);

        return CreatedAtAction(nameof(Get), new { id = nuevo.IdMarca }, nuevo);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Marca>> Put(short id, Marca marca)
    {
        var actualizado = await _service.ActualizarAsync(id, marca);

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
