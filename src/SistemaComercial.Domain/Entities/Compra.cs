using System.Text.Json.Serialization;
using SistemaComercial.Domain.Entities;
public class Compra
{
    public long IdCompra { get; set; }

    public short IdProveedor { get; set; }

    [JsonIgnore]
    public Proveedor? Proveedor { get; set; }

    public short IdUsuario { get; set; }

    [JsonIgnore]
    public Usuario? Usuario { get; set; }

    public string? NumeroCompra { get; set; }

    public DateTime FechaHora { get; set; }

    public string? Observaciones { get; set; }

    public decimal Total { get; set; }

    public string Estado { get; set; } = string.Empty;

    [JsonIgnore]
    public ICollection<DetalleCompra> Detalles { get; set; } = [];

    [JsonIgnore]
    public ICollection<MovimientoStock> MovimientosStock { get; set; } = [];
}