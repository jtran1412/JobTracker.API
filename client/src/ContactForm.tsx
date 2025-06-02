import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Textarea,
  Alert,
  AlertIcon,
  Heading,
} from '@chakra-ui/react';

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
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setContact((prevContact) => ({
      ...prevContact,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/MVC/SubmitMessage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact),
      });

      if (response.ok) {
        setSuccessMessage('Your message has been submitted successfully!');
        setContact({ name: '', email: '', message: '' });
        setTouched({});
        setErrorMessage(null);
      } else {
        setErrorMessage('There was an error submitting your message.');
        setSuccessMessage(null);
      }
    } catch (error) {
      console.error('Error submitting contact message:', error);
      setSuccessMessage(null);
    }
  };

  const isInvalid = (field: keyof ContactMessage) =>
    touched[field] && contact[field].trim() === '';

  return (
    <Box maxW="600px" p={4} mx={0} /* aligned left */>
      <Box
        border="1px"
        borderColor="gray.300"
        borderRadius="md"
        p={6}
        maxW="400px"
      >
        <Heading mb={4}>Contact Us</Heading>

        {successMessage && (
          <Alert status="success" mb={4}>
            <AlertIcon />
            {successMessage}
          </Alert>
        )}

        {errorMessage && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={isInvalid('name')} mb={4}>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              id="name"
              name="name"
              type="text"
              value={contact.name}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <FormErrorMessage>Name is required.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={isInvalid('email')} mb={4}>
            <FormLabel htmlFor="email">Email</FormLabel>
            <Input
              id="email"
              name="email"
              type="email"
              value={contact.email}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <FormErrorMessage>Email is required.</FormErrorMessage>
          </FormControl>

          <FormControl isInvalid={isInvalid('message')} mb={4}>
            <FormLabel htmlFor="message">Message</FormLabel>
            <Textarea
              id="message"
              name="message"
              value={contact.message}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            <FormErrorMessage>Message is required.</FormErrorMessage>
          </FormControl>

          <Button colorScheme="blue" type="submit" w="full">
            Submit
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ContactForm;
