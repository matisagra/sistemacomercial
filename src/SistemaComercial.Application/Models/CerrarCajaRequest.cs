namespace SistemaComercial.Application.Requests;

public class CerrarCajaRequest
{
    public decimal SaldoFinal { get; set; }

    public string? Observaciones { get; set; }
}