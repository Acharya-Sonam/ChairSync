using System.Net;
using System.Net.Mail;

namespace Backend.Services
{
    public class EmailService
    {
        private readonly IConfiguration _config;
        private readonly ILogger<EmailService> _logger;

        public EmailService(IConfiguration config, ILogger<EmailService> logger)
        {
            _config = config;
            _logger = logger;
        }

        public async Task SendPasswordResetEmail(string toEmail, string resetLink)
        {
            var smtp = _config.GetSection("Smtp");
            var host = smtp["Host"];

            // If SMTP isn't configured yet, just log the link so local dev still works.
            if (string.IsNullOrWhiteSpace(host))
            {
                _logger.LogWarning("SMTP not configured. Password reset link for {Email}: {Link}", toEmail, resetLink);
                return;
            }

            using var message = new MailMessage
            {
                From = new MailAddress(smtp["FromAddress"] ?? "no-reply@chairsync.local", "ChairSync"),
                Subject = "Reset your ChairSync password",
                Body = $"Click the link below to reset your password. This link expires in 30 minutes.\n\n{resetLink}\n\nIf you didn't request this, you can ignore this email.",
                IsBodyHtml = false,
            };
            message.To.Add(toEmail);

            using var client = new SmtpClient(host, int.Parse(smtp["Port"] ?? "587"))
            {
                Credentials = new NetworkCredential(smtp["Username"], smtp["Password"]),
                EnableSsl = true,
            };

            await client.SendMailAsync(message);
        }
    }
}