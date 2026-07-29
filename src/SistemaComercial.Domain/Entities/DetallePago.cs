using System.Text.Json.Serialization;

namespace SistemaComercial.Domain.Entities;

public class DetallePago
{
    public long IdDetallePago { get; set; }

    public long IdVenta { get; set; }

    [JsonIgnore]
    public Venta? Venta { get; set; }

    public short IdFormaPago { get; set; }

    [JsonIgnore]
    public FormaPago? FormaPago { get; set; }

    public decimal Importe { get; set; }
    
}