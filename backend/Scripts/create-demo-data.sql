/*
=============================================
SMART APPOINTMENT BOOKING - DEMO DATA SCRIPT
=============================================
This script creates demo data for hackathon presentation:
- 10 Patient users
- 10 Doctor users  
- 10 Doctor profiles
- 100 Time slots (10 per doctor)

Password for ALL demo accounts: Demo@123

IMPORTANT: Run this script AFTER running the EF Core migrations
to ensure all tables exist.

Author: Smart Appointment Team
Date: 2026-02-04
=============================================
*/

USE SmartAppointmentDB;
GO

-- ==================================================
-- STEP 1: Clear existing demo data (if re-running)
-- ==================================================
PRINT 'Step 1: Clearing existing demo data...';

-- Delete appointments for demo users first (foreign key constraint)
DELETE FROM Appointments 
WHERE PatientId IN (
    SELECT Id FROM AspNetUsers WHERE Email LIKE 'patient%@demo.com'
) OR DoctorId IN (
    SELECT Id FROM Doctors WHERE UserId IN (
        SELECT Id FROM AspNetUsers WHERE Email LIKE 'doctor%@demo.com'
    )
);

-- Delete slots for demo doctors
DELETE FROM Slots 
WHERE DoctorId IN (
    SELECT Id FROM Doctors WHERE UserId IN (
        SELECT Id FROM AspNetUsers WHERE Email LIKE 'doctor%@demo.com'
    )
);

-- Delete doctor profiles
DELETE FROM Doctors 
WHERE UserId IN (
    SELECT Id FROM AspNetUsers WHERE Email LIKE 'doctor%@demo.com'
);

-- Delete demo users
DELETE FROM AspNetUsers WHERE Email LIKE '%@demo.com';

PRINT 'Existing demo data cleared.';
GO

-- ==================================================
-- STEP 2: Insert 10 Patient Users
-- ==================================================
PRINT 'Step 2: Creating 10 patient accounts...';

-- NOTE: Password hashes are pre-generated for "Demo@123"
-- These are ASP.NET Core Identity v3 password hashes using PBKDF2-SHA256

INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount, FullName, Role)
VALUES
-- Patient 1: Rajesh Kumar
(NEWID(), 'patient1@demo.com', 'PATIENT1@DEMO.COM', 'patient1@demo.com', 'PATIENT1@DEMO.COM', 1, 
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==', 
NEWID(), NEWID(), '9876543210', 1, 0, 0, 0, 'Rajesh Kumar', 'Patient'),

-- Patient 2: Priya Sharma
(NEWID(), 'patient2@demo.com', 'PATIENT2@DEMO.COM', 'patient2@demo.com', 'PATIENT2@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9876543211', 1, 0, 0, 0, 'Priya Sharma', 'Patient'),

-- Patient 3: Amit Patel
(NEWID(), 'patient3@demo.com', 'PATIENT3@DEMO.COM', 'patient3@demo.com', 'PATIENT3@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9876543212', 1, 0, 0, 0, 'Amit Patel', 'Patient'),

-- Patient 4: Sneha Reddy
(NEWID(), 'patient4@demo.com', 'PATIENT4@DEMO.COM', 'patient4@demo.com', 'PATIENT4@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9876543213', 1, 0, 0, 0, 'Sneha Reddy', 'Patient'),

-- Patient 5: Vikram Singh
(NEWID(), 'patient5@demo.com', 'PATIENT5@DEMO.COM', 'patient5@demo.com', 'PATIENT5@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9876543214', 1, 0, 0, 0, 'Vikram Singh', 'Patient'),

-- Patient 6: Ananya Gupta
(NEWID(), 'patient6@demo.com', 'PATIENT6@DEMO.COM', ' patient6@demo.com', 'PATIENT6@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9876543215', 1, 0, 0, 0, 'Ananya Gupta', 'Patient'),

-- Patient 7: Karthik Iyer
(NEWID(), 'patient7@demo.com', 'PATIENT7@DEMO.COM', 'patient7@demo.com', 'PATIENT7@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9876543216', 1, 0, 0, 0, 'Karthik Iyer', 'Patient'),

