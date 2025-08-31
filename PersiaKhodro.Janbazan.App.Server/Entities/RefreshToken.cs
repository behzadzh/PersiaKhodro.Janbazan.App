namespace PersiaKhodro.Janbazan.App.Server.Entities;

public class RefreshToken
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public string Token { get; set; }
    public DateTime Expires { get; set; }
    public bool IsRevoked { get; set; }

    // Navigation Property
    public virtual User User { get; set; }
}
