using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence.Configurations;

public class UsuarioConfiguration : IEntityTypeConfiguration<Usuario>
{
    public void Configure(EntityTypeBuilder<Usuario> builder)
    {
        builder.ToTable("usuario");

        builder.HasKey(x => x.IdUsuario);

        builder.Property(x => x.IdUsuario)
            .HasColumnName("id_usuario");

        builder.Property(x => x.Nombre)
            .HasColumnName("nombre")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(x => x.Apellido)
            .HasColumnName("apellido")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(x => x.NombreUsuario)
            .HasColumnName("usuario")
            .HasMaxLength(30)
            .IsRequired();

        builder.Property(x => x.ContraseñaHash)
            .HasColumnName("contrasena")
            .IsRequired();

        builder.Property(x => x.Estado)
            .HasColumnName("estado")
            .HasDefaultValue(true);

        builder.HasIndex(x => x.NombreUsuario)
            .IsUnique();
        
        builder.Property(x => x.IdRol)
            .HasColumnName("id_rol")
            .IsRequired();
        
        builder.Property(x => x.UltimoAcceso)
            .HasColumnName("ultimo_acceso");
        
        builder.Property(x => x.IntentosFallidos)
            .HasColumnName("intentos_fallidos");
        
        builder.Property(x => x.BloqueadoHasta)
            .HasColumnName("bloqueado_hasta");
        
        builder.HasOne(u => u.Rol)
       .WithMany(r => r.Usuarios)
       .HasForeignKey(u => u.IdRol)
       .OnDelete(DeleteBehavior.Restrict);
    }
}