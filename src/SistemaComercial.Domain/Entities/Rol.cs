namespace SistemaComercial.Domain.Entities;

public class Rol
{
    public short IdRol { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public bool Estado { get; set; } = true;

    // Navegación
     // public ICollection<Usuario> Usuarios { get; set; } = new List<Usuario>();
}