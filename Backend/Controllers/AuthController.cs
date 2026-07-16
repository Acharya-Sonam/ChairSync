using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
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
        public record RegisterRequest(string Name, string Email, string Password);
        public record ForgotPasswordRequest(string Email);
        public record ResetPasswordRequest(string Token, string NewPassword);

        // Staff sign-up. Anyone can call this — no login required — but it can
        // ONLY ever create a "Staff" account. Role is never taken from the
        // request body, so there's no way for a client to register as Admin.
        // There is exactly one Admin in the whole system, created once at
        // startup from appsettings (see Program.cs) — never through this endpoint.
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest request)
        {
            if (string.IsNullOrWhiteSpace(request.Name) ||
                string.IsNullOrWhiteSpace(request.Email) ||
                string.IsNullOrWhiteSpace(request.Password))
                return BadRequest(new { message = "Name, email, and password are all required." });

            if (request.Password.Length < 6)
                return BadRequest(new { message = "Password must be at least 6 characters." });

            var exists = await _context.Users.AnyAsync(u => u.Email == request.Email);
            if (exists)
                return Conflict(new { message = "An account with that email already exists." });

            var user = new User
            {
                Name = request.Name,
                Email = request.Email,
                PasswordHash = PasswordHasher.Hash(request.Password),
                Role = "Staff",
                IsApproved = false,
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            return Ok(new
            {
                message = "Your account has been submitted. You'll be able to log in once the owner approves it."
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            // Same generic error whether the email or password is wrong — don't leak which one.
            if (user == null || !PasswordHasher.Verify(request.Password, user.PasswordHash))
                return Unauthorized(new { message = "Invalid email or password." });

            if (!user.IsApproved)
                return StatusCode(403, new { message = "Your account is still pending approval from the shop owner." });

            SignInWithCookie(user);

            return Ok(new { email = user.Email, name = user.Name, role = user.Role });
        }

        [HttpPost("logout")]
        public IActionResult Logout()
        {
            Response.Cookies.Delete("chairsync_auth", new CookieOptions { Path = "/" });
            return Ok(new { message = "Logged out." });
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            var email = User.Claims.FirstOrDefault(c => c.Type.EndsWith("emailaddress") || c.Type == "sub")?.Value;
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

            if (user == null)
                return Unauthorized();

            return Ok(new { email = user.Email, name = user.Name, role = user.Role });
        }

        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);

            // Always return 200 even if the email doesn't exist, so attackers can't
            // use this endpoint to discover whether an account exists.
            if (user == null)
                return Ok(new { message = "If that email exists, a reset link has been sent." });

            user.ResetToken = Guid.NewGuid().ToString("N");
            user.ResetTokenExpiry = DateTime.UtcNow.AddMinutes(30);
            await _context.SaveChangesAsync();

            var frontendUrl = _config["Frontend:BaseUrl"] ?? "http://localhost:5173";
            var resetLink = $"{frontendUrl}/reset-password?token={user.ResetToken}";

            await _emailService.SendPasswordResetEmail(user.Email, resetLink);

            return Ok(new { message = "If that email exists, a reset link has been sent." });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.ResetToken == request.Token);

            if (user == null || user.ResetTokenExpiry == null || user.ResetTokenExpiry < DateTime.UtcNow)
                return BadRequest(new { message = "This reset link is invalid or has expired." });

            user.PasswordHash = PasswordHasher.Hash(request.NewPassword);
            user.ResetToken = null;
            user.ResetTokenExpiry = null;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Password has been reset. You can now log in." });
        }

        // --- Admin-only: manage pending staff approvals ---

        [HttpGet("pending-staff")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetPendingStaff()
        {
            var pending = await _context.Users
                .Where(u => u.Role == "Staff" && !u.IsApproved)
                .Select(u => new { u.Id, u.Name, u.Email })
                .ToListAsync();

            return Ok(pending);
        }

        [HttpGet("staff")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetStaff()
        {
            var staff = await _context.Users
                .Where(u => u.Role == "Staff" && u.IsApproved)
                .Select(u => new { u.Id, u.Name, u.Email })
                .ToListAsync();

            return Ok(staff);
        }

        [HttpDelete("staff/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteStaff(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null || user.Role != "Staff")
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = $"{user.Name} has been removed." });
        }

        [HttpPost("approve/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> ApproveStaff(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null || user.Role != "Staff")
                return NotFound();

            user.IsApproved = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = $"{user.Name} has been approved." });
        }

        [HttpPost("reject/{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> RejectStaff(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null || user.Role != "Staff")
                return NotFound();

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Registration request removed." });
        }

        private void SignInWithCookie(User user)
        {
            var token = _tokenService.GenerateToken(user.Email, user.Role);

            Response.Cookies.Append("chairsync_auth", token, new CookieOptions
            {
                HttpOnly = true,
                Secure = Request.IsHttps,
                SameSite = SameSiteMode.Lax,
                Expires = DateTimeOffset.UtcNow.AddMinutes(double.Parse(_config["Jwt:ExpiryMinutes"] ?? "480")),
                Path = "/",
            });
        }
    }
}
