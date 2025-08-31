using PersiaKhodro.Janbazan.App.Server.DTOs;

namespace PersiaKhodro.Janbazan.App.Server.Services;

public interface IProfileService
{
    Task<UserProfileDto?> GetProfileAsync(Guid userId);
    Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileDto updateDto);
}