using System.ComponentModel.DataAnnotations;

namespace PersiaKhodro.Janbazan.App.Server.Entities;

public class DisabilityInfo
{
    public Guid Id { get; set; }

    [Range(0, 100)]
    public int DisabilityPercentage { get; set; } // درصد جانبازی

    public string? CaseNumber { get; set; } // شماره پرونده
    public DateTime? CertificateIssueDate { get; set; } // تاریخ صدور مدرک

    // Foreign Key to User
    public Guid UserId { get; set; }
    public virtual User User { get; set; }
}
