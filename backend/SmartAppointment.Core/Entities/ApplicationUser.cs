using Microsoft.AspNetCore.Identity;

namespace SmartAppointment.Core.Entities;

public class ApplicationUser : IdentityUser
{
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = "Patient"; // Patient or Doctor
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}