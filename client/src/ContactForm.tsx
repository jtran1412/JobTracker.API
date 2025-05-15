import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

const ContactForm: React.FC = () => {
  const [contact, setContact] = useState<ContactMessage>({
    name: '',
    email: '',
    message: '',
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/MVC/SubmitMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        setSuccessMessage('Your message has been submitted successfully!');
        setContact({ name: '', email: '', message: '' });
        setErrorMessage(null);
      } else {
        setErrorMessage('There was an error submitting your message.');
        setSuccessMessage(null);
      }
    } catch (error) {
      setErrorMessage('There was an error submitting your message.');
      setSuccessMessage(null);
    }
  };

  return (
    <div>
      <h2>Contact Us</h2>

      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={contact.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            value={contact.email}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={contact.message}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Submit</button>
      </form>

    </div>
  );
};

export default ContactForm;
