using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductoController : ControllerBase
{
    private readonly IProductoService _service;

    public ProductoController(IProductoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Producto>>> Get()
    {
        return Ok(await _service.ObtenerTodosAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Producto>> Get(int id)
    {
        var producto = await _service.ObtenerPorIdAsync(id);

        if (producto == null)
            return NotFound();

        return Ok(producto);
    }

    [HttpPost]
    public async Task<ActionResult<Producto>> Post(Producto producto)
    {
        var nuevo = await _service.CrearAsync(producto);

        return CreatedAtAction(nameof(Get), new { id = nuevo.IdProducto }, nuevo);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Put(int id, Producto producto)
    {
        bool actualizado = await _service.ActualizarAsync(id, producto);

        if (!actualizado)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        bool eliminado = await _service.EliminarAsync(id);

        if (!eliminado)
            return NotFound();

        return NoContent();
    }
}