namespace PersiaKhodro.Janbazan.App.Server.Services;

public class LocalFileStorageService : IFileStorageService
{
    private readonly string _basePath;
    private readonly IWebHostEnvironment _env;

    public LocalFileStorageService(IConfiguration configuration, IWebHostEnvironment env)
    {
        _env = env;
        
        // Create wwwroot directory if it doesn't exist
        var wwwrootPath = Path.Combine(_env.ContentRootPath, "wwwroot");
        if (!Directory.Exists(wwwrootPath))
        {
            Directory.CreateDirectory(wwwrootPath);
        }
        
        _basePath = Path.Combine(wwwrootPath, "uploads");
        
        // Ensure uploads directory exists
        if (!Directory.Exists(_basePath))
        {
            Directory.CreateDirectory(_basePath);
        }
    }

    public async Task<string> SaveFileAsync(IFormFile file, string subfolder)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty");

        var folderPath = Path.Combine(_basePath, subfolder);
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        var uniqueFileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
        var filePath = Path.Combine(folderPath, uniqueFileName);

        await using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        // Return the relative URL path to be stored in DB
        return Path.Combine("uploads", subfolder, uniqueFileName).Replace("\\", "/");
    }
}
