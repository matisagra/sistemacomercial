using Microsoft.EntityFrameworkCore;
using SistemaComercial.Application.Interfaces;
using SistemaComercial.Application.Requests;
using SistemaComercial.Domain.Entities;
using SistemaComercial.Infrastructure.Persistence;

namespace SistemaComercial.Application.Services;

public class VentaService : IVentaService
{
    private readonly AppDbContext _context;
    private readonly IMovimientoCajaService _movimientoCajaService;
    private readonly IMovimientoStockService _movimientoStockService;
    public VentaService(AppDbContext context, IMovimientoCajaService movimientoCajaService, IMovimientoStockService movimientoStockService)
    {
        _context = context;
        _movimientoCajaService = movimientoCajaService;
        _movimientoStockService = movimientoStockService;
    }

    public async Task<IEnumerable<Venta>> ObtenerTodasAsync()
    {
        return await _context.Ventas
            .Include(v => v.Cliente)
            .Include(v => v.Usuario)
            .Include(v => v.Caja)
            .Include(v => v.DetallesVenta)
                .ThenInclude(d => d.Producto)
            .Include(v => v.DetallesPago)
                .ThenInclude(dp => dp.FormaPago)
            .ToListAsync();
    }
    public async Task<Venta?> ObtenerPorIdAsync(long id)
    {
        return await _context.Ventas
            .Include(v => v.Cliente)
            .Include(v => v.Usuario)
            .Include(v => v.Caja)
            .Include(v => v.DetallesVenta)
                .ThenInclude(d => d.Producto)
            .Include(v => v.DetallesPago)
                .ThenInclude(dp => dp.FormaPago)
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

            if (request.DescuentoPorcentaje < 0 || request.DescuentoPorcentaje > 100)
                throw new Exception("El descuento debe estar entre 0 y 100.");

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

            // CAJA
            Caja? caja = await _context.Cajas.FirstOrDefaultAsync(c => c.IdCaja == request.IdCaja);

            if (caja == null)
                throw new Exception("La caja no existe.");

            if (caja.Estado != "Abierta")
                throw new Exception("La caja está cerrada.");


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
                SubTotal = 0,
                Descuento = 0,
                Total = 0
            };

            _context.Ventas.Add(venta);

            await _context.SaveChangesAsync();

            decimal subtotalGeneral = 0;

            // PAGOS 
            if (request.Pagos == null || !request.Pagos.Any())
                throw new Exception("Debe ingresar al menos una forma de pago.");
            

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
                    Subtotal = subtotal
                };

                _context.DetallesVenta.Add(detalle);

                // DESCONTAR STOCK
                int stockAnterior = producto.StockActual;
                producto.StockActual -= item.Cantidad;

                await _movimientoStockService.RegistrarMovimientoAsync(
                producto.IdProducto,
                idUsuario,
                null,
                (short)venta.IdVenta,
                "Venta",
                item.Cantidad,
                stockAnterior,
                producto.StockActual,
                $"Venta {venta.NumeroVenta}");

                // ACUMULAR TOTAL

                subtotalGeneral += subtotal;
            }

            //---------------------------------------------------
            // DESCUENTO GENERAL Y TOTAL
            //---------------------------------------------------

            decimal montoDescuento = Math.Round(
                subtotalGeneral * (request.DescuentoPorcentaje / 100m),
                2,
                MidpointRounding.AwayFromZero);

            decimal totalVenta = Math.Round(
                subtotalGeneral - montoDescuento,
                2,
                MidpointRounding.AwayFromZero);

            //---------------------------------------------------
            // FINALIZAR VENTA
            //---------------------------------------------------

            venta.SubTotal = subtotalGeneral;
            venta.Descuento = montoDescuento;
            venta.Total = totalVenta;

            venta.NumeroVenta =
                $"VENT-{DateTime.Now:yyyyMMdd}-{venta.IdVenta:D6}";

            decimal totalPagado = request.Pagos.Sum(x => x.Importe);

            if (totalPagado != venta.Total)
                throw new Exception("El importe pagado no coincide con el total de la venta.");

            foreach (var pago in request.Pagos)
            {
                FormaPago? formaPago = await _context.FormasPago
                    .FirstOrDefaultAsync(x => x.IdFormaPago == pago.IdFormaPago);

                if (formaPago == null)
                    throw new Exception("La forma de pago no existe.");

                DetallePago detallePago = new()
                {
                    IdVenta = venta.IdVenta,
                    IdFormaPago = pago.IdFormaPago,
                    Importe = pago.Importe
                };

                _context.DetallesPago.Add(detallePago);
            }

            await _context.SaveChangesAsync();

            foreach (var pago in request.Pagos)
            {
                FormaPago? formaPago = await _context.FormasPago
                    .FirstAsync(x => x.IdFormaPago == pago.IdFormaPago);

                if (formaPago.Nombre.Equals("Efectivo", StringComparison.OrdinalIgnoreCase))
                {
                    await _movimientoCajaService.RegistrarMovimientoAsync(
                        venta.IdCaja,
                        venta.IdVenta,
                        "Venta",
                        venta.NumeroVenta,
                        pago.Importe,
                        null);
                }
            }

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