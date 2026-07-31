using Microsoft.AspNetCore.Mvc;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ConfiguracionController : ControllerBase
{
    private readonly IConfiguracionService _service;

    public ConfiguracionController(IConfiguracionService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        return Ok(await _service.ObtenerAsync());
    }

    [HttpPut]
    public async Task<IActionResult> Put(Configuracion configuracion)
    {
        return Ok(await _service.ActualizarAsync(configuracion));
    }
}