using System.ComponentModel.DataAnnotations;

namespace PersiaKhodro.Janbazan.App.Server.DTOs;

// DTO for user registration
public class RegisterUserDto
{
    [Required]
    public string FirstName { get; set; }
    [Required]
    public string LastName { get; set; }
    [Required]
    [StringLength(10, MinimumLength = 10)]
    public string NationalCode { get; set; }
    [Required]
    [StringLength(11, MinimumLength = 11)]
    public string MobileNumber { get; set; }
    [Required]
    [MinLength(6)]
    public string Password { get; set; }
    [Required]
    public DateTime DateOfBirth { get; set; }
}

// DTO for user login
public class LoginUserDto
{
    [Required]
    public string NationalCode { get; set; }
    [Required]
    public string Password { get; set; }
}

// --- NEW DTO ---
// DTO for requesting a new token using a refresh token
public class RefreshTokenRequestDto
{
    [Required]
    public string Token { get; set; } // The expired JWT token
    [Required]
    public string RefreshToken { get; set; }
}


// DTO for the response after a successful authentication
public class AuthResponseDto
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public string? Token { get; set; }
    public string? RefreshToken { get; set; } // This field already exists
    public DateTime? TokenExpiration { get; set; }
}
