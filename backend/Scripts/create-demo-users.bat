@echo off
REM =============================================
REM Create Demo Users - Simple Batch Script
REM =============================================
echo ========================================
echo CREATING DEMO USERS
echo ========================================
echo.

REM Patient 1
echo Creating patient1@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Rajesh\",\"lastName\":\"Kumar\",\"email\":\"patient1@demo.com\",\"phoneNumber\":\"9876543210\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Patient\"}" >nul 2>&1

REM Patient 2
echo Creating patient2@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Priya\",\"lastName\":\"Sharma\",\"email\":\"patient2@demo.com\",\"phoneNumber\":\"9876543211\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Patient\"}" >nul 2>&1

REM Patient 3
echo Creating patient3@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Amit\",\"lastName\":\"Patel\",\"email\":\"patient3@demo.com\",\"phoneNumber\":\"9876543212\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Patient\"}" >nul 2>&1

REM Patient 4
echo Creating patient4@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Sneha\",\"lastName\":\"Reddy\",\"email\":\"patient4@demo.com\",\"phoneNumber\":\"9876543213\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Patient\"}" >nul 2>&1

REM Patient 5
echo Creating patient5@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Vikram\",\"lastName\":\"Singh\",\"email\":\"patient5@demo.com\",\"phoneNumber\":\"9876543214\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Patient\"}" >nul 2>&1

REM Patient 6
echo Creating patient6@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Ananya\",\"lastName\":\"Gupta\",\"email\":\"patient6@demo.com\",\"phoneNumber\":\"9876543215\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Patient\"}" >nul 2>&1

REM Patient 7
echo Creating patient7@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Karthik\",\"lastName\":\"Iyer\",\"email\":\"patient7@demo.com\",\"phoneNumber\":\"9876543216\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Patient\"}" >nul 2>&1

REM Patient 8
echo Creating patient8@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Meera\",\"lastName\":\"Nair\",\"email\":\"patient8@demo.com\",\"phoneNumber\":\"9876543217\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Patient\"}" >nul 2>&1

REM Patient 9
echo Creating patient9@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Arjun\",\"lastName\":\"Verma\",\"email\":\"patient9@demo.com\",\"phoneNumber\":\"9876543218\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Patient\"}" >nul 2>&1

REM Patient 10
echo Creating patient10@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Divya\",\"lastName\":\"Rao\",\"email\":\"patient10@demo.com\",\"phoneNumber\":\"9876543219\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Patient\"}" >nul 2>&1

echo.
echo 10 Patients Created!
echo.

REM Doctor 1
echo Creating doctor1@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Dr. Arun\",\"lastName\":\"Kapoor\",\"email\":\"doctor1@demo.com\",\"phoneNumber\":\"9123456780\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Doctor\"}" >nul 2>&1

REM Doctor 2
echo Creating doctor2@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Dr. Kavita\",\"lastName\":\"Mehta\",\"email\":\"doctor2@demo.com\",\"phoneNumber\":\"9123456781\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Doctor\"}" >nul 2>&1

REM Doctor 3
echo Creating doctor3@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Dr. Rahul\",\"lastName\":\"Desai\",\"email\":\"doctor3@demo.com\",\"phoneNumber\":\"9123456782\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Doctor\"}" >nul 2>&1

REM Doctor 4
echo Creating doctor4@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Dr. Pooja\",\"lastName\":\"Sinha\",\"email\":\"doctor4@demo.com\",\"phoneNumber\":\"9123456783\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Doctor\"}" >nul 2>&1

REM Doctor 5
echo Creating doctor5@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Dr. Manoj\",\"lastName\":\"Kulkarni\",\"email\":\"doctor5@demo.com\",\"phoneNumber\":\"9123456784\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Doctor\"}" >nul 2>&1

REM Doctor 6
echo Creating doctor6@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Dr. Neha\",\"lastName\":\"Chopra\",\"email\":\"doctor6@demo.com\",\"phoneNumber\":\"9123456785\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Doctor\"}" >nul 2>&1

REM Doctor 7
echo Creating doctor7@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Dr. Sanjay\",\"lastName\":\"Bose\",\"email\":\"doctor7@demo.com\",\"phoneNumber\":\"9123456786\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Doctor\"}" >nul 2>&1

REM Doctor 8
echo Creating doctor8@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Dr. Shruti\",\"lastName\":\"Joshi\",\"email\":\"doctor8@demo.com\",\"phoneNumber\":\"9123456787\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Doctor\"}" >nul 2>&1

REM Doctor 9
echo Creating doctor9@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Dr. Rohit\",\"lastName\":\"Bansal\",\"email\":\"doctor9@demo.com\",\"phoneNumber\":\"9123456788\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Doctor\"}" >nul 2>&1

REM Doctor 10
echo Creating doctor10@demo.com...
curl -X POST http://localhost:5076/api/Auth/register -H "Content-Type: application/json" -d "{\"firstName\":\"Dr. Anjali\",\"lastName\":\"Trivedi\",\"email\":\"doctor10@demo.com\",\"phoneNumber\":\"9123456789\",\"password\":\"Demo@123\",\"confirmPassword\":\"Demo@123\",\"role\":\"Doctor\"}" >nul 2>&1

echo.
echo 10 Doctors Created!
echo.
echo ========================================
echo DEMO USER CREATION COMPLETE!
echo ========================================
echo Total: 20 demo accounts created
echo Password for all: Demo@123
echo.
echo NEXT STEP: Open SSMS and run the SQL scripts to create:
echo 1. Doctor profiles
echo 2. Time slots
echo.
pause
