using System;
using System.ComponentModel.DataAnnotations;

namespace JobTracker.API.Models
{
    public class ContactMessage
    {
        public ContactMessage()
        {
            Name = string.Empty;
            Email = string.Empty;
            Message = string.Empty;
        }

        [Required]
        public string Name { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string Message { get; set; }

        public DateTime SubmittedAt { get; set; }
    }
}
