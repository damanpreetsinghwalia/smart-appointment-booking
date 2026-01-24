using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft. EntityFrameworkCore;
using SmartAppointment.Core. Entities;
using SmartAppointment.Infrastructure.Data;

namespace SmartAppointment.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AppointmentsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public AppointmentsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/appointments
    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointments()
    {
        return await _context.Appointments
            .Include(a => a.Patient)
            .Include(a => a. Slot)
                .ThenInclude(s => s.Doctor)
            .ToListAsync();
    }

    // GET: api/appointments/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Appointment>> GetAppointment(int id)
    {
        var appointment = await _context.Appointments
            .Include(a => a. Patient)
            .Include(a => a.Slot)
                .ThenInclude(s => s.Doctor)
            .FirstOrDefaultAsync(a => a. Id == id);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found" });

        return appointment;
    }

    // GET: api/appointments/patient/{patientId}
    [HttpGet("patient/{patientId}")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByPatient(string patientId)
    {
        var appointments = await _context. Appointments
            .Include(a => a.Patient)
            .Include(a => a.Slot)
                .ThenInclude(s => s.Doctor)
            .Where(a => a. PatientId == patientId)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();

        return appointments;
    }

    // GET:  api/appointments/doctor/{doctorId}
    [HttpGet("doctor/{doctorId}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<ActionResult<IEnumerable<Appointment>>> GetAppointmentsByDoctor(int doctorId)
    {
        var appointments = await _context. Appointments
            .Include(a => a.Patient)
            .Include(a => a.Slot)
                .ThenInclude(s => s.Doctor)
            .Where(a => a. Slot.DoctorId == doctorId)
            .OrderByDescending(a => a.AppointmentDate)
            .ToListAsync();

        return appointments;
    }

    // POST: api/appointments
    [HttpPost]
    public async Task<ActionResult<Appointment>> CreateAppointment([FromBody] AppointmentDto appointmentDto)
    {
        if (! ModelState.IsValid)
            return BadRequest(ModelState);

        // Validate slot exists and is available
        var slot = await _context.Slots
            . Include(s => s.Doctor)
            .FirstOrDefaultAsync(s => s.Id == appointmentDto.SlotId);

        if (slot == null)
            return NotFound(new { message = "Slot not found" });

        if (! slot.IsAvailable)
            return BadRequest(new { message = "Slot is not available" });

        // Check if slot already has an appointment
        var existingAppointment = await _context. Appointments
            .AnyAsync(a => a.SlotId == appointmentDto.SlotId);

        if (existingAppointment)
            return BadRequest(new { message = "Slot is already booked" });

        // Validate patient exists
        var patientExists = await _context.Users. AnyAsync(u => u. Id == appointmentDto.PatientId);
        if (!patientExists)
            return BadRequest(new { message = "Patient not found" });

        var appointment = new Appointment
        {
            PatientId = appointmentDto.PatientId,
            SlotId = appointmentDto.SlotId,
            AppointmentDate = slot.StartTime,
            Status = AppointmentStatus.Scheduled,
            Reason = appointmentDto.Reason
        };

        _context. Appointments.Add(appointment);

        // Mark slot as unavailable
        slot.IsAvailable = false;

        await _context.SaveChangesAsync();

        // Load navigation properties for response
        await _context.Entry(appointment)
            .Reference(a => a.Patient)
            .LoadAsync();
        await _context.Entry(appointment)
            .Reference(a => a. Slot)
            .LoadAsync();

        return CreatedAtAction(nameof(GetAppointment), new { id = appointment.Id }, appointment);
    }

    // PUT: api/appointments/5/status
    [HttpPut("{id}/status")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> UpdateAppointmentStatus(int id, [FromBody] AppointmentStatus status)
    {
        var appointment = await _context.Appointments
            .Include(a => a. Slot)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found" });

        appointment.Status = status;

        // If cancelled or completed, make slot available again
        if (status == AppointmentStatus.Cancelled || status == AppointmentStatus. Completed)
        {
            appointment. Slot.IsAvailable = true;
        }

        await _context.SaveChangesAsync();

        return NoContent();
    }

    // DELETE: api/appointments/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> CancelAppointment(int id)
    {
        var appointment = await _context.Appointments
            .Include(a => a. Slot)
            .FirstOrDefaultAsync(a => a.Id == id);

        if (appointment == null)
            return NotFound(new { message = "Appointment not found" });

        if (appointment.Status == AppointmentStatus.Completed)
            return BadRequest(new { message = "Cannot cancel a completed appointment" });

        appointment.Status = AppointmentStatus.Cancelled;
        appointment.Slot.IsAvailable = true;

        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// DTO
public class AppointmentDto
{
    public string PatientId { get; set; } = string.Empty;
    public int SlotId { get; set; }
    public string Reason { get; set; } = string. Empty;
}