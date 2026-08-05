using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class ProductoService : IProductoService
{
    private readonly AppDbContext _context;

    public ProductoService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Producto>> ObtenerTodosAsync()
    {
        return await _context.Productos
            .Include(x => x.Categoria)
            .Include(x => x.Marca)
            .ToListAsync();
    }

    public async Task<Producto?> ObtenerPorIdAsync(int id)
    {
        return await _context.Productos
            .Include(x => x.Categoria)
            .Include(x => x.Marca)
            .FirstOrDefaultAsync(x => x.IdProducto == id);
    }

    public async Task<Producto> CrearAsync(Producto producto)
    {
        // Validar categoría
        if (!await _context.Categorias.AnyAsync(x => x.IdCategoria == producto.IdCategoria))
            throw new Exception("La categoría no existe.");

        // Validar marca
        if (!await _context.Marcas.AnyAsync(x => x.IdMarca == producto.IdMarca))
            throw new Exception("La marca no existe.");

        // Código repetido
        if (!string.IsNullOrWhiteSpace(producto.Codigo))
        {
            bool existe = await _context.Productos
                .AnyAsync(x => x.Codigo == producto.Codigo);

            if (existe)
                throw new Exception("Ya existe un producto con ese código.");
        }

        // Código de barras repetido
        if (!string.IsNullOrWhiteSpace(producto.CodigoBarras))
        {
            bool existe = await _context.Productos
                .AnyAsync(x => x.CodigoBarras == producto.CodigoBarras);

            if (existe)
                throw new Exception("Ya existe un producto con ese código de barras.");
        }

        // Validaciones
        if (producto.PrecioCompra < 0)
            throw new Exception("El precio de compra no puede ser negativo.");

        if (producto.PrecioVenta < 0)
            throw new Exception("El precio de venta no puede ser negativo.");

        if (producto.StockActual < 0)
            throw new Exception("El stock actual no puede ser negativo.");

        if (producto.StockMinimo < 0)
            throw new Exception("El stock mínimo no puede ser negativo.");

        // Calcular margen
        if (producto.PrecioCompra > 0)
        {
            producto.MargenGanancia =
                ((producto.PrecioVenta - producto.PrecioCompra)
                / producto.PrecioCompra) * 100;
        }
        else
        {
            producto.MargenGanancia = 0;
        }

        _context.Productos.Add(producto);

        await _context.SaveChangesAsync();

        return producto;
    }

    public async Task<bool> ActualizarAsync(int id, Producto producto)
    {
        var existente = await _context.Productos.FindAsync(id);

        if (existente == null)
            return false;

        existente.IdCategoria = producto.IdCategoria;
        existente.IdMarca = producto.IdMarca;
        existente.Codigo = producto.Codigo;
        existente.CodigoBarras = producto.CodigoBarras;
        existente.Nombre = producto.Nombre;
        existente.Descripcion = producto.Descripcion;
        existente.PrecioCompra = producto.PrecioCompra;
        existente.PrecioVenta = producto.PrecioVenta;
       // existente.StockActual = producto.StockActual;
        existente.StockMinimo = producto.StockMinimo;
        existente.Estado = producto.Estado;

        if (existente.PrecioCompra > 0)
        {
            existente.MargenGanancia =
                ((existente.PrecioVenta - existente.PrecioCompra)
                / existente.PrecioCompra) * 100;
        }
        else
        {
            existente.MargenGanancia = 0;
        }

        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<bool> EliminarAsync(int id)
    {
        var producto = await _context.Productos.FindAsync(id);

        if (producto == null)
            return false;

        _context.Productos.Remove(producto);

        await _context.SaveChangesAsync();

        return true;
    }
}