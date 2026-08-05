using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class ProveedorConfiguration : IEntityTypeConfiguration<Proveedor>
{
    public void Configure(EntityTypeBuilder<Proveedor> builder)
    {
        builder.ToTable("proveedor");

        builder.HasKey(x => x.IdProveedor);

        builder.Property(x => x.IdProveedor)
            .HasColumnName("id_proveedor")
            .IsRequired();

        builder.Property(x => x.Codigo)
            .HasColumnName("codigo")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(x => x.RazonSocial)
            .HasColumnName("razon_social")
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(x => x.NombreFantasia)
            .HasColumnName("nombre_fantasia")
            .HasMaxLength(100);

        builder.Property(x => x.Cuit)
            .HasColumnName("cuit")
            .HasMaxLength(20);

        builder.Property(x => x.Telefono)
            .HasColumnName("telefono")
            .HasMaxLength(20);

        builder.Property(x => x.Email)
            .HasColumnName("email")
            .HasMaxLength(100);

        builder.Property(x => x.Direccion)
            .HasColumnName("direccion")
            .HasMaxLength(200);

        builder.Property(x => x.Ciudad)
            .HasColumnName("ciudad")
            .HasMaxLength(100);

        builder.Property(x => x.Provincia)
            .HasColumnName("provincia")
            .HasMaxLength(100);

        builder.Property(x => x.Observaciones)
            .HasColumnName("observaciones")
            .HasMaxLength(200);

        builder.Property(x => x.Estado)
            .HasColumnName("estado")
            .HasDefaultValue(true);
    }
}

