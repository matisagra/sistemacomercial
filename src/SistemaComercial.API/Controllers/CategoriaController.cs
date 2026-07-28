using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CategoriaController : ControllerBase
{
    private readonly ICategoriaService _service;

    public CategoriaController(ICategoriaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<Categoria>>> Get()
    {
        return Ok(await _service.ObtenerTodosAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Categoria>> Get(short id)
    {
        var categoria = await _service.ObtenerPorIdAsync(id);

        if (categoria == null)
            return NotFound();

        return Ok(categoria);
    }

    [HttpPost]
    public async Task<ActionResult<Categoria>> Post(Categoria categoria)
    {
        var nuevo = await _service.CrearAsync(categoria);

        return CreatedAtAction(nameof(Get), new { id = nuevo.IdCategoria }, nuevo);
    }
  

    [HttpPut("{id}")]
    public async Task<ActionResult<Categoria>> Put(short id, Categoria categoria)
    {
        var actualizado = await _service.ActualizarAsync(id, categoria);

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