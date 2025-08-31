using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using PersiaKhodro.Janbazan.App.Server.Services;
using PersiaKhodro.Janbazan.App.Server.Data;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;
var configuration = builder.Configuration;

// --- 1. Add services to the container. ---

// Add DbContext for Entity Framework Core
services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));
// NOTE: The line above is commented out because ApplicationDbContext is not created yet.
// We will uncomment this in the next step.
// نکته: خط بالا کامنت شده چون هنوز کلاس ApplicationDbContext را نساخته‌ایم. در قدم بعدی آن را فعال می‌کنیم.


services.AddScoped<IAuthService, AuthService>();
services.AddScoped<IProfileService, ProfileService>();
services.AddScoped<IVehicleService, VehicleService>();
services.AddScoped<IFileStorageService, LocalFileStorageService>();
services.AddScoped<ICommentService, CommentService>();
services.AddScoped<IPaymentService, PaymentService>();


// Add JWT Authentication
services.AddAuthentication(options =>
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
        ValidIssuer = configuration["Jwt:Issuer"],
        ValidAudience = configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]))
    };
});


// Add CORS policy to allow requests from our React app
services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        builder => builder.WithOrigins("http://localhost:32822") // آدرس اپ ری‌اکت شما
                           .AllowAnyHeader()
                           .AllowAnyMethod());
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();




// --- 2. Configure the HTTP request pipeline. ---
var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Use the CORS policy
app.UseCors("AllowReactApp");

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
