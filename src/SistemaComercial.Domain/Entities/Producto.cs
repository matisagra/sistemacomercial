using System.Text.Json.Serialization;

namespace SistemaComercial.Domain.Entities;

public class Producto
{
    public int IdProducto { get; set; }

    public short IdCategoria { get; set; }

    [JsonIgnore]
    public Categoria? Categoria { get; set; }

    public short IdMarca { get; set; }
    
    [JsonIgnore]
    public Marca? Marca { get; set; }
    public string? Codigo { get; set; }

    public string? CodigoBarras { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public decimal PrecioCompra { get; set; }

    public decimal PrecioVenta { get; set; }

    public decimal MargenGanancia { get; set; }

    public int StockActual { get; set; }

    public int StockMinimo { get; set; }

    public bool Estado { get; set; }

    public ICollection<DetalleCompra> DetallesCompra { get; set; } = [];

    // public ICollection<DetalleVenta> DetallesVenta { get; set; } = [];

    // public ICollection<MovimientoStock> MovimientosStock { get; set; } = [];
}