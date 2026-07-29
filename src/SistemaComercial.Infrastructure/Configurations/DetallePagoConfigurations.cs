using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class DetallePagoConfiguration : IEntityTypeConfiguration<DetallePago>
{
    public void Configure(EntityTypeBuilder<DetallePago> builder)
    {
        builder.ToTable("detalle_pago");

        builder.HasKey(x => x.IdDetallePago);

        builder.Property(x => x.IdDetallePago)
            .HasColumnName("id_detalle_pago");

        builder.Property(x => x.IdVenta)
            .HasColumnName("id_venta");

        builder.Property(x => x.IdFormaPago)
            .HasColumnName("id_forma_pago");

        builder.Property(x => x.Importe)
            .HasColumnName("importe")
            .HasPrecision(12,2);

        builder.HasOne(x => x.Venta)
            .WithMany(v => v.DetallesPago)
            .HasForeignKey(x => x.IdVenta);

        builder.HasOne(x => x.FormaPago)
            .WithMany(f => f.DetallesPago)
            .HasForeignKey(x => x.IdFormaPago);
    }
}