using Backend.Data;
using Backend.Models;
using Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// PostgreSQL
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(
        builder.Configuration.GetConnectionString("DefaultConnection")));

// Auth services
builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<EmailService>();

// JWT authentication
var jwtSettings = builder.Configuration.GetSection("Jwt");
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings["Key"]!)),
    };

    // Read the JWT from our httpOnly cookie instead of an Authorization header —
    // JS never touches the token, so it isn't exposed to XSS.
    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            if (context.Request.Cookies.TryGetValue("chairsync_auth", out var cookieToken))
            {
                context.Token = cookieToken;
            }
            return Task.CompletedTask;
        }
    };
});

// Allow React to access the API
builder.Services.AddCors(options =>
{
    options.AddPolicy("ReactPolicy", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Seed the single Admin account if one doesn't exist yet.
// This is the ONLY way an Admin account is ever created — the public
// /auth/register endpoint always creates "Staff" accounts, never "Admin".
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    if (!db.Users.Any(u => u.Role == "Admin"))
    {
        var seed = builder.Configuration.GetSection("AdminSeed");
        db.Users.Add(new User
        {
            Name = "Owner",
            Email = seed["Email"]!,
            PasswordHash = PasswordHasher.Hash(seed["Password"]!),
            Role = "Admin"
        });
        db.SaveChanges();
    }
}

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("ReactPolicy");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();