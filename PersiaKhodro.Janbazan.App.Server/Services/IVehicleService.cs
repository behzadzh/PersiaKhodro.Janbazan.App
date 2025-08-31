using PersiaKhodro.Janbazan.App.Server.DTOs;

namespace PersiaKhodro.Janbazan.App.Server.Services;

public interface IVehicleService
{
    Task<VehicleDto> CreateVehicleAsync(Guid userId, CreateVehicleDto createDto);
    Task<IEnumerable<VehicleDto>> GetUserVehiclesAsync(Guid userId);
}