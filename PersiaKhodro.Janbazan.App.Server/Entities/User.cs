using System.ComponentModel.DataAnnotations;

namespace PersiaKhodro.Janbazan.App.Server.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    [MaxLength(50)]
    public string FirstName { get; set; }

    [Required]
    [MaxLength(50)]
    public string LastName { get; set; }

    [Required]
    [MaxLength(11)]
    public string NationalCode { get; set; } // کد ملی

    [Required]
    [MaxLength(11)]
    public string MobileNumber { get; set; }

    public bool IsMobileVerified { get; set; } = false;

    [Required]
    public string HashedPassword { get; set; }

    public DateTime DateOfBirth { get; set; }

    [MaxLength(100)]
    public string? Email { get; set; }

    public string? ProfilePictureUrl { get; set; }
    public string? Address { get; set; }
    public string? PostalCode { get; set; }

    // --- Navigation Properties ---
    // این ویژگی‌ها برای برقراری ارتباط بین جداول استفاده می‌شوند

    // One-to-One relationship with DisabilityInfo
    public virtual DisabilityInfo? DisabilityInfo { get; set; }

    // One-to-Many relationship with Vehicle
    public virtual ICollection<Vehicle> Vehicles { get; set; } = new List<Vehicle>();

    // One-to-Many relationship with RefreshToken
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();
}
