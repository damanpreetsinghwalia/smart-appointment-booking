using Microsoft. AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft. EntityFrameworkCore;
using SmartAppointment.Core. Entities;
using SmartAppointment.Infrastructure.Data;

namespace SmartAppointment.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DoctorsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public DoctorsController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/doctors
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Doctor>>> GetDoctors()
    {
        return await _context.Doctors.ToListAsync();
    }

    // GET: api/doctors/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Doctor>> GetDoctor(int id)
    {
        var doctor = await _context. Doctors.FindAsync(id);

        if (doctor == null)
            return NotFound(new { message = "Doctor not found" });

        return doctor;
    }

    // GET: api/doctors/search? specialization=Cardiologist
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Doctor>>> SearchDoctors([FromQuery] string?  specialization)
    {
        var query = _context.Doctors.AsQueryable();

        if (!string.IsNullOrEmpty(specialization))
        {
            query = query.Where(d => d.Specialization. Contains(specialization));
        }

        return await query.ToListAsync();
    }

    // POST: api/doctors
    [HttpPost]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<ActionResult<Doctor>> CreateDoctor([FromBody] DoctorDto doctorDto)
    {
        if (! ModelState.IsValid)
            return BadRequest(ModelState);

        var doctor = new Doctor
        {
            FullName = doctorDto. FullName,
            Specialization = doctorDto.Specialization,
            Email = doctorDto.Email,
            PhoneNumber = doctorDto.PhoneNumber,
            ConsultationFee = doctorDto.ConsultationFee,
            IsAvailable = doctorDto.IsAvailable
        };

        _context.Doctors.Add(doctor);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetDoctor), new { id = doctor. Id }, doctor);
    }

    // PUT: api/doctors/5
    [HttpPut("{id}")]
    [Authorize(Roles = "Doctor,Admin")]
    public async Task<IActionResult> UpdateDoctor(int id, [FromBody] DoctorDto doctorDto)
    {
        var doctor = await _context.Doctors.FindAsync(id);

        if (doctor == null)
            return NotFound(new { message = "Doctor not found" });

        doctor.FullName = doctorDto.FullName;
        doctor.Specialization = doctorDto.Specialization;
        doctor.Email = doctorDto.Email;
        doctor.PhoneNumber = doctorDto.PhoneNumber;
        doctor.ConsultationFee = doctorDto.ConsultationFee;
        doctor.IsAvailable = doctorDto.IsAvailable;

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!await DoctorExists(id))
                return NotFound();
            throw;
        }

        return NoContent();
    }

    // DELETE: api/doctors/5
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteDoctor(int id)
    {
        var doctor = await _context.Doctors.FindAsync(id);

        if (doctor == null)
            return NotFound(new { message = "Doctor not found" });

        _context.Doctors.Remove(doctor);
        await _context. SaveChangesAsync();

        return NoContent();
    }

    private async Task<bool> DoctorExists(int id)
    {
        return await _context. Doctors.AnyAsync(e => e.Id == id);
    }
}

// DTO
public class DoctorDto
{
    public string FullName { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
    public bool IsAvailable { get; set; } = true;
}