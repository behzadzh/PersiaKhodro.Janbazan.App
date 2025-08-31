using PersiaKhodro.Janbazan.App.Server.DTOs;

namespace PersiaKhodro.Janbazan.App.Server.Services;

public interface ICommentService
{
    Task<IEnumerable<CommentDto>> GetCommentsForVehicleAsync(Guid vehicleId, Guid userId);
    Task<CommentDto?> CreateCommentAsync(Guid vehicleId, Guid userId, CreateCommentDto createDto, bool isFromCompany);
}