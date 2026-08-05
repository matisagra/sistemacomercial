namespace SistemaComercial.Application.Requests;

public class AbrirCajaRequest
{
    public decimal SaldoInicial { get; set; }

    public string? Observaciones { get; set; }
}