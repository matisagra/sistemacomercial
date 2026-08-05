using System.Text.Json.Serialization;
using SistemaComercial.Domain.Entities;
public class DetalleCompra
{
    public long IdDetalleCompra { get; set; }

    public long IdCompra { get; set; }

    [JsonIgnore]
    public Compra? Compra { get; set; }

    public int IdProducto { get; set; }

    [JsonIgnore]
    public Producto? Producto { get; set; }

    public int Cantidad { get; set; }

    public decimal PrecioCompra { get; set; }

    public decimal Subtotal { get; set; }
}