using System.Text.Json.Serialization;
using SistemaComercial.Domain.Entities;
public class Caja
{
    public short IdCaja { get; set; }
    public string NumeroCaja { get; set; } = string.Empty;
    public short IdUsuario { get; set; }
   
    [JsonIgnore]
    public Usuario? Usuario { get; set; }
    public DateTime FechaApertura { get; set; }
    public DateTime? FechaCierre { get; set; }
    public decimal SaldoInicial { get; set; }
    public decimal? SaldoFinal { get; set; }
    public decimal? SaldoEsperado { get; set; }

    public decimal? Diferencia { get; set; }
    public string? Observaciones { get; set; }
    public string Estado { get; set; } = "Abierta";

    // Navegación
    [JsonIgnore]
    public ICollection<MovimientoCaja> MovimientosCaja { get; set; } = [];
    
    [JsonIgnore]
    public ICollection<Venta> Ventas { get; set; } = [];
}