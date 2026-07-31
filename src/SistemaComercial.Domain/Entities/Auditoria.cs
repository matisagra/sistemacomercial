using System.Text.Json.Serialization;

namespace SistemaComercial.Domain.Entities;

public class Auditoria
{
    public long IdAuditoria { get; set; }

    public short? IdUsuario { get; set; }

    [JsonIgnore]
    public Usuario? Usuario { get; set; }    
    public DateTime FechaHora { get; set; } = DateTime.Now;

    public string TablaAfectada { get; set; } = string.Empty;

    public string Operacion { get; set; } = string.Empty;

    public string? DatosAnteriores { get; set; }

    public string? DatosNuevos { get; set; }
    public string? Ip { get; set; }
    public string? Equipo { get; set; }
}