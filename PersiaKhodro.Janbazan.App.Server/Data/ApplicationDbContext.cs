using Microsoft.EntityFrameworkCore;
using PersiaKhodro.Janbazan.App.Server.Entities;

namespace PersiaKhodro.Janbazan.App.Server.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    // Define DbSets for each entity to be mapped to a database table
    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<DisabilityInfo> DisabilityInfos { get; set; }
    public DbSet<Vehicle> Vehicles { get; set; }
    public DbSet<Document> Documents { get; set; }
    public DbSet<Comment> Comments { get; set; } // Add Comment and PaymentInvoice DbSets
    public DbSet<PaymentInvoice> PaymentInvoices { get; set; }


    // Use Fluent API to configure the model relationships
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // --- User Entity Configuration ---
        modelBuilder.Entity<User>(entity =>
        {
            // Make NationalCode and MobileNumber unique
            entity.HasIndex(u => u.NationalCode).IsUnique();
            entity.HasIndex(u => u.MobileNumber).IsUnique();

            // Configure the one-to-one relationship with DisabilityInfo
            entity.HasOne(u => u.DisabilityInfo)
                  .WithOne(d => d.User)
                  .HasForeignKey<DisabilityInfo>(d => d.UserId);
        });
    }
}