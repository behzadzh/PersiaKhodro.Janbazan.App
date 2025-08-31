using Microsoft.EntityFrameworkCore;
using PersiaKhodro.Janbazan.App.Server.Data;
using PersiaKhodro.Janbazan.App.Server.DTOs;
using PersiaKhodro.Janbazan.App.Server.Entities;

namespace PersiaKhodro.Janbazan.App.Server.Services;

public class PaymentService : IPaymentService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public PaymentService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<PaymentRequestResponseDto?> CreatePaymentRequestAsync(Guid vehicleId, Guid userId)
    {
        var vehicle = await _context.Vehicles.FindAsync(vehicleId);
        if (vehicle == null || vehicle.UserId != userId)
        {
            return null; // Access denied or vehicle not found
        }

        // For this example, we use a fixed amount. In a real app, this would be calculated.
        decimal amount = 500000; // 500,000 Toman

        var invoice = new PaymentInvoice
        {
            VehicleId = vehicleId,
            Amount = amount,
            IsPaid = false
        };

        await _context.PaymentInvoices.AddAsync(invoice);

        // Change the vehicle status to AwaitingPayment
        vehicle.Status = CaseStatus.AwaitingPayment;
        _context.Vehicles.Update(vehicle);

        await _context.SaveChangesAsync();

        // --- MOCK PAYMENT URL ---
        // In a real application, you would call the PSP's API here to get a real payment URL.
        // We simulate this by creating a URL to our own callback endpoint.
        var callbackUrl = $"https://yourapi.com/api/payment/callback?InvoiceId={invoice.Id}&IsSuccess=true&TraceId=MOCK_{Guid.NewGuid()}";

        return new PaymentRequestResponseDto
        {
            InvoiceId = invoice.Id,
            PaymentUrl = callbackUrl
        };
    }

    public async Task<bool> VerifyPaymentAsync(PaymentCallbackDto callbackDto)
    {
        var invoice = await _context.PaymentInvoices.FindAsync(callbackDto.InvoiceId);

        if (invoice == null || invoice.IsPaid)
        {
            return false; // Invoice not found or already paid
        }

        if (callbackDto.IsSuccess)
        {
            // In a real app, you would double-check with the PSP here.
            invoice.IsPaid = true;
            invoice.PaidAt = DateTime.UtcNow;
            invoice.PaymentGatewayTraceId = callbackDto.TraceId;

            var vehicle = await _context.Vehicles.FindAsync(invoice.VehicleId);
            if (vehicle != null)
            {
                vehicle.Status = CaseStatus.Completed; // Or another appropriate status
                _context.Vehicles.Update(vehicle);
            }

            _context.PaymentInvoices.Update(invoice);
            await _context.SaveChangesAsync();
            return true;
        }

        return false;
    }
}
