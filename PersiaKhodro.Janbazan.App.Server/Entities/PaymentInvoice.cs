using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace PersiaKhodro.Janbazan.App.Server.Entities;

/// <summary>
/// Represents a payment invoice for a vehicle's warranty case.
/// </summary>
public class PaymentInvoice
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [Column(TypeName = "decimal(18, 2)")]
    public decimal Amount { get; set; }

    public bool IsPaid { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? PaidAt { get; set; }

    /// <summary>
    /// The tracking ID or reference number from the Payment Service Provider (PSP).
    /// کد رهگیری که از درگاه پرداخت دریافت می‌شود
    /// </summary>
    [MaxLength(100)]
    public string? PaymentGatewayTraceId { get; set; }

    // --- Foreign Key to Vehicle ---
    public Guid VehicleId { get; set; }
    public virtual Vehicle Vehicle { get; set; }
}