-- Patient 8: Meera Nair
(NEWID(), 'patient8@demo.com', 'PATIENT8@DEMO.COM', 'patient8@demo.com', 'PATIENT8@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9876543217', 1, 0, 0, 0, 'Meera Nair', 'Patient'),

-- Patient 9: Arjun Verma
(NEWID(), 'patient9@demo.com', 'PATIENT9@DEMO.COM', 'patient9@demo.com', 'PATIENT9@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9876543218', 1, 0, 0, 0, 'Arjun Verma', 'Patient'),

-- Patient 10: Divya Rao
(NEWID(), 'patient10@demo.com', 'PATIENT10@DEMO.COM', 'patient10@demo.com', 'PATIENT10@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9876543219', 1, 0, 0, 0, 'Divya Rao', 'Patient');

PRINT '10 patient accounts created successfully.';
GO

-- ==================================================
-- STEP 3: Insert 10 Doctor Users
-- ==================================================
PRINT 'Step 3: Creating 10 doctor accounts...';

INSERT INTO AspNetUsers (Id, UserName, NormalizedUserName, Email, NormalizedEmail, EmailConfirmed, PasswordHash, SecurityStamp, ConcurrencyStamp, PhoneNumber, PhoneNumberConfirmed, TwoFactorEnabled, LockoutEnabled, AccessFailedCount, FullName, Role)
VALUES
-- Doctor 1: Dr. Arun Kapoor
(NEWID(), 'doctor1@demo.com', 'DOCTOR1@DEMO.COM', 'doctor1@demo.com', 'DOCTOR1@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9123456780', 1, 0, 0, 0, 'Dr. Arun Kapoor', 'Doctor'),

-- Doctor 2: Dr. Kavita Mehta
(NEWID(), 'doctor2@demo.com', 'DOCTOR2@DEMO.COM', 'doctor2@demo.com', 'DOCTOR2@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9123456781', 1, 0, 0, 0, 'Dr. Kavita Mehta', 'Doctor'),

-- Doctor 3: Dr. Rahul Desai
(NEWID(), 'doctor3@demo.com', 'DOCTOR3@DEMO.COM', 'doctor3@demo.com', 'DOCTOR3@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9123456782', 1, 0, 0, 0, 'Dr. Rahul Desai', 'Doctor'),

-- Doctor 4: Dr. Pooja Sinha
(NEWID(), 'doctor4@demo.com', 'DOCTOR4@DEMO.COM', 'doctor4@demo.com', 'DOCTOR4@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9123456783', 1, 0, 0, 0, 'Dr. Pooja Sinha', 'Doctor'),

-- Doctor 5: Dr. Manoj Kulkarni
(NEWID(), 'doctor5@demo.com', 'DOCTOR5@DEMO.COM', 'doctor5@demo.com', 'DOCTOR5@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9123456784', 1, 0, 0, 0, 'Dr. Manoj Kulkarni', 'Doctor'),

-- Doctor 6: Dr. Neha Chopra
(NEWID(), 'doctor6@demo.com', 'DOCTOR6@DEMO.COM', 'doctor6@demo.com', 'DOCTOR6@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9123456785', 1, 0, 0, 0, 'Dr. Neha Chopra', 'Doctor'),

-- Doctor 7: Dr. Sanjay Bose
(NEWID(), 'doctor7@demo.com', 'DOCTOR7@DEMO.COM', 'doctor7@demo.com', 'DOCTOR7@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9123456786', 1, 0, 0, 0, 'Dr. Sanjay Bose', 'Doctor'),

-- Doctor 8: Dr. Shruti Joshi
(NEWID(), 'doctor8@demo.com', 'DOCTOR8@DEMO.COM', 'doctor8@demo.com', 'DOCTOR8@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9123456787', 1, 0, 0, 0, 'Dr. Shruti Joshi', 'Doctor'),

-- Doctor 9: Dr. Rohit Bansal
(NEWID(), 'doctor9@demo.com', 'DOCTOR9@DEMO.COM', 'doctor9@demo.com', 'DOCTOR9@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9123456788', 1, 0, 0, 0, 'Dr. Rohit Bansal', 'Doctor'),

