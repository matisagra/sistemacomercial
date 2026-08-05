using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FormaPagoController : ControllerBase
{
    private readonly IFormaPagoService _service;

    public FormaPagoController(IFormaPagoService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<FormaPago>>> Get()
    {
        return Ok(await _service.ObtenerTodosAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<FormaPago>> Get(short id)
    {
        var formaPago = await _service.ObtenerPorIdAsync(id);

        if (formaPago == null)
            return NotFound();

        return Ok(formaPago);
    }

    [HttpPost]
    public async Task<ActionResult<FormaPago>> Post(FormaPago formaPago)
    {
        var nuevo = await _service.CrearAsync(formaPago);

        return CreatedAtAction(nameof(Get), new { id = nuevo.IdFormaPago }, nuevo);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<FormaPago>> Put(short id, FormaPago formaPago)
    {
        var actualizado = await _service.ActualizarAsync(id, formaPago);

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