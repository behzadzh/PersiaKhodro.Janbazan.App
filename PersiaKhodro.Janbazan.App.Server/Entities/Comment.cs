using System.ComponentModel.DataAnnotations;

namespace PersiaKhodro.Janbazan.App.Server.Entities;

/// <summary>
/// Represents a comment or note attached to a vehicle's warranty case.
/// </summary>
public class Comment
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public string Content { get; set; }

    /// <summary>
    /// True if the comment is from the company staff, false if it's from the user (veteran).
    /// اگر پیام از طرف شرکت باشد مقدارش True و اگر از طرف کاربر باشد False است
    /// </summary>
    public bool IsFromCompany { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// The ID of the user who wrote the comment. Can be null for system-generated messages.
    /// شناسه‌ی کاربری که پیام را نوشته است. برای پیام‌های سیستمی می‌تواند خالی باشد
    /// </summary>
    public Guid? AuthorId { get; set; }

    // --- Foreign Key to Vehicle ---
    public Guid VehicleId { get; set; }
    public virtual Vehicle Vehicle { get; set; }
}