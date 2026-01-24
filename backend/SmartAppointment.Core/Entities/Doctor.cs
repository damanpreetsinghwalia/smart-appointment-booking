namespace SmartAppointment.Core. Entities;

public class Doctor
{
    public int Id { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string Specialization { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public decimal ConsultationFee { get; set; }
    public bool IsAvailable { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    public ICollection<Slot> Slots { get; set; } = new List<Slot>();
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}