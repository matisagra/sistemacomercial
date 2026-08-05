using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class DetalleCompraConfiguration : IEntityTypeConfiguration<DetalleCompra>
{
    public void Configure(EntityTypeBuilder<DetalleCompra> builder)
    {
        builder.ToTable("detalle_compra");

        builder.HasKey(x => x.IdDetalleCompra);

        builder.Property(x => x.IdDetalleCompra)
            .HasColumnName("id_detalle_compra");

        builder.Property(x => x.IdCompra)
            .HasColumnName("id_compra");

        builder.Property(x => x.IdProducto)
            .HasColumnName("id_producto");

        builder.Property(x => x.Cantidad)
            .HasColumnName("cantidad");

        builder.Property(x => x.PrecioCompra)
            .HasColumnName("precio_compra")
            .HasPrecision(12,2);

        builder.Property(x => x.Subtotal)
            .HasColumnName("subtotal")
            .HasPrecision(12,2);

        builder.HasOne(x => x.Compra)
            .WithMany(x => x.Detalles)
            .HasForeignKey(x => x.IdCompra);

        builder.HasOne(x => x.Producto)
            .WithMany(x => x.DetallesCompra)
            .HasForeignKey(x => x.IdProducto);
    }
}