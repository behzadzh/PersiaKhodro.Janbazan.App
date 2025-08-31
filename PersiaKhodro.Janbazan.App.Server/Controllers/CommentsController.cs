using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersiaKhodro.Janbazan.App.Server.DTOs;
using PersiaKhodro.Janbazan.App.Server.Helpers;
using PersiaKhodro.Janbazan.App.Server.Services;

namespace PersiaKhodro.Janbazan.App.Server.Controllers;

[ApiController]
[Route("api/vehicles/{vehicleId}/comments")] // Nested route under vehicles
[Authorize]
public class CommentsController : ControllerBase
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        _commentService = commentService;
    }

    // GET: api/vehicles/{vehicleId}/comments
    [HttpGet]
    public async Task<IActionResult> GetComments(Guid vehicleId)
    {
        var userId = User.GetUserId();
        var comments = await _commentService.GetCommentsForVehicleAsync(vehicleId, userId);
        return Ok(comments);
    }

    // POST: api/vehicles/{vehicleId}/comments
    [HttpPost]
    public async Task<IActionResult> PostComment(Guid vehicleId, [FromBody] CreateCommentDto createDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = User.GetUserId();
        // For this example, we assume only the user can comment.
        // In a real app, you'd check if the user is an admin to set 'isFromCompany' to true.
        var newComment = await _commentService.CreateCommentAsync(vehicleId, userId, createDto, isFromCompany: false);

        if (newComment == null)
        {
            return Forbid(); // User does not have access to this vehicle
        }

        return CreatedAtAction(nameof(GetComments), new { vehicleId = vehicleId, id = newComment.Id }, newComment);
    }
}
