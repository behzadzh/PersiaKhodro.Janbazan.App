using System.Security.Claims;

namespace PersiaKhodro.Janbazan.App.Server.Helpers;

public static class ClaimsPrincipalExtensions
{
    /// <summary>
    /// Gets the user ID from the claims. Ensure to use this only in authorized endpoints.
    /// </summary>
    public static Guid GetUserId(this ClaimsPrincipal principal)
    {
        var userIdClaim = principal.FindFirstValue(ClaimTypes.NameIdentifier); // Or JwtRegisteredClaimNames.Sub
        if (string.IsNullOrEmpty(userIdClaim))
        {
            // This should not happen in an authorized context
            throw new InvalidOperationException("User ID claim not found in token.");
        }
        return Guid.Parse(userIdClaim);
    }
}
