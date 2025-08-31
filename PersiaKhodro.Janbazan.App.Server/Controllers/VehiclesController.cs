using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersiaKhodro.Janbazan.App.Server.Data; // Add this using
using PersiaKhodro.Janbazan.App.Server.DTOs;
using PersiaKhodro.Janbazan.App.Server.Entities; // Add this using
using PersiaKhodro.Janbazan.App.Server.Helpers;
using PersiaKhodro.Janbazan.App.Server.Services;

namespace PersiaKhodro.Janbazan.App.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class VehiclesController : ControllerBase
{
    private readonly IVehicleService _vehicleService;
    private readonly IFileStorageService _fileStorageService;
    private readonly ApplicationDbContext _context; // Inject DbContext for direct operations

    public VehiclesController(
        IVehicleService vehicleService,
        IFileStorageService fileStorageService,
        ApplicationDbContext context)
    {
        _vehicleService = vehicleService;
        _fileStorageService = fileStorageService;
        _context = context;
    }

    // GET: api/vehicles/my-vehicles
    [HttpGet("my-vehicles")]
    public async Task<IActionResult> GetMyVehicles()
    {
        var userId = User.GetUserId();
        var vehicles = await _vehicleService.GetUserVehiclesAsync(userId);
        return Ok(vehicles);
    }

    // POST: api/vehicles
    [HttpPost]
    public async Task<IActionResult> CreateVehicle([FromBody] CreateVehicleDto createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = User.GetUserId();
        var newVehicle = await _vehicleService.CreateVehicleAsync(userId, createDto);

        return CreatedAtAction(nameof(GetMyVehicles), new { id = newVehicle.Id }, newVehicle);
    }

    // --- NEW ENDPOINT FOR FILE UPLOAD ---
    // POST: api/vehicles/{vehicleId}/documents
    [HttpPost("{vehicleId}/documents")]
    public async Task<IActionResult> UploadDocument(Guid vehicleId, [FromForm] IFormFile file, [FromForm] DocumentType type)
    {
        var userId = User.GetUserId();
        var vehicle = await _context.Vehicles.FindAsync(vehicleId);

        // Ensure the vehicle exists and belongs to the logged-in user
        if (vehicle == null || vehicle.UserId != userId)
        {
            return NotFound("Vehicle not found or access denied.");
        }

        if (file == null || file.Length == 0)
        {
            return BadRequest("File is required.");
        }

        // Save the file using our service. The subfolder is the vehicle's ID for organization.
        var relativePath = await _fileStorageService.SaveFileAsync(file, vehicleId.ToString());

        var document = new Document
        {
            VehicleId = vehicleId,
            FileName = file.FileName,
            StoredFileName = Path.GetFileName(relativePath),
            FilePath = relativePath,
            ContentType = file.ContentType,
            FileSize = file.Length,
            Type = type
        };

        await _context.Documents.AddAsync(document);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Document uploaded successfully.", filePath = document.FilePath });
    }
}
