using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class FormaPagoConfiguration : IEntityTypeConfiguration<FormaPago>
{
    public void Configure(EntityTypeBuilder<FormaPago> builder)
    {
        builder.ToTable("forma_pago");

        builder.HasKey(x => x.IdFormaPago);

        builder.Property(x => x.IdFormaPago)
            .HasColumnName("id_forma_pago");

        builder.Property(x => x.Nombre)
            .HasColumnName("nombre")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(x => x.Estado)
            .HasColumnName("estado")
            .HasDefaultValue(true);

        builder.HasIndex(x => x.Nombre)
            .IsUnique();
    }
}