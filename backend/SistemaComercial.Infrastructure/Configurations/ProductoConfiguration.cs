using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class ProductoConfiguration : IEntityTypeConfiguration<Producto>
{
    public void Configure(EntityTypeBuilder<Producto> builder)
    {
        builder.ToTable("producto");

        builder.HasKey(x => x.IdProducto);

        builder.Property(x => x.IdProducto)
            .HasColumnName("id_producto");

        builder.Property(x => x.IdCategoria)
            .HasColumnName("id_categoria");

        builder.Property(x => x.IdMarca)
            .HasColumnName("id_marca");

        builder.Property(x => x.Codigo)
            .HasColumnName("codigo")
            .HasMaxLength(50);

        builder.Property(x => x.CodigoBarras)
            .HasColumnName("codigo_barras")
            .HasMaxLength(100);

        builder.Property(x => x.Nombre)
            .HasColumnName("nombre")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(x => x.Descripcion)
            .HasColumnName("descripcion")
            .HasMaxLength(255);

        builder.Property(x => x.PrecioCompra)
            .HasColumnName("precio_compra")
            .HasPrecision(12, 2);

        builder.Property(x => x.PrecioVenta)
            .HasColumnName("precio_venta")
            .HasPrecision(12, 2);

        builder.Property(x => x.MargenGanancia)
            .HasColumnName("margen_ganancia")
            .HasPrecision(5, 2);

        builder.Property(x => x.StockActual)
            .HasColumnName("stock_actual");

        builder.Property(x => x.StockMinimo)
            .HasColumnName("stock_minimo");

        builder.Property(x => x.Estado)
            .HasColumnName("estado");

        builder.HasOne(x => x.Categoria)
            .WithMany(x => x.Productos)
            .HasForeignKey(x => x.IdCategoria);

        builder.HasOne(x => x.Marca)
            .WithMany(x => x.Productos)
            .HasForeignKey(x => x.IdMarca);
    }
}