using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class CategoriaConfiguration : IEntityTypeConfiguration<Categoria>
{
    public void Configure(EntityTypeBuilder<Categoria> builder)
    {
        builder.ToTable("categoria");

        builder.HasKey(x => x.IdCategoria);

        builder.Property(x => x.IdCategoria)
            .HasColumnName("id_categoria");

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