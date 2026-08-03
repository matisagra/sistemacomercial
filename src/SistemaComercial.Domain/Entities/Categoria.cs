using System.Text.Json.Serialization;


namespace SistemaComercial.Domain.Entities;

public class Categoria
{
    public short IdCategoria { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public string? Descripcion { get; set; }

    public bool Estado { get; set; } = true;

    // Navegación
    [JsonIgnore]
    public ICollection<Producto> Productos { get; set; } = new List<Producto>();
}