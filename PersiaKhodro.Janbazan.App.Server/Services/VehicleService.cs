using Microsoft.EntityFrameworkCore;
using PersiaKhodro.Janbazan.App.Server.Data;
using PersiaKhodro.Janbazan.App.Server.DTOs;
using PersiaKhodro.Janbazan.App.Server.Entities;

namespace PersiaKhodro.Janbazan.App.Server.Services;

public class VehicleService : IVehicleService
{
    private readonly ApplicationDbContext _context;

    public VehicleService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<VehicleDto> CreateVehicleAsync(Guid userId, CreateVehicleDto createDto)
    {
        var vehicle = new Vehicle
        {
            UserId = userId,
            Vin = createDto.Vin,
            ModelName = createDto.ModelName,
            ProductionYear = createDto.ProductionYear,
            PlateNumber = createDto.PlateNumber,
            Color = createDto.Color,
            Status = CaseStatus.Submitted // وضعیت اولیه پرونده
        };

        await _context.Vehicles.AddAsync(vehicle);
        await _context.SaveChangesAsync();

        return new VehicleDto
        {
            Id = vehicle.Id,
            Vin = vehicle.Vin,
            ModelName = vehicle.ModelName,
            ProductionYear = vehicle.ProductionYear,
            PlateNumber = vehicle.PlateNumber,
            Status = vehicle.Status.ToString()
        };
    }

    public async Task<IEnumerable<VehicleDto>> GetUserVehiclesAsync(Guid userId)
    {
        var vehicles = await _context.Vehicles
            .Where(v => v.UserId == userId)
            .Select(v => new VehicleDto
            {
                Id = v.Id,
                Vin = v.Vin,
                ModelName = v.ModelName,
                ProductionYear = v.ProductionYear,
                PlateNumber = v.PlateNumber,
                Status = v.Status.ToString()
            })
            .ToListAsync();

        return vehicles;
    }
}
