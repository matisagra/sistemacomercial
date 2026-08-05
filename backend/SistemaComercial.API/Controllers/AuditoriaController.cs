using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;

namespace SistemaComercial.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuditoriaController : ControllerBase
{
    private readonly IAuditoriaService _service;

    public AuditoriaController(IAuditoriaService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await _service.ObtenerTodasAsync());
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> Get(long id)
    {
        var auditoria = await _service.ObtenerPorIdAsync(id);

        if (auditoria == null)
            return NotFound();

        return Ok(auditoria);
    }

    [HttpGet("usuario/{idUsuario}")]
    public async Task<IActionResult> GetPorUsuario(short idUsuario)
    {
        return Ok(await _service.ObtenerPorUsuarioAsync(idUsuario));
    }

    [HttpGet("tabla/{tabla}")]
    public async Task<IActionResult> GetPorTabla(string tabla)
    {
        return Ok(await _service.ObtenerPorTablaAsync(tabla));
    }
}