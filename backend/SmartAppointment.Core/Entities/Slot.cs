namespace SmartAppointment.Core. Entities;

public class Slot
{
    public int Id { get; set; }
    public int DoctorId { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime EndTime { get; set; }
    public bool IsAvailable { get; set; } = true;  // ← MISSING PROPERTY
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public Doctor Doctor { get; set; } = null!;
    public Appointment? Appointment { get; set; }
}