using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PersiaKhodro.Janbazan.App.Server.Data;
using PersiaKhodro.Janbazan.App.Server.DTOs;
using PersiaKhodro.Janbazan.App.Server.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace PersiaKhodro.Janbazan.App.Server.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterUserDto registerDto)
    {
        if (await _context.Users.AnyAsync(u => u.NationalCode == registerDto.NationalCode))
        {
            return new AuthResponseDto { IsSuccess = false, Message = "کاربری با این کد ملی قبلاً ثبت ‌نام کرده است." };
        }
        
        var user = new User
        {
            FirstName = registerDto.FirstName,
            LastName = registerDto.LastName,
            NationalCode = registerDto.NationalCode,
            MobileNumber = registerDto.MobileNumber,
            HashedPassword = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            DateOfBirth = registerDto.DateOfBirth
        };
        
        await _context.Users.AddAsync(user);
        await _context.SaveChangesAsync();
        return new AuthResponseDto { IsSuccess = true, Message = "ثبت ‌نام با موفقیت انجام شد." };
    }

    public async Task<AuthResponseDto> LoginAsync(LoginUserDto loginDto)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.NationalCode == loginDto.NationalCode);
        if (user == null || !BCrypt.Net.BCrypt.Verify(loginDto.Password, user.HashedPassword))
        {
            return new AuthResponseDto { IsSuccess = false, Message = "کد ملی یا رمز عبور اشتباه است." };
        }

        var (tokenString, expires) = GenerateJwtToken(user);
        var refreshToken = GenerateRefreshToken();

        // Save the refresh token to the database
        var refreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshToken,
            Expires = DateTime.UtcNow.AddDays(7) // Refresh token is valid for 7 days
        };
        await _context.RefreshTokens.AddAsync(refreshTokenEntity);
        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            IsSuccess = true,
            Message = "ورود موفقیت‌آمیز بود.",
            Token = tokenString,
            TokenExpiration = expires,
            RefreshToken = refreshToken
        };
    }

    // --- NEW METHOD ---
    public async Task<AuthResponseDto> RefreshTokenAsync(string expiredToken, string refreshToken)
    {
        var principal = GetPrincipalFromExpiredToken(expiredToken);
        if (principal?.Identity?.Name is null)
        {
            return new AuthResponseDto { IsSuccess = false, Message = "Invalid Token" };
        }

        var userId = Guid.Parse(principal.Identity.Name);
        var user = await _context.Users.FindAsync(userId);

        var savedRefreshToken = await _context.RefreshTokens
            .FirstOrDefaultAsync(rt => rt.Token == refreshToken && rt.UserId == userId && !rt.IsRevoked);

        if (user is null || savedRefreshToken is null || savedRefreshToken.Expires <= DateTime.UtcNow)
        {
            return new AuthResponseDto { IsSuccess = false, Message = "Invalid Refresh Token" };
        }

        // Revoke the old refresh token
        savedRefreshToken.IsRevoked = true;
        _context.RefreshTokens.Update(savedRefreshToken);

        // Generate new tokens
        var (newTokenString, newExpires) = GenerateJwtToken(user);
        var newRefreshTokenString = GenerateRefreshToken();

        // Save the new refresh token
        await _context.RefreshTokens.AddAsync(new RefreshToken
        {
            UserId = user.Id,
            Token = newRefreshTokenString,
            Expires = DateTime.UtcNow.AddDays(7)
        });
        await _context.SaveChangesAsync();

        return new AuthResponseDto
        {
            IsSuccess = true,
            Token = newTokenString,
            RefreshToken = newRefreshTokenString,
            TokenExpiration = newExpires
        };
    }

    // --- HELPER METHODS ---
    private (string token, DateTime expires) GenerateJwtToken(User user)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
        var expires = DateTime.UtcNow.AddMinutes(15); // Short-lived access token (15 minutes)

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Id.ToString()), // Use ClaimTypes.Name for user ID
            new Claim(JwtRegisteredClaimNames.Name, $"{user.FirstName} {user.LastName}"),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = expires,
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        return (tokenHandler.WriteToken(token), expires);
    }

    private string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);
        return Convert.ToBase64String(randomNumber);
    }

    private ClaimsPrincipal? GetPrincipalFromExpiredToken(string token)
    {
        var tokenValidationParameters = new TokenValidationParameters
        {
            ValidateAudience = true,
            ValidateIssuer = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"])),
            ValidateLifetime = false, // We don't care if the token is expired
            ValidIssuer = _configuration["Jwt:Issuer"],
            ValidAudience = _configuration["Jwt:Audience"],
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);
        if (securityToken is not JwtSecurityToken jwtSecurityToken || !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            return null;

        return principal;
    }
}
