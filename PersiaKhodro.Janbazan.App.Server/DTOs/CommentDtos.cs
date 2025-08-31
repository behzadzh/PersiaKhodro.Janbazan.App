using System.ComponentModel.DataAnnotations;

namespace PersiaKhodro.Janbazan.App.Server.DTOs;

/// <summary>
/// DTO for creating a new comment.
/// </summary>
public class CreateCommentDto
{
    [Required]
    [MaxLength(1000)]
    public string Content { get; set; }
}

/// <summary>
/// DTO for displaying a comment.
/// </summary>
public class CommentDto
{
    public Guid Id { get; set; }
    public string Content { get; set; }
    public bool IsFromCompany { get; set; }
    public DateTime CreatedAt { get; set; }
    public string AuthorName { get; set; } // Name of the user or "Company"
}
