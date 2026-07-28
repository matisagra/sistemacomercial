using System.Text.Json.Serialization;
namespace SistemaComercial.Domain.Entities;


public class Usuario
{
    public short IdUsuario { get; set; }

    public short IdRol { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string Apellido { get; set; } = string.Empty;

    public string NombreUsuario { get; set; } = string.Empty;

    public string ContraseñaHash { get; set; } = string.Empty;

    public DateTime? UltimoAcceso { get; set; }

    public short IntentosFallidos { get; set; } = 0;

    public DateTime? BloqueadoHasta { get; set; }

    public bool Estado { get; set; } = true;

    // Navegación

    [JsonIgnore] //para poder crear un usuario sin necesidad de enviar el rol, ya que el rol se asigna automáticamente al crear un usuario
    public virtual Rol? Rol { get; set; }

    [JsonIgnore]
    public ICollection<Compra>? Compras { get; set; } = new List<Compra>();

    [JsonIgnore]
    public ICollection<Venta>? Ventas { get; set; } = new List<Venta>();

    [JsonIgnore]
    public ICollection<Caja>? Cajas { get; set; } = new List<Caja>();
}