using Microsoft.AspNetCore.Identity. EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using SmartAppointment.Core. Entities;

namespace SmartAppointment.Infrastructure.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets for entities
    public DbSet<Doctor> Doctors => Set<Doctor>();
    public DbSet<Slot> Slots => Set<Slot>();
    public DbSet<Appointment> Appointments => Set<Appointment>();
    public DbSet<Payment> Payments => Set<Payment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    base.OnModelCreating(modelBuilder);

    // Configure Doctor entity
    modelBuilder.Entity<Doctor>(entity =>
    {
        entity.HasKey(e => e.Id);
        entity.Property(e => e. FullName).IsRequired().HasMaxLength(100);
        entity.Property(e => e.Specialization).IsRequired().HasMaxLength(100);
        entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
        entity.Property(e => e.PhoneNumber).HasMaxLength(20);
        entity.Property(e => e.ConsultationFee).HasColumnType("decimal(18,2)");
    });

    // Configure Slot entity
    modelBuilder.Entity<Slot>(entity =>
    {
        entity.HasKey(e => e.Id);
        entity.HasOne(e => e.Doctor)
              .WithMany(d => d. Slots)
              .HasForeignKey(e => e.DoctorId)
              .OnDelete(DeleteBehavior. Cascade);
    });

    // Configure Appointment entity
    modelBuilder.Entity<Appointment>(entity =>
    {
        entity.HasKey(e => e.Id);
        
        // Relationship with Patient (ApplicationUser)
        entity.HasOne(e => e.Patient)
              .WithMany(u => u.Appointments)
              .HasForeignKey(e => e.PatientId)
              .OnDelete(DeleteBehavior.Restrict);

        // Relationship with Slot
        entity.HasOne(e => e.Slot)
              .WithOne(s => s.Appointment)
              .HasForeignKey<Appointment>(e => e.SlotId)
              .OnDelete(DeleteBehavior.Restrict);

        // Configure Status as enum
        entity.Property(e => e.Status)
              .HasConversion<string>()
              .HasMaxLength(50);

        entity.Property(e => e. Reason).HasMaxLength(500);
    });

    // Configure Payment entity
    modelBuilder.Entity<Payment>(entity =>
    {
        entity.HasKey(e => e.Id);
        
        entity.HasOne(e => e. Appointment)
              .WithOne(a => a.Payment)
              .HasForeignKey<Payment>(e => e.AppointmentId)
              .OnDelete(DeleteBehavior.Cascade);

        entity.Property(e => e.Amount).HasColumnType("decimal(18,2)");
        entity.Property(e => e.PaymentMethod).HasMaxLength(50);
        entity.Property(e => e. TransactionId).HasMaxLength(200);
        
        // Configure PaymentStatus as enum
        entity. Property(e => e.Status)
              .HasConversion<string>()
              .HasMaxLength(50);
    });
}
}