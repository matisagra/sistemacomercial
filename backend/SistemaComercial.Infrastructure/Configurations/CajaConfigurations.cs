using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class CajaConfiguration : IEntityTypeConfiguration<Caja>
{
    public void Configure(EntityTypeBuilder<Caja> builder)
    {
        builder.ToTable("caja");

        builder.HasKey(x => x.IdCaja);

        builder.Property(x => x.IdCaja)
            .HasColumnName("id_caja");

        builder.Property(x => x.NumeroCaja)
            .HasColumnName("numero_caja")
            .HasMaxLength(30);

        builder.Property(x => x.IdUsuario)
            .HasColumnName("id_usuario");

        builder.Property(x => x.FechaApertura)
            .HasColumnName("fecha_apertura");

        builder.Property(x => x.FechaCierre)
            .HasColumnName("fecha_cierre");

        builder.Property(x => x.SaldoInicial)
            .HasColumnName("saldo_inicial")
            .HasPrecision(12,2);

        builder.Property(x => x.SaldoFinal)
            .HasColumnName("saldo_final")
            .HasPrecision(12,2);

        builder.Property(x => x.SaldoEsperado)
            .HasColumnName("saldo_esperado")
            .HasPrecision(12,2);

        builder.Property(x => x.Diferencia)
            .HasColumnName("diferencia")
            .HasPrecision(12,2);

        builder.Property(x => x.Observaciones)
            .HasColumnName("observaciones")
            .HasMaxLength(255);

        builder.Property(x => x.Estado)
            .HasColumnName("estado");

        builder.HasOne(x => x.Usuario)
            .WithMany(u => u.Cajas)
            .HasForeignKey(x => x.IdUsuario);
    }
}