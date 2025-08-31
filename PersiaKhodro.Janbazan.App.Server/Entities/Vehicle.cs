using System.ComponentModel.DataAnnotations;
using System.Reflection.Metadata;

namespace PersiaKhodro.Janbazan.App.Server.Entities;

public class Vehicle
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(17)]
    public string Vin { get; set; } // شماره شاسی

    [MaxLength(20)]
    public string? PlateNumber { get; set; } // شماره پلاک

    [Required]
    public string ModelName { get; set; }
    public int ProductionYear { get; set; }
    public string? Color { get; set; }
    public DateTime? PurchaseDate { get; set; }
    public string? WarrantyContractNumber { get; set; }
    public CaseStatus Status { get; set; } = CaseStatus.Submitted;

    // Foreign Key to User
    public Guid UserId { get; set; }
    public virtual User User { get; set; }

    // Navigation Properties
    public virtual ICollection<Document> Documents { get; set; } = new List<Document>();
    public virtual ICollection<Comment> Comments { get; set; } = new List<Comment>();
    public virtual ICollection<PaymentInvoice> Invoices { get; set; } = new List<PaymentInvoice>();
}

// Enum for the status of a warranty case
public enum CaseStatus
{
    Submitted,          // ثبت اولیه
    AwaitingDocuments,  // در انتظار مدارک
    UnderReview,        // در حال بررسی
    AwaitingPayment,    // در انتظار پرداخت
    Completed,          // تکمیل شده
    Rejected            // رد شده
}
