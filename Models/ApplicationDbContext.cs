using Microsoft.EntityFrameworkCore;

namespace JobTracker.API.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) {}

        public DbSet<JobApplication> JobApplications { get; set; }
    }
}
