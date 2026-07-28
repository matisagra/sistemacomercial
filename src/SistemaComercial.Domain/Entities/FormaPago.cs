namespace SistemaComercial.Domain.Entities;

public class FormaPago
{
    public short IdFormaPago { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public bool Estado { get; set; } = true;

    // Navegación
     // public ICollection<DetallePago> DetallesPago { get; set; } = new List<DetallePago>();
}