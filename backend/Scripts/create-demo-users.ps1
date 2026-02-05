# ==============================================================================
# SMART APPOINTMENT BOOKING - AUTOMATED DEMO DATA CREATION
# ==============================================================================
# This script automatically creates 20 demo users via the registration API
# Password for ALL accounts: Demo@123
# 
# Usage: 
#   1. Make sure your API is running (dotnet run in backend folder)
#   2. Run this script: .\create-demo-users.ps1
#   3. Then run the SQL scripts in SSMS for doctor profiles and slots
# ==============================================================================

# Configuration
$apiUrl = "http://localhost:5076/api/Auth/register"
$password = "Demo@123"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "CREATING DEMO USERS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Patient data
$patients = @(
    @{firstName="Rajesh"; lastName="Kumar"; email="patient1@demo.com"; phone="9876543210"},
    @{firstName="Priya"; lastName="Sharma"; email="patient2@demo.com"; phone="9876543211"},
    @{firstName="Amit"; lastName="Patel"; email="patient3@demo.com"; phone="9876543212"},
    @{firstName="Sneha"; lastName="Reddy"; email="patient4@demo.com"; phone="9876543213"},
    @{firstName="Vikram"; lastName="Singh"; email="patient5@demo.com"; phone="9876543214"},
    @{firstName="Ananya"; lastName="Gupta"; email="patient6@demo.com"; phone="9876543215"},
    @{firstName="Karthik"; lastName="Iyer"; email="patient7@demo.com"; phone="9876543216"},
    @{firstName="Meera"; lastName="Nair"; email="patient8@demo.com"; phone="9876543217"},
    @{firstName="Arjun"; lastName="Verma"; email="patient9@demo.com"; phone="9876543218"},
    @{firstName="Divya"; lastName="Rao"; email="patient10@demo.com"; phone="9876543219"}
)

# Doctor data
$doctors = @(
    @{firstName="Dr. Arun"; lastName="Kapoor"; email="doctor1@demo.com"; phone="9123456780"},
    @{firstName="Dr. Kavita"; lastName="Mehta"; email="doctor2@demo.com"; phone="9123456781"},
    @{firstName="Dr. Rahul"; lastName="Desai"; email="doctor3@demo.com"; phone="9123456782"},
    @{firstName="Dr. Pooja"; lastName="Sinha"; email="doctor4@demo.com"; phone="9123456783"},
    @{firstName="Dr. Manoj"; lastName="Kulkarni"; email="doctor5@demo.com"; phone="9123456784"},
    @{firstName="Dr. Neha"; lastName="Chopra"; email="doctor6@demo.com"; phone="9123456785"},
    @{firstName="Dr. Sanjay"; lastName="Bose"; email="doctor7@demo.com"; phone="9123456786"},
    @{firstName="Dr. Shruti"; lastName="Joshi"; email="doctor8@demo.com"; phone="9123456787"},
    @{firstName="Dr. Rohit"; lastName="Bansal"; email="doctor9@demo.com"; phone="9123456788"},
    @{firstName="Dr. Anjali"; lastName="Trivedi"; email="doctor10@demo.com"; phone="9123456789"}
)

# Function to register a user
function Register-User {
    param(
        [string]$firstName,
        [string]$lastName,
        [string]$email,
        [string]$phoneNumber,
        [string]$role
    )
    
    $body = @{
        firstName = $firstName
        lastName = $lastName
        email = $email
        phoneNumber = $phoneNumber
        password = $password
        confirmPassword = $password
        role = $role
    } | ConvertTo-Json

    try {
        $response = Invoke-RestMethod -Uri $apiUrl -Method Post -Body $body -ContentType "application/json" -ErrorAction Stop
        Write-Host "[SUCCESS] Created $role : $firstName $lastName ($email)" -ForegroundColor Green
        return $true
    }
    catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 400) {
            Write-Host "[EXISTS] Already exists: $email" -ForegroundColor Yellow
        }
        else {
            Write-Host "[ERROR] Failed to create $email : $($_.Exception.Message)" -ForegroundColor Red
        }
        return $false
    }
}

# Test API connectivity
Write-Host "Testing API connectivity..." -ForegroundColor Yellow
try {
    $testResponse = Invoke-WebRequest -Uri "http://localhost:5076" -Method Get -TimeoutSec 5 -ErrorAction Stop
    Write-Host "[SUCCESS] API is running!" -ForegroundColor Green
    Write-Host ""
}
catch {
    Write-Host "[ERROR] Cannot connect to API at http://localhost:5076" -ForegroundColor Red
    Write-Host "    Please make sure your backend is running:" -ForegroundColor Red
    Write-Host "    cd backend\SmartAppointment.API" -ForegroundColor Yellow
    Write-Host "    dotnet run" -ForegroundColor Yellow
    Write-Host ""
    exit 1
}

# Register patients
Write-Host "Creating 10 Patient Accounts..." -ForegroundColor Cyan
Write-Host "--------------------------------" -ForegroundColor Cyan
$patientCount = 0
foreach ($patient in $patients) {
    if (Register-User -firstName $patient.firstName -lastName $patient.lastName -email $patient.email -phoneNumber $patient.phone -role "Patient") {
        $patientCount++
    }
    Start-Sleep -Milliseconds 200  # Small delay to avoid overwhelming the API
}
Write-Host ""

# Register doctors
Write-Host "Creating 10 Doctor Accounts..." -ForegroundColor Cyan
Write-Host "-------------------------------" -ForegroundColor Cyan
$doctorCount = 0
foreach ($doctor in $doctors) {
    if (Register-User -firstName $doctor.firstName -lastName $doctor.lastName -email $doctor.email -phoneNumber $doctor.phone -role "Doctor") {
        $doctorCount++
    }
    Start-Sleep -Milliseconds 200
}
Write-Host ""

# Summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Patients created: $patientCount / 10" -ForegroundColor $(if($patientCount -eq 10){"Green"}else{"Yellow"})
Write-Host "Doctors created:  $doctorCount / 10" -ForegroundColor $(if($doctorCount -eq 10){"Green"}else{"Yellow"})
Write-Host ""
Write-Host "All accounts use password: $password" -ForegroundColor Cyan
Write-Host ""

# Next steps
Write-Host "========================================" -ForegroundColor Green
Write-Host "NEXT STEPS" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "1. Open SQL Server Management Studio (SSMS)" -ForegroundColor White
Write-Host "2. Connect to your database: SmartAppointmentDB" -ForegroundColor White
Write-Host "3. Run the SQL scripts to create:" -ForegroundColor White
Write-Host "   - Doctor profiles (links users to doctor details)" -ForegroundColor Gray
Write-Host "   - Time slots (100 slots for bookings)" -ForegroundColor Gray
Write-Host ""
Write-Host "SQL Script Location:" -ForegroundColor Yellow
Write-Host "   backend\Scripts\create-demo-data.sql" -ForegroundColor Cyan
Write-Host ""
Write-Host "Or follow the step-by-step guide:" -ForegroundColor Yellow
Write-Host "   .gemini\antigravity\brain\...\ssms-demo-data-guide.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "Demo data creation ready for hackathon! 🎉" -ForegroundColor Green
