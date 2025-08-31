using PersiaKhodro.Janbazan.App.Server.DTOs;

namespace PersiaKhodro.Janbazan.App.Server.Services;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterUserDto registerDto);
    Task<AuthResponseDto> LoginAsync(LoginUserDto loginDto);

    // Add this line
    Task<AuthResponseDto> RefreshTokenAsync(string expiredToken, string refreshToken);
}