using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class CompraConfiguration : IEntityTypeConfiguration<Compra>
{
    public void Configure(EntityTypeBuilder<Compra> builder)
    {
        builder.ToTable("compra");

        builder.HasKey(x => x.IdCompra);

        builder.Property(x => x.IdCompra).HasColumnName("id_compra");

        builder.Property(x => x.IdProveedor).HasColumnName("id_proveedor");

        builder.Property(x => x.IdUsuario).HasColumnName("id_usuario");

        builder.Property(x => x.NumeroCompra)
            .HasColumnName("numero_compra")
            .HasMaxLength(50);

        builder.Property(x => x.FechaHora)
            .HasColumnName("fecha_hora");

        builder.Property(x => x.Observaciones)
            .HasColumnName("observaciones")
            .HasMaxLength(255);

        builder.Property(x => x.Total)
            .HasColumnName("total")
            .HasPrecision(12,2);

        builder.Property(x => x.Estado)
            .HasColumnName("estado");

        builder.HasOne(x => x.Proveedor)
            .WithMany(x => x.Compras)
            .HasForeignKey(x => x.IdProveedor);

        builder.HasOne(x => x.Usuario)
            .WithMany(x => x.Compras)
            .HasForeignKey(x => x.IdUsuario);
    }
}