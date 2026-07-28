using Microsoft.EntityFrameworkCore;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence.Configurations;

namespace SistemaComercial.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Rol> Roles => Set<Rol>();
    public DbSet<Categoria> Categorias => Set<Categoria>();
    public DbSet<Marca> Marcas => Set<Marca>();
    public DbSet<FormaPago> FormasPago => Set<FormaPago>();
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<Proveedor> Proveedores => Set<Proveedor>();
    public DbSet<Usuario> Usuarios => Set<Usuario>();
    public DbSet<Producto> Productos => Set<Producto>();

    public DbSet<Compra> Compras => Set<Compra>();
    public DbSet<DetalleCompra> DetallesCompra => Set<DetalleCompra>();
    public DbSet<Venta> Ventas => Set<Venta>();
    public DbSet<DetalleVenta> DetallesVenta => Set<DetalleVenta>();



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
        modelBuilder.ApplyConfiguration(new ProductoConfiguration());
        modelBuilder.ApplyConfiguration(new CompraConfiguration());
        modelBuilder.ApplyConfiguration(new DetalleCompraConfiguration());
        modelBuilder.ApplyConfiguration(new VentaConfiguration());
        modelBuilder.ApplyConfiguration(new DetalleVentaConfiguration());
        
        base.OnModelCreating(modelBuilder);

        
    }

    
}