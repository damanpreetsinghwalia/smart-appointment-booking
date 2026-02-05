# Quick Demo Data Setup Guide

## 🚀 Automated Approach (Recommended)

### Step 1: Run PowerShell Script to Create Users

**Windows PowerShell:**
```powershell
cd backend\Scripts
.\create-demo-users.ps1
```

This will automatically create:
- 10 patient accounts (patient1-10@demo.com)
- 10 doctor accounts (doctor1-10@demo.com)
- All with password: Demo@123

**Expected Output:**
```
[✓] Created Patient: Rajesh Kumar (patient1@demo.com)
[✓] Created Patient: Priya Sharma (patient2@demo.com)
...
[✓] Created Doctor: Dr. Arun Kapoor (doctor1@demo.com)
...
Patients created: 10 / 10
Doctors created: 10 / 10
```

---

### Step 2: Create Doctor Profiles in SSMS

1. Open **SQL Server Management Studio**
2. Connect to: `(localdb)\MSSQLLocalDB`
3. Open new query on `SmartAppointmentDB`
4. Copy this SQL and run it:

```sql
USE SmartAppointmentDB;
GO

-- Create Doctor Profiles
INSERT INTO Doctors (UserId, FullName, Email, PhoneNumber, Specialization, Qualifications, Experience, ConsultationFee, IsAvailable)
SELECT 
    u.Id, u.FullName, u.Email, u.PhoneNumber,
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
    1
FROM AspNetUsers u
WHERE u.Email LIKE 'doctor%@demo.com'
AND NOT EXISTS (SELECT 1 FROM Doctors d WHERE d.UserId = u.Id);

SELECT @@ROWCOUNT AS 'Doctor Profiles Created';
```

---

### Step 3: Create Time Slots in SSMS

In the same SSMS query window, run this script:

```sql
USE SmartAppointmentDB;
GO

DECLARE @DoctorId INT;
DECLARE @SlotDate DATE;
DECLARE @SlotTime TIME;
DECLARE @SlotCounter INT;

DECLARE doctor_cursor CURSOR FOR
SELECT Id FROM Doctors WHERE Email LIKE '%@demo.com';

OPEN doctor_cursor;
FETCH NEXT FROM doctor_cursor INTO @DoctorId;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @SlotCounter = 0;
    SET @SlotDate = DATEADD(DAY, 1, GETDATE());
    
    WHILE @SlotCounter < 10
    BEGIN
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
        
        IF @SlotCounter = 5
            SET @SlotDate = DATEADD(DAY, 1, @SlotDate);
        
        INSERT INTO Slots (DoctorId, StartTime, EndTime, IsAvailable, CreatedAt)
        VALUES (
            @DoctorId,
            CAST(CAST(@SlotDate AS DATETIME) + CAST(@SlotTime AS DATETIME) AS DATETIME),
            CAST(CAST(@SlotDate AS DATETIME) + CAST(@SlotTime AS DATETIME) + CAST('00:30' AS DATETIME) AS DATETIME),
            1,
            GETDATE()
        );
        
        SET @SlotCounter = @SlotCounter + 1;
    END;
    
    FETCH NEXT FROM doctor_cursor INTO @DoctorId;
END;

CLOSE doctor_cursor;
DEALLOCATE doctor_cursor;

SELECT COUNT(*) AS 'Total Slots Created' 
FROM Slots 
WHERE DoctorId IN (SELECT Id FROM Doctors WHERE Email LIKE '%@demo.com');
```

---

## ✅ Verify Demo Data

Run this in SSMS to verify everything was created:

```sql
SELECT 'Patients' AS Type, COUNT(*) AS Count
FROM AspNetUsers WHERE Role = 'Patient' AND Email LIKE '%@demo.com'
UNION ALL
SELECT 'Doctors', COUNT(*) FROM AspNetUsers WHERE Role = 'Doctor' AND Email LIKE '%@demo.com'
UNION ALL
SELECT 'Doctor Profiles', COUNT(*) FROM Doctors WHERE Email LIKE '%@demo.com'
UNION ALL
SELECT 'Time Slots', COUNT(*) FROM Slots 
WHERE DoctorId IN (SELECT Id FROM Doctors WHERE Email LIKE '%@demo.com');
```

**Expected:**
```
Type              Count
-----------------  -----
Patients           10
Doctors            10
Doctor Profiles    10
Time Slots         100
```

---

## 🧪 Test Demo Accounts

**Patient Login:**
- Email: `patient1@demo.com`
- Password: `Demo@123`

**Doctor Login:**
- Email: `doctor1@demo.com`  
- Password: `Demo@123`

---

## 📝 Demo Accounts List

### Patients (10)
- patient1@demo.com - Rajesh Kumar
- patient2@demo.com - Priya Sharma
- patient3@demo.com - Amit Patel
- patient4@demo.com - Sneha Reddy
- patient5@demo.com - Vikram Singh
- patient6@demo.com - Ananya Gupta
- patient7@demo.com - Karthik Iyer
- patient8@demo.com - Meera Nair
- patient9@demo.com - Arjun Verma
- patient10@demo.com - Divya Rao

### Doctors (10)
- doctor1@demo.com - Dr. Arun Kapoor (Cardiology - ₹1500)
- doctor2@demo.com - Dr. Kavita Mehta (Neurology - ₹1200)
- doctor3@demo.com - Dr. Rahul Desai (Orthopedics - ₹1800)
- doctor4@demo.com - Dr. Pooja Sinha (Pediatrics - ₹800)
- doctor5@demo.com - Dr. Manoj Kulkarni (Dermatology - ₹1000)
- doctor6@demo.com - Dr. Neha Chopra (Ophthalmology - ₹2000)
- doctor7@demo.com - Dr. Sanjay Bose (ENT - ₹1100)
- doctor8@demo.com - Dr. Shruti Joshi (General Medicine - ₹600)
- doctor9@demo.com - Dr. Rohit Bansal (Psychiatry - ₹1300)
- doctor10@demo.com - Dr. Anjali Trivedi (Radiology - ₹1400)

---

## 🎯 Total Time: ~2 minutes!

**PowerShell Script:** 30 seconds
**SQL Scripts in SSMS:** 1 minute  
**Verification:** 30 seconds

Demo data ready for hackathon presentation! 🎉
