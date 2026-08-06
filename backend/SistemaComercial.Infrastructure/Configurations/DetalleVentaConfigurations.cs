using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class DetalleVentaConfiguration : IEntityTypeConfiguration<DetalleVenta>
{
    public void Configure(EntityTypeBuilder<DetalleVenta> builder)
    {
        builder.ToTable("detalle_venta");

        builder.HasKey(x => x.IdDetalleVenta);

        builder.Property(x => x.IdDetalleVenta)
            .HasColumnName("id_detalle_venta");

        builder.Property(x => x.IdVenta)
            .HasColumnName("id_venta");

        builder.Property(x => x.IdProducto)
            .HasColumnName("id_producto");

        builder.Property(x => x.Cantidad)
            .HasColumnName("cantidad");

        builder.Property(x => x.PrecioUnitario)
            .HasColumnName("precio_unitario")
            .HasPrecision(12,2);

        builder.Property(x => x.Subtotal)
            .HasColumnName("subtotal")
            .HasPrecision(12,2);

        builder.HasOne(x => x.Venta)
            .WithMany(x => x.DetallesVenta)
            .HasForeignKey(x => x.IdVenta);

        builder.HasOne(x => x.Producto)
            .WithMany(x => x.DetallesVenta)
            .HasForeignKey(x => x.IdProducto);
    }
}