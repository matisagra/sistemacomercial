using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class ConfiguracionConfiguration : IEntityTypeConfiguration<Configuracion>
{
    public void Configure(EntityTypeBuilder<Configuracion> builder)
    {
        builder.ToTable("configuracion");

        builder.HasKey(x => x.IdConfiguracion);

        builder.Property(x => x.IdConfiguracion)
            .HasColumnName("id_configuracion");

        builder.Property(x => x.NombreNegocio)
            .HasColumnName("nombre_negocio")
            .HasMaxLength(150)
            .IsRequired();

        builder.Property(x => x.RazonSocial)
            .HasColumnName("razon_social")
            .HasMaxLength(150);

        builder.Property(x => x.Cuit)
            .HasColumnName("cuit")
            .HasMaxLength(20);

        builder.Property(x => x.Direccion)
            .HasColumnName("direccion")
            .HasMaxLength(250);

        builder.Property(x => x.Telefono)
            .HasColumnName("telefono")
            .HasMaxLength(50);

        builder.Property(x => x.Email)
            .HasColumnName("email")
            .HasMaxLength(150);

        builder.Property(x => x.Logo)
            .HasColumnName("logo")
            .HasMaxLength(300);

        builder.Property(x => x.Moneda)
            .HasColumnName("moneda")
            .HasMaxLength(30);

        builder.Property(x => x.PermitirStockNegativo)
            .HasColumnName("permitir_stock_negativo");

        builder.Property(x => x.SugerirPrecioVenta)
            .HasColumnName("sugerir_precio_venta");

        builder.Property(x => x.StockMinimoDefecto)
            .HasColumnName("stock_minimo_defecto");

        builder.Property(x => x.IntentosLogin)
            .HasColumnName("intentos_login");
    }
}