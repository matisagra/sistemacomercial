using Microsoft.EntityFrameworkCore;
using SistemaComercial.Domain.Entities;

namespace SistemaComercial.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Rol> Roles => Set<Rol>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

    

        base.OnModelCreating(modelBuilder);

        
    }

    
}