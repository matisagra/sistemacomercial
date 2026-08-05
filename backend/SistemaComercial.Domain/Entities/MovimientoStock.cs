using System.Text.Json.Serialization;
using SistemaComercial.Domain.Entities;

public class MovimientoStock
{
    public short IdMovimientoStock { get; set; }

    public int IdProducto { get; set; }

    [JsonIgnore]
    public Producto? Producto { get; set; }

    public short IdUsuario { get; set; }

    [JsonIgnore]
    public Usuario? Usuario { get; set; }

    public long? IdCompra { get; set; }
    
    [JsonIgnore]
    public Compra? Compra { get; set; }

    public long? IdVenta { get; set; }
    
    [JsonIgnore]
    public Venta? Venta { get; set; }

    public DateTime FechaHora { get; set; }

    public string TipoMovimiento { get; set; } = string.Empty;
    public int Cantidad { get; set; }

    public int StockAnterior { get; set; }
    public int StockNuevo { get; set; }
    public string? Motivo { get; set; } = string.Empty;

}