

public class Configuracion
{
    public short IdConfiguracion { get; set; }

    public string NombreNegocio { get; set; } = string.Empty;

    public string? RazonSocial { get; set; }

    public string? Cuit { get; set; }
    public string? Direccion { get; set; }

    public string? Telefono { get; set; }

    public string? Email { get; set; }
    public string? Logo { get; set; }

    public string Moneda { get; set; } = string.Empty;

    public bool PermitirStockNegativo { get; set; } = false;

    public bool SugerirPrecioVenta { get; set; } = true;
    public int StockMinimoDefecto { get; set; } = 0;

    public short IntentosLogin { get; set; } = 5;
}