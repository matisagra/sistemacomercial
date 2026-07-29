using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class MovimientoStockConfiguration : IEntityTypeConfiguration<MovimientoStock>
{
    public void Configure(EntityTypeBuilder<MovimientoStock> builder)
    {
        builder.ToTable("movimiento_stock");

        builder.HasKey(x => x.IdMovimientoStock);

        builder.Property(x => x.IdMovimientoStock)
            .HasColumnName("id_movimiento_stock");

        builder.Property(x => x.IdProducto)
            .HasColumnName("id_producto");

        builder.Property(x => x.IdUsuario)
            .HasColumnName("id_usuario");

        builder.Property(x => x.IdCompra)
            .HasColumnName("id_compra");

        builder.Property(x => x.IdVenta)
            .HasColumnName("id_venta");

        builder.Property(x => x.FechaHora)
            .HasColumnName("fecha_hora");

        builder.Property(x => x.TipoMovimiento)
            .HasColumnName("tipo_movimiento")
            .HasMaxLength(20);

        builder.Property(x => x.Cantidad)
            .HasColumnName("cantidad");

        builder.Property(x => x.StockAnterior)
            .HasColumnName("stock_anterior");

        builder.Property(x => x.StockNuevo)
            .HasColumnName("stock_nuevo");

        builder.Property(x => x.Motivo)
            .HasColumnName("motivo")
            .HasMaxLength(255);

        builder.HasOne(x => x.Producto)
            .WithMany(p => p.MovimientosStock)
            .HasForeignKey(x => x.IdProducto);

        builder.HasOne(x => x.Usuario)
            .WithMany(u => u.MovimientosStock)
            .HasForeignKey(x => x.IdUsuario);

        builder.HasOne(x => x.Compra)
            .WithMany(c => c.MovimientosStock)
            .HasForeignKey(x => x.IdCompra)
            .IsRequired(false);

        builder.HasOne(x => x.Venta)
            .WithMany(v => v.MovimientosStock)
            .HasForeignKey(x => x.IdVenta)
            .IsRequired(false);
    }
}