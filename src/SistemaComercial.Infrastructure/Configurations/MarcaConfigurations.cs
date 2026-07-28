using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class MarcaConfiguration : IEntityTypeConfiguration<Marca>
{
    public void Configure(EntityTypeBuilder<Marca> builder)
    {
        builder.ToTable("marca");

        builder.HasKey(x => x.IdMarca);

        builder.Property(x => x.IdMarca)
            .HasColumnName("id_marca");

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