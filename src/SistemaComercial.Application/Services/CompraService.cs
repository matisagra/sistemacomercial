using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Application.Models;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class CompraService : ICompraService
{
    private readonly AppDbContext _context;

    public CompraService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Compra>> ObtenerTodasAsync()
    {
        return await _context.Compras
            .Include(c => c.Proveedor)
            .Include(c => c.Usuario)
            .Include(c => c.Detalles)
                .ThenInclude(d => d.Producto)
            .ToListAsync();
    }

    public async Task<Compra?> ObtenerPorIdAsync(long id)
    {
        return await _context.Compras
            .Include(c => c.Proveedor)
            .Include(c => c.Usuario)
            .Include(c => c.Detalles)
                .ThenInclude(d => d.Producto)
            .FirstOrDefaultAsync(c => c.IdCompra == id);
    }

    public async Task<Compra> CrearAsync(CrearCompraRequest request, short idUsuario)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            // Validar proveedor
            bool proveedorExiste = await _context.Proveedores
                .AnyAsync(x => x.IdProveedor == request.IdProveedor);

            if (!proveedorExiste)
                throw new Exception("El proveedor no existe.");
            
            // Validar detalles
            if (request.Detalles == null || !request.Detalles.Any())
                throw new Exception("Debe ingresar al menos un producto.");

            Compra compra = new()
            {
                IdProveedor = request.IdProveedor,
                IdUsuario = idUsuario,
                FechaHora = DateTime.UtcNow,
                Observaciones = request.Observaciones,
                Estado = "Registrada", // corregir esto haciendo un enum
                Total = 0,
                NumeroCompra = ""
            };

            _context.Compras.Add(compra);

            await _context.SaveChangesAsync();

            decimal total = 0;

            foreach (var item in request.Detalles)
            {
                if (item.Cantidad <= 0)
                    throw new Exception("La cantidad debe ser mayor a cero.");

                if (item.PrecioCompra <= 0)
                    throw new Exception("El precio de compra debe ser mayor a cero.");

                Producto? producto = await _context.Productos
                    .FirstOrDefaultAsync(x => x.IdProducto == item.IdProducto);

                if (producto == null)
                    throw new Exception($"No existe el producto con ID {item.IdProducto}");

                if (!producto.Estado)
                    throw new Exception($"El producto '{producto.Nombre}' está inactivo.");
               
                decimal subtotal = item.Cantidad * item.PrecioCompra;

                DetalleCompra detalle = new()
                {
                    IdCompra = compra.IdCompra,
                    IdProducto = item.IdProducto,
                    Cantidad = item.Cantidad,
                    PrecioCompra = item.PrecioCompra,
                    Subtotal = subtotal
                };

                _context.DetallesCompra.Add(detalle);

                total += subtotal;

               
                // ACTUALIZAR PRODUCTO  

                int stockAnterior = producto.StockActual;

                producto.StockActual += item.Cantidad;

                producto.PrecioCompra = item.PrecioCompra;

                if (producto.PrecioCompra > 0 && producto.PrecioVenta > 0)
                {
                   producto.MargenGanancia = Math.Round((producto.PrecioVenta - producto.PrecioCompra) / producto.PrecioCompra * 100, 2);
                }
                else
                {
                    producto.MargenGanancia = 0;
                }

                //-----------------------------------
                // MOVIMIENTO STOCK
                //-----------------------------------

               /* MovimientoStock movimiento = new()
                {
                    IdProducto = producto.IdProducto,
                    IdUsuario = idUsuario,
                    TipoMovimiento = "compra",
                    Cantidad = item.Cantidad,
                    StockAnterior = stockAnterior,
                    StockNuevo = producto.StockActual,
                    FechaHora = DateTime.UtcNow,
                    Motivo = "Ingreso por compra",
                    IdCompra = compra.IdCompra
                };

                _context.MovimientosStock.Add(movimiento); */
            } 

            //-----------------------------------
            // TOTAL Y NUMERO
            //-----------------------------------

            compra.Total = total;

            compra.NumeroCompra = $"COMP-{DateTime.Now:yyyyMMdd}-{compra.IdCompra:D6}";

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return compra;
        }
        catch (Exception)
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}