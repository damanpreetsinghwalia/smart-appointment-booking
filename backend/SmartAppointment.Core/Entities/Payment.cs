namespace SmartAppointment.Core. Entities;

public class Payment
{
    public int Id { get; set; }
    public int AppointmentId { get; set; }
    public decimal Amount { get; set; }
    public string PaymentMethod { get; set; } = string.Empty; // e.g., "Card", "Cash", "UPI"
    public string?  TransactionId { get; set; }
    public PaymentStatus Status { get; set; } = PaymentStatus.Pending;
    public DateTime PaymentDate { get; set; } = DateTime.UtcNow;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation property
    public Appointment Appointment { get; set; } = null! ;
}

public enum PaymentStatus
{
    Pending,
    Completed,
    Failed,
    Refunded
}