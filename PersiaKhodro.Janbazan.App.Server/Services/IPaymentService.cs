using PersiaKhodro.Janbazan.App.Server.DTOs;

namespace PersiaKhodro.Janbazan.App.Server.Services;

public interface IPaymentService
{
    Task<PaymentRequestResponseDto?> CreatePaymentRequestAsync(Guid vehicleId, Guid userId);
    Task<bool> VerifyPaymentAsync(PaymentCallbackDto callbackDto);
}