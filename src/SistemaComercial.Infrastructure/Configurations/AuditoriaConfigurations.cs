using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class AuditoriaConfiguration : IEntityTypeConfiguration<Auditoria>
{
    public void Configure(EntityTypeBuilder<Auditoria> builder)
    {
        builder.ToTable("auditoria");

        builder.HasKey(x => x.IdAuditoria);

        builder.Property(x => x.IdAuditoria)
            .HasColumnName("id_auditoria");

        builder.Property(x => x.IdUsuario)
            .HasColumnName("id_usuario");

        builder.Property(x => x.FechaHora)
            .HasColumnName("fecha_hora");

        builder.Property(x => x.TablaAfectada)
            .HasColumnName("tabla_afectada")
            .HasMaxLength(100);

        builder.Property(x => x.Operacion)
            .HasColumnName("operacion")
            .HasMaxLength(20);

        builder.Property(x => x.DatosAnteriores)
            .HasColumnName("datos_anteriores")
            .HasColumnType("jsonb");

        builder.Property(x => x.DatosNuevos)
            .HasColumnName("datos_nuevos")
            .HasColumnType("jsonb");

        builder.Property(x => x.Ip)
            .HasColumnName("ip")
            .HasMaxLength(50);

        builder.Property(x => x.Equipo)
            .HasColumnName("equipo")
            .HasMaxLength(100);

        builder.HasOne(x => x.Usuario)
            .WithMany()
            .HasForeignKey(x => x.IdUsuario)
            .OnDelete(DeleteBehavior.SetNull);
    }
}