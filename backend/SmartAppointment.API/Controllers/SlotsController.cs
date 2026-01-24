using Microsoft. AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SmartAppointment.Core.Entities;
using SmartAppointment.Infrastructure.Data;

namespace SmartAppointment.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SlotsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public SlotsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/slots
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Slot>>> GetSlots()
    {
        return await _context.Slots
            .Include(s => s. Doctor)
            .ToListAsync();
    }

    // GET: api/slots/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Slot>> GetSlot(int id)
    {
        var slot = await _context.Slots
            .Include(s => s. Doctor)
            .FirstOrDefaultAsync(s => s.Id == id);

        if (slot == null)
            return NotFound(new { message = "Slot not found" });

        return slot;
    }

    // GET:  api/slots/doctor/5
    [HttpGet("doctor/{doctorId}")]
    public async Task<ActionResult<IEnumerable<Slot>>> GetSlotsByDoctor(int doctorId)
    {
        var slots = await _context.Slots
            . Include(s => s.Doctor)
            .Where(s => s.DoctorId == doctorId)
            .OrderBy(s => s.StartTime)
            .ToListAsync();

        return slots;
    }

    // GET: api/slots/available? doctorId=5&date=2026-01-21
    [HttpGet("available")]
    public async Task<ActionResult<IEnumerable<Slot>>> GetAvailableSlots(
        [FromQuery] int?  doctorId,
        [FromQuery] DateTime? date)
    {
        var query = _context.Slots
            .Include(s => s.Doctor)
            .Where(s => s.IsAvailable);

        if (doctorId. HasValue)
        {
            query = query.Where(s => s.DoctorId == doctorId.Value);
        }

        if (date.HasValue)
        {
            var startOfDay = date.Value. Date;
            var endOfDay = startOfDay. AddDays(1);
            query = query.Where(s => s.StartTime >= startOfDay && s.StartTime < endOfDay);
        }

        var slots = await query
            .OrderBy(s => s.StartTime)
            .ToListAsync();

        return slots;
    }

    // POST:  api/slots
    [HttpPost]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<ActionResult<Slot>> CreateSlot([FromBody] SlotDto slotDto)
    {
        if (! ModelState.IsValid)
            return BadRequest(ModelState);

        // Validate doctor exists
        var doctorExists = await _context.Doctors. AnyAsync(d => d. Id == slotDto.DoctorId);
        if (!doctorExists)
            return BadRequest(new { message = "Doctor not found" });

        // Validate time slot
        if (slotDto.EndTime <= slotDto.StartTime)
            return BadRequest(new { message = "End time must be after start time" });

        // Check for overlapping slots
        var hasOverlap = await _context. Slots. AnyAsync(s =>
            s.DoctorId == slotDto.DoctorId &&
            s.StartTime < slotDto.EndTime &&
            s.EndTime > slotDto.StartTime);

        if (hasOverlap)
            return BadRequest(new { message = "This time slot overlaps with an existing slot" });

        var slot = new Slot
        {
            DoctorId = slotDto.DoctorId,
            StartTime = slotDto. StartTime,
            EndTime = slotDto.EndTime,
            IsAvailable = slotDto.IsAvailable
        };

        _context.Slots.Add(slot);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetSlot), new { id = slot.Id }, slot);
    }

    // PUT: api/slots/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> UpdateSlot(int id, [FromBody] SlotDto slotDto)
    {
        var slot = await _context.Slots.FindAsync(id);

        if (slot == null)
            return NotFound(new { message = "Slot not found" });

        // Validate time slot
        if (slotDto.EndTime <= slotDto. StartTime)
            return BadRequest(new { message = "End time must be after start time" });

        // Check for overlapping slots (excluding current slot)
        var hasOverlap = await _context. Slots.AnyAsync(s =>
            s.Id != id &&
            s.DoctorId == slotDto. DoctorId &&
            s.StartTime < slotDto. EndTime &&
            s.EndTime > slotDto.StartTime);

        if (hasOverlap)
            return BadRequest(new { message = "This time slot overlaps with an existing slot" });

        slot.DoctorId = slotDto. DoctorId;
        slot.StartTime = slotDto. StartTime;
        slot.EndTime = slotDto.EndTime;
        slot.IsAvailable = slotDto.IsAvailable;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (! await SlotExists(id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    // DELETE: api/slots/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> DeleteSlot(int id)
    {
        var slot = await _context. Slots.FindAsync(id);

        if (slot == null)
            return NotFound(new { message = "Slot not found" });

        // Check if slot has an appointment
        var hasAppointment = await _context. Appointments.AnyAsync(a => a.SlotId == id);
        if (hasAppointment)
            return BadRequest(new { message = "Cannot delete slot with existing appointment" });

        _context. Slots.Remove(slot);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    // PATCH: api/slots/5/availability
    [HttpPatch("{id}/availability")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> UpdateAvailability(int id, [FromBody] bool isAvailable)
    {
        var slot = await _context. Slots.FindAsync(id);

        if (slot == null)
            return NotFound(new { message = "Slot not found" });

        slot.IsAvailable = isAvailable;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> SlotExists(int id)
    {
        return await _context.Slots.AnyAsync(e => e.Id == id);
    }
}

// DTO
public class SlotDto
{
    public int DoctorId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAvailable { get; set; } = true;
}