using System.ComponentModel.DataAnnotations;

namespace PersiaKhodro.Janbazan.App.Server.DTOs;

// --- Profile DTOs ---

public class UserProfileDto
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string NationalCode { get; set; }
    public string MobileNumber { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? PostalCode { get; set; }
    public DateTime DateOfBirth { get; set; }
}

public class UpdateProfileDto
{
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }
    public string? Email { get; set; }
    public string? Address { get; set; }
    public string? PostalCode { get; set; }
}


// --- Vehicle DTOs ---

public class CreateVehicleDto
{
    [Required]
    [StringLength(17, MinimumLength = 17)]
    public string Vin { get; set; } // شماره شاسی

    [Required]
    public string ModelName { get; set; }

    [Required]
    public int ProductionYear { get; set; }

    public string? PlateNumber { get; set; }
    public string? Color { get; set; }
}

public class VehicleDto
{
    public Guid Id { get; set; }
    public string Vin { get; set; }
    public string ModelName { get; set; }
    public int ProductionYear { get; set; }
    public string? PlateNumber { get; set; }
    public string Status { get; set; }
}
