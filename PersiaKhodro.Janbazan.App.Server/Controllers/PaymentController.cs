using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using PersiaKhodro.Janbazan.App.Server.DTOs;
using PersiaKhodro.Janbazan.App.Server.Helpers;
using PersiaKhodro.Janbazan.App.Server.Services;

namespace PersiaKhodro.Janbazan.App.Server.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentController : ControllerBase
{
    private readonly IPaymentService _paymentService;

    public PaymentController(IPaymentService paymentService)
    {
        _paymentService = paymentService;
    }

    // POST: api/payment/request/{vehicleId}
    [HttpPost("request/{vehicleId}")]
    public async Task<IActionResult> RequestPayment(Guid vehicleId)
    {
        var userId = User.GetUserId();
        var response = await _paymentService.CreatePaymentRequestAsync(vehicleId, userId);

        if (response == null)
        {
            return Forbid(); // Access denied
        }

        return Ok(response);
    }

    // GET: api/payment/callback
    [HttpGet("callback")]
    [AllowAnonymous] // Callback from PSP does not have auth token
    public async Task<IActionResult> PaymentCallback([FromQuery] PaymentCallbackDto callbackDto)
    {
        var success = await _paymentService.VerifyPaymentAsync(callbackDto);

        if (success)
        {
            // Redirect user to a success page in the React app
            return Redirect("http://localhost:3000/payment-success");
        }

        // Redirect user to a failure page in the React app
        return Redirect("http://localhost:3000/payment-failure");
    }
}
