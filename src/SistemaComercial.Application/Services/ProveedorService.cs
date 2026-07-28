using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class ProveedorService : IProveedorService
{
    private readonly AppDbContext _context;

    public ProveedorService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Proveedor>> ObtenerTodosAsync()
    {
        return await _context.Proveedores.ToListAsync();
    }

    public async Task<Proveedor?> ObtenerPorIdAsync(short id)
    {
        return await _context.Proveedores.FindAsync(id);
    }

    public async Task<Proveedor> CrearAsync(Proveedor proveedor)
    {
        _context.Proveedores.Add(proveedor);

        await _context.SaveChangesAsync();

        return proveedor;
    }


    public async Task<Proveedor?> ActualizarAsync(short id, Proveedor proveedor)
    {
        var existente = await _context.Proveedores.FindAsync(id);

        if (existente == null)
            return null;

        existente.RazonSocial = proveedor.RazonSocial;
        existente.Codigo = proveedor.Codigo;
        existente.Direccion = proveedor.Direccion;
        existente.Observaciones = proveedor.Observaciones;
        existente.Telefono = proveedor.Telefono;
        existente.Estado = proveedor.Estado;
        existente.NombreFantasia = proveedor.NombreFantasia;
        existente.Cuit = proveedor.Cuit;
        existente.Email = proveedor.Email;
        existente.Ciudad = proveedor.Ciudad;
        existente.Provincia = proveedor.Provincia;

        await _context.SaveChangesAsync();

        return existente;
    }
   
    public async Task<bool> EliminarAsync(short id)
    {
        var proveedor = await _context.Proveedores.FindAsync(id);

        if (proveedor == null)
            return false;

        proveedor.Estado = false;

        await _context.SaveChangesAsync();

        return true;
    }
}