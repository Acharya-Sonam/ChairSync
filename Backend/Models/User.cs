namespace Backend.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        // "Admin" or "Staff" — enforced in code, not left open to the client.
        // There is exactly one Admin, created only via the startup seed.
        public string Role { get; set; } = "Staff";

        // New Staff accounts start unapproved and can't log in until the
        // Admin approves them. Admin is always approved (set true at seed time).
        public bool IsApproved { get; set; } = false;

        // Password reset flow
        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }
    }
}
