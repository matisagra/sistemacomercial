namespace SistemaComercial.Application.Requests;

public class CrearVentaRequest
{
    public short? IdCliente { get; set; }
    public short IdCaja { get; set; }
    public List<DetalleVentaRequest> Detalles { get; set; } = [];
    public List<CrearDetallePagoRequest> Pagos { get; set; } = [];
}