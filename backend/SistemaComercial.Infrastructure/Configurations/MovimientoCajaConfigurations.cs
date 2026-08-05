using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class MovimientoCajaConfiguration : IEntityTypeConfiguration<MovimientoCaja>
{
    public void Configure(EntityTypeBuilder<MovimientoCaja> builder)
    {
        builder.ToTable("movimiento_caja");

        builder.HasKey(x => x.IdMovimientoCaja);

        builder.Property(x => x.IdMovimientoCaja)
            .HasColumnName("id_movimiento_caja");

        builder.Property(x => x.IdCaja)
            .HasColumnName("id_caja");

        builder.Property(x => x.IdVenta)
            .HasColumnName("id_venta");

        builder.Property(x => x.FechaHora)
            .HasColumnName("fecha_hora");

        builder.Property(x => x.TipoMovimiento)
            .HasColumnName("tipo_movimiento")
            .HasMaxLength(30);

        builder.Property(x => x.Concepto)
            .HasColumnName("concepto")
            .HasMaxLength(100);

        builder.Property(x => x.Importe)
            .HasColumnName("importe")
            .HasPrecision(12,2);

        builder.Property(x => x.Observaciones)
            .HasColumnName("observaciones")
            .HasMaxLength(255);

        builder.HasOne(x => x.Caja)
            .WithMany(c => c.MovimientosCaja)
            .HasForeignKey(x => x.IdCaja);

        builder.HasOne(x => x.Venta)
            .WithMany(v => v.MovimientosCaja)
            .HasForeignKey(x => x.IdVenta)
            .IsRequired(false);
    }
}