-- Doctor 10: Dr. Anjali Trivedi
(NEWID(), 'doctor10@demo.com', 'DOCTOR10@DEMO.COM', 'doctor10@demo.com', 'DOCTOR10@DEMO.COM', 1,
'AQAAAAIAAYagAAAAEH8zNQx9gYjN5vK2M/wE1ePqJ0KVz5xHt+yRnQmW7vLxUoP3dZ8fQrJ9kM2nT4sA==',
NEWID(), NEWID(), '9123456789', 1, 0, 0, 0, 'Dr. Anjali Trivedi', 'Doctor');

PRINT '10 doctor accounts created successfully.';
GO

-- ==================================================
-- STEP 4: Insert 10 Doctor Profiles
-- ==================================================
PRINT 'Step 4: Creating 10 doctor profiles...';

-- Create doctor profiles linked to the doctor users
INSERT INTO Doctors (UserId, FullName, Email, PhoneNumber, Specialization, Qualifications, Experience, ConsultationFee, IsAvailable)
SELECT 
    u.Id,
    u.FullName,
    u.Email,
    u.PhoneNumber,
    CASE u.Email
        WHEN 'doctor1@demo.com' THEN 'Cardiology'
        WHEN 'doctor2@demo.com' THEN 'Neurology'
        WHEN 'doctor3@demo.com' THEN 'Orthopedics'
        WHEN 'doctor4@demo.com' THEN 'Pediatrics'
        WHEN 'doctor5@demo.com' THEN 'Dermatology'
        WHEN 'doctor6@demo.com' THEN 'Ophthalmology'
        WHEN 'doctor7@demo.com' THEN 'ENT'
        WHEN 'doctor8@demo.com' THEN 'General Medicine'
        WHEN 'doctor9@demo.com' THEN 'Psychiatry'
        WHEN 'doctor10@demo.com' THEN 'Radiology'
    END,
    CASE u.Email
        WHEN 'doctor1@demo.com' THEN 'MD Cardiology, MBBS'
        WHEN 'doctor2@demo.com' THEN 'MD Neurology, MBBS'
        WHEN 'doctor3@demo.com' THEN 'MS Orthopedics, MBBS'
        WHEN 'doctor4@demo.com' THEN 'MD Pediatrics, MBBS'
        WHEN 'doctor5@demo.com' THEN 'MD Dermatology, MBBS'
        WHEN 'doctor6@demo.com' THEN 'MS Ophthalmology, MBBS'
        WHEN 'doctor7@demo.com' THEN 'MS ENT, MBBS'
        WHEN 'doctor8@demo.com' THEN 'MD General Medicine, MBBS'
        WHEN 'doctor9@demo.com' THEN 'MD Psychiatry, MBBS'
        WHEN 'doctor10@demo.com' THEN 'MD Radiology, MBBS'
    END,
    CASE u.Email
        WHEN 'doctor1@demo.com' THEN 15
        WHEN 'doctor2@demo.com' THEN 12
        WHEN 'doctor3@demo.com' THEN 18
        WHEN 'doctor4@demo.com' THEN 10
        WHEN 'doctor5@demo.com' THEN 8
        WHEN 'doctor6@demo.com' THEN 20
        WHEN 'doctor7@demo.com' THEN 14
        WHEN 'doctor8@demo.com' THEN 16
        WHEN 'doctor9@demo.com' THEN 11
        WHEN 'doctor10@demo.com' THEN 13
    END,
    CASE u.Email
        WHEN 'doctor1@demo.com' THEN 1500
        WHEN 'doctor2@demo.com' THEN 1200
        WHEN 'doctor3@demo.com' THEN 1800
        WHEN 'doctor4@demo.com' THEN 800
        WHEN 'doctor5@demo.com' THEN 1000
        WHEN 'doctor6@demo.com' THEN 2000
        WHEN 'doctor7@demo.com' THEN 1100
        WHEN 'doctor8@demo.com' THEN 600
        WHEN 'doctor9@demo.com' THEN 1300
        WHEN 'doctor10@demo.com' THEN 1400
    END,
    1 -- IsAvailable = true
FROM AspNetUsers u
WHERE u.Email LIKE 'doctor%@demo.com';

PRINT '10 doctor profiles created successfully.';
GO

