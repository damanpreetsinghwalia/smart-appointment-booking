using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft. EntityFrameworkCore;
using SmartAppointment.Core. Entities;
using SmartAppointment.Infrastructure.Data;

namespace SmartAppointment.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PaymentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public PaymentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/payments
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<Payment>>> GetPayments()
    {
        return await _context.Payments
            .Include(p => p.Appointment)
                .ThenInclude(a => a.Patient)
            .Include(p => p.Appointment)
                .ThenInclude(a => a.Slot)
                    .ThenInclude(s => s.Doctor)
            .ToListAsync();
    }

    // GET: api/payments/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Payment>> GetPayment(int id)
    {
        var payment = await _context.Payments
            . Include(p => p.Appointment)
                .ThenInclude(a => a.Patient)
            .Include(p => p. Appointment)
                .ThenInclude(a => a. Slot)
                    .ThenInclude(s => s.Doctor)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (payment == null)
            return NotFound(new { message = "Payment not found" });

        return payment;
    }

    // GET: api/payments/appointment/5
    [HttpGet("appointment/{appointmentId}")]
    public async Task<ActionResult<Payment>> GetPaymentByAppointment(int appointmentId)
    {
        var payment = await _context.Payments
            .Include(p => p. Appointment)
            .FirstOrDefaultAsync(p => p. AppointmentId == appointmentId);

        if (payment == null)
            return NotFound(new { message = "Payment not found for this appointment" });

        return payment;
    }

    // POST: api/payments
    [HttpPost]
    public async Task<ActionResult<Payment>> CreatePayment([FromBody] PaymentDto paymentDto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        // Validate appointment exists
        var appointment = await _context.Appointments
            .Include(a => a. Slot)
                .ThenInclude(s => s.Doctor)
            .FirstOrDefaultAsync(a => a. Id == paymentDto.AppointmentId);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found" });

        // Check if payment already exists for this appointment
        var existingPayment = await _context.Payments
            .AnyAsync(p => p.AppointmentId == paymentDto. AppointmentId);

        if (existingPayment)
            return BadRequest(new { message = "Payment already exists for this appointment" });

        // Calculate amount from doctor's consultation fee
        var amount = paymentDto.Amount > 0 
            ? paymentDto.Amount 
            : appointment.Slot.Doctor.ConsultationFee;

        var payment = new Payment
        {
            AppointmentId = paymentDto.AppointmentId,
            Amount = amount,
            PaymentMethod = paymentDto.PaymentMethod,
            TransactionId = paymentDto.TransactionId,
            Status = PaymentStatus.Pending,
            PaymentDate = DateTime.UtcNow
        };

        _context.Payments.Add(payment);
        await _context.SaveChangesAsync();

        // Load navigation properties for response
        await _context.Entry(payment)
            .Reference(p => p.Appointment)
            .LoadAsync();

        return CreatedAtAction(nameof(GetPayment), new { id = payment.Id }, payment);
    }

    // PUT: api/payments/5/status
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> UpdatePaymentStatus(int id, [FromBody] PaymentStatusDto statusDto)
    {
        var payment = await _context.Payments
            .Include(p => p. Appointment)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (payment == null)
            return NotFound(new { message = "Payment not found" });

        payment.Status = statusDto.Status;

        // If payment completed, update appointment status to Confirmed
        if (statusDto.Status == PaymentStatus. Completed)
        {
            payment.Appointment.Status = AppointmentStatus.Confirmed;
        }

        // If payment failed, you might want to cancel the appointment
        if (statusDto.Status == PaymentStatus.Failed && statusDto.CancelAppointmentOnFailure)
        {
            payment.Appointment.Status = AppointmentStatus.Cancelled;
            payment.Appointment. Slot.IsAvailable = true;
        }

        await _context. SaveChangesAsync();

        return NoContent();
    }

    // POST: api/payments/5/refund
    [HttpPost("{id}/refund")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> RefundPayment(int id)
    {
        var payment = await _context.Payments
            .Include(p => p. Appointment)
                .ThenInclude(a => a.Slot)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (payment == null)
            return NotFound(new { message = "Payment not found" });

        if (payment.Status != PaymentStatus.Completed)
            return BadRequest(new { message = "Can only refund completed payments" });

        payment.Status = PaymentStatus.Refunded;
        payment.Appointment. Status = AppointmentStatus. Cancelled;
        payment.Appointment.Slot.IsAvailable = true;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Payment refunded successfully" });
    }

    // DELETE: api/payments/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeletePayment(int id)
    {
        var payment = await _context.Payments. FindAsync(id);

        if (payment == null)
            return NotFound(new { message = "Payment not found" });

        _context.Payments.Remove(payment);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// DTOs
public class PaymentDto
{
    public int AppointmentId { get; set; }
    public decimal Amount { get; set; } // Optional, will use doctor's fee if 0
    public string PaymentMethod { get; set; } = string.Empty;
    public string?  TransactionId { get; set; }
}

public class PaymentStatusDto
{
    public PaymentStatus Status { get; set; }
    public bool CancelAppointmentOnFailure { get; set; } = false;
}