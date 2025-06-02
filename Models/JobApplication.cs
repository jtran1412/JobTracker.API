using System;
using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.Models
{
public class JobApplication
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public required string CompanyName { get; set; }

    [Required]
    [MaxLength(100)]
    public required string JobTitle { get; set; }

    [Required]
    [MaxLength(50)]
    public required string Status { get; set; }

    public DateTime AppliedDate { get; set; }

    [MaxLength(500)]
    public string? Notes { get; set; }  // Notes can be null
}

}
