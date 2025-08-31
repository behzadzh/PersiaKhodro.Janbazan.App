using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersiaKhodro.Janbazan.App.Server.DTOs;
using PersiaKhodro.Janbazan.App.Server.Helpers; // Import the helper
using PersiaKhodro.Janbazan.App.Server.Services;
using System.Security.Claims;

namespace PersiaKhodro.Janbazan.App.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize] // This entire controller requires authentication
public class ProfileController : ControllerBase
{
    private readonly IProfileService _profileService;

    public ProfileController(IProfileService profileService)
    {
        _profileService = profileService;
    }

    // GET: api/profile/me
    [HttpGet("me")]
    public async Task<IActionResult> GetMyProfile()
    {
        var userId = User.GetUserId(); // Using our helper to get the logged-in user's ID
        var profile = await _profileService.GetProfileAsync(userId);

        if (profile == null)
        {
            return NotFound();
        }

        return Ok(profile);
    }

    // PUT: api/profile/me
    [HttpPut("me")]
    public async Task<IActionResult> UpdateMyProfile([FromBody] UpdateProfileDto updateDto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = User.GetUserId();
        var success = await _profileService.UpdateProfileAsync(userId, updateDto);

        if (!success)
        {
            return NotFound();
        }

        return NoContent(); // 204 No Content is a standard response for a successful update
    }
}
