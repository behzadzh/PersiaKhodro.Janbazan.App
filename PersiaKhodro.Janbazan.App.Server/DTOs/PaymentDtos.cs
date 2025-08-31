using System.ComponentModel.DataAnnotations;

namespace PersiaKhodro.Janbazan.App.Server.DTOs;

/// <summary>
/// DTO for the response when a payment request is created.
/// </summary>
public class PaymentRequestResponseDto
{
    public Guid InvoiceId { get; set; }

    /// <summary>
    /// The URL to which the user should be redirected to make the payment.
    /// </summary>
    public string PaymentUrl { get; set; }
}

/// <summary>
/// DTO for the callback from the payment gateway.
/// </summary>
public class PaymentCallbackDto
{
    public Guid InvoiceId { get; set; }
    public bool IsSuccess { get; set; }
    public string? TraceId { get; set; } // Tracking ID from PSP
}
