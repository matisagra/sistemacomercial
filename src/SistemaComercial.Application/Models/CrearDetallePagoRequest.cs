namespace SistemaComercial.Application.Requests;

public class CrearDetallePagoRequest
{
    public short IdFormaPago { get; set; }

    public decimal Importe { get; set; }
}