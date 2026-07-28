using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using Microsoft.AspNetCore.Authorization;

namespace SistemaComercial.API.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsuarioController : ControllerBase
{
    private readonly IUsuarioService _service;

    public UsuarioController(IUsuarioService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<ActionResult<List<Usuario>>> Get()
    {
        return Ok(await _service.ObtenerTodosAsync());
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Usuario>> Get(short id)
    {
        var usuario = await _service.ObtenerPorIdAsync(id);

        if (usuario == null)
            return NotFound();

        return Ok(usuario);
    }

    [HttpPost]
    public async Task<ActionResult<Usuario>> Post(Usuario usuario)
    {
        var nuevo = await _service.CrearAsync(usuario);

        return CreatedAtAction(nameof(Get), new { id = nuevo.IdUsuario }, nuevo);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Usuario>> Put(short id, Usuario usuario)
    {
        var actualizado = await _service.ActualizarAsync(id, usuario);

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