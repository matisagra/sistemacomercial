public class CrearCompraRequest
{
    public short IdProveedor { get; set; }

    public string? Observaciones { get; set; }

    public List<DetalleCompraRequest> Detalles { get; set; } = [];
}