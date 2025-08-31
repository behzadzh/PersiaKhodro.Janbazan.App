namespace PersiaKhodro.Janbazan.App.Server.Entities;

public class Document
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string FileName { get; set; } // Original file name
    public string StoredFileName { get; set; } // e.g., a GUID to prevent conflicts
    public string FilePath { get; set; } // Relative path for storage
    public long FileSize { get; set; }
    public string ContentType { get; set; }
    public DocumentType Type { get; set; }
    public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

    // Foreign Key to Vehicle
    public Guid VehicleId { get; set; }
    public virtual Vehicle Vehicle { get; set; }
}

public enum DocumentType
{
    DisabilityCard,
    VehicleCard,
    Contract,
    Other
}
