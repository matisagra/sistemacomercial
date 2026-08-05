using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class AuditoriaService : IAuditoriaService
{
    private readonly AppDbContext _context;

    public AuditoriaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Auditoria>> ObtenerTodasAsync()
    {
        return await _context.Auditorias
            .Include(a => a.Usuario)
            .OrderByDescending(a => a.FechaHora)
            .ToListAsync();
    }

    public async Task<Auditoria?> ObtenerPorIdAsync(long id)
    {
        return await _context.Auditorias
            .Include(a => a.Usuario)
            .FirstOrDefaultAsync(a => a.IdAuditoria == id);
    }

    public async Task<IEnumerable<Auditoria>> ObtenerPorUsuarioAsync(short idUsuario)
    {
        return await _context.Auditorias
            .Include(a => a.Usuario)
            .Where(a => a.IdUsuario == idUsuario)
            .OrderByDescending(a => a.FechaHora)
            .ToListAsync();
    }

    public async Task<IEnumerable<Auditoria>> ObtenerPorTablaAsync(string tabla)
    {
        return await _context.Auditorias
            .Include(a => a.Usuario)
            .Where(a => a.TablaAfectada.ToLower() == tabla.ToLower())
            .OrderByDescending(a => a.FechaHora)
            .ToListAsync();
    }
}