namespace SmartAppointment.Core. Entities;

public class Appointment
{
    public int Id { get; set; }
    public string PatientId { get; set; } = string.Empty;
    public int SlotId { get; set; }
    public DateTime AppointmentDate { get; set; }  // ← ADDED
    public AppointmentStatus Status { get; set; } = AppointmentStatus.Scheduled;
    public string?  Reason { get; set; }  // ← ADDED
    public DateTime CreatedAt { get; set; } = DateTime. UtcNow;

    // Navigation properties
    public ApplicationUser Patient { get; set; } = null!;
    public Slot Slot { get; set; } = null!;
    public Payment?  Payment { get; set; }
}

public enum AppointmentStatus
{
    Scheduled,
    Confirmed,
    Completed,
    Cancelled
}