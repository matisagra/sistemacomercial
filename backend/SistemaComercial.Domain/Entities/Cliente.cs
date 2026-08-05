using System.Text.Json.Serialization;

namespace SistemaComercial.Domain.Entities;

public class Cliente
{
    public short IdCliente { get; set; }
    public string Codigo { get; set; } = string.Empty;

    public string Nombre { get; set; } = string.Empty;
    public string? Apellido { get; set; } = string.Empty;

    public string Dni { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string? Observaciones { get; set; } = string.Empty;
    public bool Estado { get; set; } = true;

    // Navegación
    [JsonIgnore]
    public ICollection<Venta> Ventas { get; set; } = new List<Venta>();
}