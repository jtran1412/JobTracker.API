using System.Net;
using System.Net.Mail;
using Microsoft.AspNetCore.Mvc;
using JobTracker.API.Models;

namespace JobTracker.API.Controllers
{
    public class MVCController : Controller
    {
        // Display the email form
        public IActionResult Email()
        {
            return View();
        }

        // Handle the form submission and send the email
        [HttpPost]
        public IActionResult SendEmail(EmailModel emailModel)
        {
            if (!ModelState.IsValid)
            {
                return View("Email", emailModel); // Redisplay the form if validation fails
            }

            // Set up email client
            try
            {
                var smtpClient = new SmtpClient("smtp.gmail.com")
                {
                    Port = 587,
                    Credentials = new NetworkCredential("jtran1412@gmail.com", "Purple989#"),
                    EnableSsl = true,
                };

                var mailMessage = new MailMessage
                {
                    From = new MailAddress("yourEmail@gmail.com"),
                    Subject = "Message from " + emailModel.Name,
                    Body = $"From: {emailModel.Name} ({emailModel.Email})\n\nMessage:\n{emailModel.Message}",
                    IsBodyHtml = false,
                };

                // Send email to your email address
                mailMessage.To.Add("jtran1412@gmail.com");

                smtpClient.Send(mailMessage);

                ViewBag.Message = "Your message has been sent successfully!";
            }
            catch
            {
                ViewBag.Message = "There was an error sending your message. Please try again later.";
            }

            return View("Email", emailModel); // Return the view with feedback
        }
    }
}
