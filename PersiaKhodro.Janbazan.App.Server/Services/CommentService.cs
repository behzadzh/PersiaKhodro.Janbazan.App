using Microsoft.EntityFrameworkCore;
using PersiaKhodro.Janbazan.App.Server.Data;
using PersiaKhodro.Janbazan.App.Server.DTOs;
using PersiaKhodro.Janbazan.App.Server.Entities;

namespace PersiaKhodro.Janbazan.App.Server.Services;

public class CommentService : ICommentService
{
    private readonly ApplicationDbContext _context;

    public CommentService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<CommentDto>> GetCommentsForVehicleAsync(Guid vehicleId, Guid userId)
    {
        // First, ensure the user has access to this vehicle's comments
        var vehicle = await _context.Vehicles.FindAsync(vehicleId);
        if (vehicle == null || vehicle.UserId != userId)
        {
            // In a real app with admin roles, you would check for admin role here too.
            return new List<CommentDto>(); // Return empty list if no access
        }

        var comments = await _context.Comments
            .Where(c => c.VehicleId == vehicleId)
            .OrderBy(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                IsFromCompany = c.IsFromCompany,
                // If it's a company comment, show "Company", otherwise find the user's name.
                AuthorName = c.IsFromCompany ? "پشتیبانی شرکت" : $"{vehicle.User.FirstName} {vehicle.User.LastName}"
            })
            .ToListAsync();

        return comments;
    }

    public async Task<CommentDto?> CreateCommentAsync(Guid vehicleId, Guid userId, CreateCommentDto createDto, bool isFromCompany)
    {
        var vehicle = await _context.Vehicles.Include(v => v.User).FirstOrDefaultAsync(v => v.Id == vehicleId);
        if (vehicle == null || vehicle.UserId != userId)
        {
            // Check for admin role would go here in a real app
            return null; // No access
        }

        var comment = new Comment
        {
            VehicleId = vehicleId,
            AuthorId = userId,
            Content = createDto.Content,
            IsFromCompany = isFromCompany
        };

        await _context.Comments.AddAsync(comment);
        await _context.SaveChangesAsync();

        return new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            IsFromCompany = comment.IsFromCompany,
            AuthorName = isFromCompany ? "پشتیبانی شرکت" : $"{vehicle.User.FirstName} {vehicle.User.LastName}"
        };
    }
}
