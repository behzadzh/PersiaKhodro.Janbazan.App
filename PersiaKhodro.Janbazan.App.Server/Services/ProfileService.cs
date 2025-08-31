using Microsoft.EntityFrameworkCore;
using PersiaKhodro.Janbazan.App.Server.Data;
using PersiaKhodro.Janbazan.App.Server.DTOs;

namespace PersiaKhodro.Janbazan.App.Server.Services;

public class ProfileService : IProfileService
{
    private readonly ApplicationDbContext _context;

    public ProfileService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserProfileDto?> GetProfileAsync(Guid userId)
    {
        var user = await _context.Users
            .Where(u => u.Id == userId)
            .Select(u => new UserProfileDto
            {
                FirstName = u.FirstName,
                LastName = u.LastName,
                NationalCode = u.NationalCode,
                MobileNumber = u.MobileNumber,
                Email = u.Email,
                Address = u.Address,
                PostalCode = u.PostalCode,
                DateOfBirth = u.DateOfBirth
            })
            .FirstOrDefaultAsync();

        return user;
    }

    public async Task<bool> UpdateProfileAsync(Guid userId, UpdateProfileDto updateDto)
    {
        var user = await _context.Users.FindAsync(userId);

        if (user == null)
        {
            return false;
        }

        user.FirstName = updateDto.FirstName;
        user.LastName = updateDto.LastName;
        user.Email = updateDto.Email;
        user.Address = updateDto.Address;
        user.PostalCode = updateDto.PostalCode;

        _context.Users.Update(user);
        await _context.SaveChangesAsync();

        return true;
    }
}
