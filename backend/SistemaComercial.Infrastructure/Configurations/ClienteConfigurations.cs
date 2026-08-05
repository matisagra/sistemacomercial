using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class ClienteConfiguration : IEntityTypeConfiguration<Cliente>
{
    public void Configure(EntityTypeBuilder<Cliente> builder)
    {
        builder.ToTable("cliente");

        builder.HasKey(x => x.IdCliente);

        builder.Property(x => x.IdCliente)
            .HasColumnName("id_cliente");

        builder.Property(x => x.Nombre)
            .HasColumnName("nombre")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(x => x.Codigo)
            .HasColumnName("codigo")
            .HasMaxLength(20)
            .IsRequired();

        builder.Property(x => x.Apellido)
            .HasColumnName("apellido")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(x => x.Dni)
            .HasColumnName("dni")
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

        builder.Property(x => x.Observaciones)
            .HasColumnName("observaciones")
            .HasMaxLength(200);

        builder.Property(x => x.Estado)
            .HasColumnName("estado")
            .HasDefaultValue(true);

        builder.HasIndex(x => x.Nombre)
            .IsUnique();
    }
}