using Backend.Data;
using Backend.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly TokenService _tokenService;
        private readonly EmailService _emailService;
        private readonly IConfiguration _config;

        public AuthController(ApplicationDbContext context, TokenService tokenService, EmailService emailService, IConfiguration config)
        {
            _context = context;
            _tokenService = tokenService;
            _emailService = emailService;
            _config = config;
        }

        public record LoginRequest(string Email, string Password);
        public record ForgotPasswordRequest(string Email);
        public record ResetPasswordRequest(string Token, string NewPassword);

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == request.Email);

            // Same generic error whether the email or password is wrong — don't leak which one.
            if (admin == null || !PasswordHasher.Verify(request.Password, admin.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password." });

            var token = _tokenService.GenerateToken(admin.Email);

            Response.Cookies.Append("chairsync_auth", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpiryMinutes"] ?? "480")),
                Path = "/",
            });

            return Ok(new { email = admin.Email });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("chairsync_auth", new CookieOptions { Path = "/" });
            return Ok(new { message = "Logged out." });
        }

        [HttpGet("me")]
        [Microsoft.AspNetCore.Authorization.Authorize]
        public IActionResult Me()
        {
            var email = User.Identity?.Name ?? User.Claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress") || c.Type == "sub")?.Value;
            return Ok(new { email });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.Email == request.Email);

            // Always return 200 even if the email doesn't exist, so attackers can't
            // use this endpoint to discover whether an account exists.
            if (admin == null)
                return Ok(new { message = "If that email exists, a reset link has been sent." });

            admin.ResetToken = Guid.NewGuid().ToString("N");
            admin.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(30);
            await _context.SaveChangesAsync();

            var frontendUrl = _config["Frontend:BaseUrl"] ?? "http://localhost:5173";
            var resetLink = $"{frontendUrl}/reset-password?token={admin.ResetToken}";

            await _emailService.SendPasswordResetEmail(admin.Email, resetLink);

            return Ok(new { message = "If that email exists, a reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            var admin = await _context.Admins.FirstOrDefaultAsync(a => a.ResetToken == request.Token);

            if (admin == null || admin.ResetTokenExpiry == null || admin.ResetTokenExpiry < DateTime.UtcNow)
                return BadRequest(new { message = "This reset link is invalid or has expired." });

            admin.PasswordHash = PasswordHasher.Hash(request.NewPassword);
            admin.ResetToken = null;
            admin.ResetTokenExpiry = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password has been reset. You can now log in." });
        }
    }
}
