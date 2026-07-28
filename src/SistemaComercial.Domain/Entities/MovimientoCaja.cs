using System.Text.Json.Serialization;

public class MovimientoCaja
{
    public short IdMovimientoCaja { get; set; }

    public short IdCaja { get; set; }
    
    [JsonIgnore]
    public Caja? Caja { get; set; }
    public long? IdVenta { get; set; }

    [JsonIgnore]
    public Venta? Venta { get; set; }

    public DateTime FechaHora { get; set; }

    public string TipoMovimiento { get; set; } = string.Empty;

    public string? Concepto { get; set; } = string.Empty;

    public decimal Importe { get; set; }
    public string? Observaciones { get; set; } = string.Empty;

    
   
}