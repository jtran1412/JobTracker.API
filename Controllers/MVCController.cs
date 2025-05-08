using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Net.Mail;

namespace JobTracker.API.Controllers
{
    public class MVCController : Controller
    {
        // GET: Display the email submission form
        [HttpGet]
        public IActionResult EmailForm()
        {
            return View();
        }

        // POST: Handle the email form submission
        [HttpPost]
        public IActionResult SubmitEmail(string name, string email, string message)
        {
            try
            {
                // Create the email message
                var mailMessage = new MailMessage
                {
                    From = new MailAddress(email), // User's email
                    Subject = "New Message from Contact Form",
                    Body = $"Name: {name}\nEmail: {email}\nMessage: {message}",
                    IsBodyHtml = false
                };

                // Send the email to your Gmail address
                mailMessage.To.Add("jtran1412@gmail.com");

                // Send the email using Gmail's SMTP server
                using (var smtpClient = new SmtpClient("smtp.gmail.com"))
                {
                    smtpClient.Port = 587;
                    smtpClient.Credentials = new NetworkCredential("your-email@gmail.com", "your-email-password"); // Your Gmail credentials
                    smtpClient.EnableSsl = true;

                    smtpClient.Send(mailMessage);
                }

                // Return a success message or redirect to a success page
                ViewBag.Message = "Your message has been sent successfully!";
                return View("EmailForm"); // Show success message on the same page
            }
            catch (Exception ex)
            {
                // Handle error, maybe log it
                ViewBag.Message = "An error occurred while sending the email: " + ex.Message;
                return View("EmailForm"); // Show error message on the same page
            }
        }
    }
}

