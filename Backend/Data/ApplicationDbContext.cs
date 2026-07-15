using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Chair> Chairs { get; set; }

        public DbSet<Customer> Customers { get; set; }

        public DbSet<User> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Chair>().HasData(
                Enumerable.Range(1, 9).Select(i => new Chair
                {
                    Id = i,
                    ChairNumber = $"Chair {i}",
                    IsOccupied = false
                })
            );
        }
    }
}