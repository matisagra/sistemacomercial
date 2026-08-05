using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class ClienteService : IClienteService
{
    private readonly AppDbContext _context;

    public ClienteService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Cliente>> ObtenerTodosAsync()
    {
        return await _context.Clientes.ToListAsync();
    }

    public async Task<Cliente?> ObtenerPorIdAsync(short id)
    {
        return await _context.Clientes.FindAsync(id);
    }

    public async Task<Cliente> CrearAsync(Cliente cliente)
    {
        _context.Clientes.Add(cliente);

        await _context.SaveChangesAsync();

        return cliente;
    }

    public async Task<Cliente?> ActualizarAsync(short id, Cliente cliente)
    {
        var existente = await _context.Clientes.FindAsync(id);

        if (existente == null)
            return null;

        existente.Nombre = cliente.Nombre;
        existente.Apellido = cliente.Apellido;
        existente.Email = cliente.Email;
        existente.Direccion = cliente.Direccion;
        existente.Observaciones = cliente.Observaciones;
        existente.Telefono = cliente.Telefono;
        existente.Estado = cliente.Estado;

        await _context.SaveChangesAsync();

        return existente;
    }

    public async Task<bool> EliminarAsync(short id)
    {
        var cliente = await _context.Clientes.FindAsync(id);

        if (cliente == null)
            return false;

        cliente.Estado = false;

        await _context.SaveChangesAsync();

        return true;
    }
}