namespace SistemaComercial.Domain.Entities;

public class Proveedor
{
    public short IdProveedor { get; set; }

    public string Codigo { get; set; } = string.Empty;

    public string RazonSocial { get; set; } = string.Empty;
    public string NombreFantasia { get; set; } = string.Empty;
    public string Cuit { get; set; } = string.Empty;
    public string Telefono { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Direccion { get; set; } = string.Empty;
    public string Ciudad { get; set; } = string.Empty;
    public string Provincia { get; set; } = string.Empty;
    public string Observaciones { get; set; } = string.Empty;
    public bool Estado { get; set; } = true;

    // Navegación
     // public ICollection<Compra> Compras { get; set; } = new List<Compra>();
}