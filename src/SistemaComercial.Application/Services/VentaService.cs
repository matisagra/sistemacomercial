using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Application.Requests;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class VentaService : IVentaService
{
    private readonly AppDbContext _context;

    public VentaService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Venta>> ObtenerTodasAsync()
    {
        return await _context.Ventas
            .Include(v => v.Cliente)
            .Include(v => v.Usuario)
            .Include(v => v.Detalles)
                .ThenInclude(d => d.Producto)
            .ToListAsync();
    }

    public async Task<Venta?> ObtenerPorIdAsync(long id)
    {
        return await _context.Ventas
            .Include(v => v.Cliente)
            .Include(v => v.Usuario)
            .Include(v => v.Detalles)
                .ThenInclude(d => d.Producto)
            .FirstOrDefaultAsync(v => v.IdVenta == id);
    }

    public async Task<Venta> CrearAsync(CrearVentaRequest request, short idUsuario)
    {
        await using var transaction = await _context.Database.BeginTransactionAsync();

        try
        {
            //---------------------------------------------------
            // VALIDACIONES
            //---------------------------------------------------

            if (request.Detalles == null || !request.Detalles.Any())
                throw new Exception("Debe ingresar al menos un producto.");

            var repetidos = request.Detalles
                .GroupBy(x => x.IdProducto)
                .Where(g => g.Count() > 1)
                .Select(g => g.Key)
                .ToList();

            if (repetidos.Any())
                throw new Exception("Hay productos repetidos.");

            //---------------------------------------------------
            // CLIENTE
            //---------------------------------------------------

            if (request.IdCliente.HasValue)
            {
                Cliente? cliente = await _context.Clientes
                    .FirstOrDefaultAsync(c => c.IdCliente == request.IdCliente);

                if (cliente == null)
                    throw new Exception("Cliente inexistente.");

                if (!cliente.Estado)
                    throw new Exception("El cliente está inactivo.");
            }

            //---------------------------------------------------
            // CREAR VENTA
            //---------------------------------------------------

            Venta venta = new()
            {
                IdCliente = request.IdCliente,
                IdUsuario = idUsuario,
                IdCaja = request.IdCaja,
                FechaHora = DateTime.UtcNow,
                NumeroVenta = "",
                Estado = "Registrada", //falta el enum
                SubTotal = 0
            };

            _context.Ventas.Add(venta);

            await _context.SaveChangesAsync();

            decimal subtotalGeneral = 0;

            //---------------------------------------------------
            // DETALLES
            //---------------------------------------------------

            foreach (var item in request.Detalles)
            {
                if (item.Cantidad <= 0)
                    throw new Exception("La cantidad debe ser mayor a cero.");

                Producto? producto = await _context.Productos
                    .FirstOrDefaultAsync(p => p.IdProducto == item.IdProducto);

                if (producto == null)
                    throw new Exception($"No existe el producto con ID {item.IdProducto}");

                if (!producto.Estado)
                    throw new Exception($"El producto '{producto.Nombre}' está inactivo.");

                if (producto.StockActual < item.Cantidad)
                    throw new Exception($"Stock insuficiente para '{producto.Nombre}'.");

                //---------------------------------------
                // CALCULAR IMPORTE
                //---------------------------------------

                decimal descuento = 0;

                decimal subtotal =
                    (producto.PrecioVenta * item.Cantidad) - descuento;

                //---------------------------------------
                // CREAR DETALLE
                //---------------------------------------

                DetalleVenta detalle = new()
                {
                    IdVenta = venta.IdVenta,
                    IdProducto = producto.IdProducto,
                    Cantidad = item.Cantidad,
                    PrecioUnitario = producto.PrecioVenta,
                    Descuento = descuento,
                    Subtotal = subtotal
                };

                _context.DetallesVenta.Add(detalle);

                //---------------------------------------
                // DESCONTAR STOCK
                //---------------------------------------

                producto.StockActual -= item.Cantidad;

                //---------------------------------------
                // ACUMULAR TOTAL
                //---------------------------------------

                subtotalGeneral += subtotal;
            }

            //---------------------------------------------------
            // FINALIZAR VENTA
            //---------------------------------------------------

            venta.SubTotal = subtotalGeneral;

            venta.NumeroVenta =
                $"VENT-{DateTime.Now:yyyyMMdd}-{venta.IdVenta:D6}";

            await _context.SaveChangesAsync();

            await transaction.CommitAsync();

            return venta;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }
}