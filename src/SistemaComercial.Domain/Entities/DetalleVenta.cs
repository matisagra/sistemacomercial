using System.Text.Json.Serialization;
namespace SistemaComercial.Domain.Entities;
public class DetalleVenta
{
    public long IdDetalleVenta { get; set; }

    public long IdVenta { get; set; }

    [JsonIgnore]
    public Venta? Venta { get; set; }

    public int IdProducto { get; set; }

    [JsonIgnore]
    public Producto? Producto { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioUnitario { get; set; }

    public decimal Descuento { get; set; }

    public decimal Subtotal { get; set; }
}