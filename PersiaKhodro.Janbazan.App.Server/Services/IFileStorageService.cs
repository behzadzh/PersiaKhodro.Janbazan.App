namespace PersiaKhodro.Janbazan.App.Server.Services;

public interface IFileStorageService
{
    Task<string> SaveFileAsync(IFormFile file, string subfolder);
}