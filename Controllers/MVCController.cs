using JobTracker.API.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace JobTracker.API.Controllers
{
    public class MVCController : Controller
    {
        private static List<ContactMessage> _messages = new List<ContactMessage>();

        // Display the contact form
        public IActionResult Contact()
        {
            return View();
        }

        // Handle the form submission and log the contact message
        [HttpPost]
        public IActionResult SubmitMessage(ContactMessage contact)
        {
            if (ModelState.IsValid)
            {
                contact.SubmittedAt = DateTime.Now;
                _messages.Add(contact);
                TempData["Message"] = "Your message has been submitted successfully!";
            }
            else
            {
                TempData["Message"] = "There was an error submitting your message. Please check the inputs.";
            }
            return RedirectToAction("Contact"); // Redirect to the Contact page after submission
        }

        // View all submitted messages
        public IActionResult ViewMessages()
        {
            return View(_messages);
        }
    }
}
