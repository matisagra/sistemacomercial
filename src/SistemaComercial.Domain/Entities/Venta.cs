using System.Text.Json.Serialization;
using SistemaComercial.Domain.Entities;
public class Venta
{
    public long IdVenta { get; set; }

    public short? IdCliente { get; set; }

    [JsonIgnore]
    public Cliente? Cliente { get; set; }

    public short IdUsuario { get; set; }

    [JsonIgnore]
    public Usuario? Usuario { get; set; }

    public short IdCaja { get; set; }

    //[JsonIgnore]
   // public Caja? Caja { get; set; }

    public string? NumeroVenta { get; set; }

    public DateTime FechaHora { get; set; }

    public decimal SubTotal { get; set; }

    public string Estado { get; set; } = string.Empty;

    [JsonIgnore]
    public ICollection<DetalleVenta> Detalles { get; set; } = [];
}