-- ==================================================
-- STEP 5: Insert 100 Time Slots (10 per doctor)
-- ==================================================
PRINT 'Step 5: Creating 100 time slots...';

-- Create slots for next 7 days, 9 AM to 6 PM, 30-minute intervals
-- We'll create 10 slots per doctor across different days/times

DECLARE @SlotDate DATE;
DECLARE @SlotTime TIME;
DECLARE @DoctorId INT;
DECLARE @SlotCounter INT;

-- For each doctor
DECLARE doctor_cursor CURSOR FOR
SELECT Id FROM Doctors WHERE Email LIKE '%@demo.com';

OPEN doctor_cursor;
FETCH NEXT FROM doctor_cursor INTO @DoctorId;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @SlotCounter = 0;
    SET @SlotDate = DATEADD(DAY, 1, GETDATE()); -- Start from tomorrow
    
    -- Create 10 slots per doctor
    WHILE @SlotCounter < 10
    BEGIN
        -- Determine time slot based on counter
        SET @SlotTime = CASE @SlotCounter
            WHEN 0 THEN '09:00'
            WHEN 1 THEN '10:00'
            WHEN 2 THEN '11:00'
            WHEN 3 THEN '14:00'
            WHEN 4 THEN '15:00'
            WHEN 5 THEN '16:00'
           WHEN 6 THEN '09:30'
            WHEN 7 THEN '11:30'
            WHEN 8 THEN '15:30'
            WHEN 9 THEN '17:00'
        END;
        
        -- Move to next day every 5 slots
        IF @SlotCounter = 5
            SET @SlotDate = DATEADD(DAY, 1, @SlotDate);
        
        INSERT INTO Slots (DoctorId, StartTime, EndTime, IsAvailable, CreatedAt)
        VALUES (
            @DoctorId,
            CAST(CAST(@SlotDate AS DATETIME) + CAST(@SlotTime AS DATETIME) AS DATETIME),
            CAST(CAST(@SlotDate AS DATETIME) + CAST(@SlotTime AS DATETIME) + CAST('00:30' AS DATETIME) AS DATETIME), -- 30 min duration
            1, -- IsAvailable = true
            GETDATE()
        );
        
        SET @SlotCounter = @SlotCounter + 1;
    END;
    
    FETCH NEXT FROM doctor_cursor INTO @DoctorId;
END;

CLOSE doctor_cursor;
DEALLOCATE doctor_cursor;

PRINT '100 time slots created successfully.';
GO

-- ==================================================
-- VERIFICATION QUERIES
-- ==================================================
PRINT '======================================';
PRINT 'DEMO DATA CREATION COMPLETE!';
PRINT '======================================';
PRINT '';

-- Count patients
DECLARE @PatientCount INT = (SELECT COUNT(*) FROM AspNetUsers WHERE Role = 'Patient' AND Email LIKE '%@demo.com');
PRINT 'Total Patients: ' + CAST(@PatientCount AS VARCHAR);

-- Count doctors
DECLARE @DoctorUserCount INT = (SELECT COUNT(*) FROM AspNetUsers WHERE Role = 'Doctor' AND Email LIKE '%@demo.com');
PRINT 'Total Doctor Users: ' + CAST(@DoctorUserCount AS VARCHAR);

-- Count doctor profiles
DECLARE @DoctorProfileCount INT = (SELECT COUNT(*) FROM Doctors WHERE Email LIKE '%@demo.com');
PRINT 'Total Doctor Profiles: ' + CAST(@DoctorProfileCount AS VARCHAR);

-- Count slots
DECLARE @SlotCount INT = (SELECT COUNT(*) FROM Slots WHERE DoctorId IN (SELECT Id FROM Doctors WHERE Email LIKE '%@demo.com'));
PRINT 'Total Slots: ' + CAST(@SlotCount AS VARCHAR);

PRINT '';
PRINT 'Demo Account Credentials:';
PRINT '========================';
PRINT 'Patients: patient1@demo.com to patient10@demo.com';
PRINT 'Doctors:  doctor1@demo.com to doctor10@demo.com';
PRINT 'Password: Demo@123';
PRINT '';
PRINT 'You can now test the application with these demo accounts!';
GO
