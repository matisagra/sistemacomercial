using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class RolConfiguration : IEntityTypeConfiguration<Rol>
{
    public void Configure(EntityTypeBuilder<Rol> builder)
    {
        builder.ToTable("rol");

        builder.HasKey(x => x.IdRol);

        builder.Property(x => x.IdRol)
            .HasColumnName("id_rol");

        builder.Property(x => x.Nombre)
            .HasColumnName("nombre")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(x => x.Descripcion)
            .HasColumnName("descripcion")
            .HasMaxLength(200);

        builder.Property(x => x.Estado)
            .HasColumnName("estado")
            .HasDefaultValue(true);

        builder.HasIndex(x => x.Nombre)
            .IsUnique();
    }
}