using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class VentaConfiguration : IEntityTypeConfiguration<Venta>
{
    public void Configure(EntityTypeBuilder<Venta> builder)
    {
        builder.ToTable("venta");

        builder.HasKey(x => x.IdVenta);

        builder.Property(x => x.IdVenta)
            .HasColumnName("id_venta");

        builder.Property(x => x.IdCliente)
            .HasColumnName("id_cliente");

        builder.Property(x => x.IdUsuario)
            .HasColumnName("id_usuario");
        
        builder.Property(x => x.IdCaja)
            .HasColumnName("id_caja");

        builder.Property(x => x.NumeroVenta)
            .HasColumnName("numero_venta")
            .HasMaxLength(50);

        builder.Property(x => x.FechaHora)
            .HasColumnName("fecha_hora");

        builder.Property(x => x.SubTotal)
            .HasColumnName("subtotal")
            .HasPrecision(12,2);

        builder.Property(x => x.Estado)
            .HasColumnName("estado");

        builder.HasOne(x => x.Cliente)
            .WithMany(x => x.Ventas)
            .HasForeignKey(x => x.IdCliente);

        builder.HasOne(x => x.Usuario)
            .WithMany(x => x.Ventas)
            .HasForeignKey(x => x.IdUsuario);
        
        builder.HasOne(x => x.Caja)
            .WithMany(c => c.Ventas)
            .HasForeignKey(x => x.IdCaja);
    }
}