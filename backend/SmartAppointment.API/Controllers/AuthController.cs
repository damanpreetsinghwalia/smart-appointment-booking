using Microsoft. AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft. IdentityModel.Tokens;
using SmartAppointment.Core. Entities;
using System. IdentityModel.Tokens. Jwt;
using System.Security.Claims;
using System.Text;

namespace SmartAppointment.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IConfiguration _configuration;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IConfiguration configuration)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        if (! ModelState.IsValid)
            return BadRequest(ModelState);

        // Validate password confirmation
        if (request.Password != request.ConfirmPassword)
            return BadRequest(new { message = "Password and Confirm Password do not match" });

        // Build full name from first and last name
        var fullName = $"{request.FirstName} {request.LastName}".Trim();

        var user = new ApplicationUser
        {
            UserName = request.Email,
            Email = request.Email,
            FullName = fullName,
            PhoneNumber = request.PhoneNumber,
            Role = request.Role
        };

        var result = await _userManager.CreateAsync(user, request.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        // Return complete user data on registration
        return Ok(new
        {
            message = "User registered successfully",
            userId = user.Id,
            email = user.Email,
            firstName = request.FirstName,
            lastName = request.LastName,
            fullName = fullName,
            phoneNumber = user.PhoneNumber,
            role = user.Role,
            roles = new[] { user.Role }
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return Unauthorized(new { message = "Invalid email or password" });

        var result = await _signInManager.CheckPasswordSignInAsync(user, request.Password, false);
        if (! result.Succeeded)
            return Unauthorized(new { message = "Invalid email or password" });

        var token = GenerateJwtToken(user);

        // Extract first and last name from full name
        var nameParts = (user.FullName ?? "").Split(' ', 2);
        var firstName = nameParts.Length > 0 ? nameParts[0] : "";
        var lastName = nameParts.Length > 1 ? nameParts[1] : "";

        return Ok(new
        {
            token,
            userId = user.Id,
            email = user.Email,
            firstName,
            lastName,
            fullName = user.FullName,
            phoneNumber = user.PhoneNumber,
            role = user.Role,
            roles = new[] { user.Role }
        });
    }

    private string GenerateJwtToken(ApplicationUser user)
    {
        var jwtSettings = _configuration.GetSection("Jwt");
        var key = Encoding.UTF8.GetBytes(jwtSettings["Key"]!);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email! ),
            new Claim(ClaimTypes.Name, user.FullName),
            new Claim(ClaimTypes.Role, user.Role),
            new Claim(JwtRegisteredClaimNames. Jti, Guid.NewGuid().ToString())
        };

        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(key),
            SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: jwtSettings["Issuer"],
            audience:  jwtSettings["Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(jwtSettings["ExpiryInMinutes"])),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

// DTOs
public class RegisterRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string ConfirmPassword { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Role { get; set; } = "Patient"; // Default role
}

public class LoginRequest
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}