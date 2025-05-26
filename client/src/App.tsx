import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Button,
  Flex,
  VStack,
  Input,
  Textarea,
  HStack,
  Select,
} from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link as RouterLink,
} from 'react-router-dom';
import ContactForm from './ContactForm';
import Datatable from './components/Datatable';
import { Job, JobStatus } from './types/Job';

const statusOptions: JobStatus[] = [
  'applied',
  'got interview',
  'interviewed',
  'rejected',
  'got offer',
];

const ChakraRouterLink = RouterLink as unknown as React.ComponentType<
  React.ComponentProps<typeof RouterLink>
>;

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<Partial<Job>>({
    companyName: '',
    jobTitle: '',
    status: 'applied',
    appliedDate: '',
    notes: '',
  });

  useEffect(() => {
    fetch('/api/JobApplications')
      .then(res => res.json())
      .then(setJobs)
      .catch(err => console.error('Failed to load jobs', err));
  }, []);

  const addOrUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();

    const method = form.id ? 'PUT' : 'POST';
    const url = form.id
      ? `/api/JobApplications/${form.id}`
      : '/api/JobApplications';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        console.error('Failed to save job');
        return;
      }

      let savedJob: Job;

      if (method === 'POST') {
        savedJob = await res.json();
      } else {
        const getRes = await fetch(`/api/JobApplications/${form.id}`);
        savedJob = await getRes.json();
      }

      setJobs(prev =>
        form.id ? prev.map(j => (j.id === savedJob.id ? savedJob : j)) : [...prev, savedJob]
      );

      setForm({
        companyName: '',
        jobTitle: '',
        status: 'applied',
        appliedDate: '',
        notes: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (id: number) => {
    await fetch(`/api/JobApplications/${id}`, { method: 'DELETE' });
    setJobs(jobs.filter(j => j.id !== id));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (job: Job) => {
    setForm({
      ...job,
      appliedDate: job.appliedDate.split('T')[0],
    });
  };

  const handleCancelEdit = () => {
    setForm({
      companyName: '',
      jobTitle: '',
      status: 'applied',
      appliedDate: '',
      notes: '',
    });
  };

  return (
    <Router>
      <Box p={6}>
        <Heading mb={4}>Job Tracker</Heading>

        {/* Navigation */}
        <HStack mb={6}>
          <Button as={ChakraRouterLink} to="/jobs" colorScheme="teal">
            Go to Job Tracker
          </Button>
          <Button as={ChakraRouterLink} to="/contact" colorScheme="blue">
            Submit a Contact Message
          </Button>
        </HStack>

        <Routes>
          <Route path="/" element={<Navigate to="/jobs" />} />

          <Route
            path="/jobs"
            element={
              <Flex gap={8} align="flex-start" wrap="wrap">
                {/* Job Table */}
                <Box flex={1} p={4} borderWidth="1px" borderRadius="lg" w="100%">
                  <Heading size="md" mb={4}>
                    Job List
                  </Heading>
                  <Datatable jobs={jobs} onEdit={handleEdit} onDelete={deleteJob} />
                </Box>

                {/* Form */}
                <Box flex={1} p={4} borderWidth="1px" borderRadius="lg" minW="300px">
                  <Heading size="md" mb={4}>
                    {form.id ? 'Edit Job' : 'Add Job'}
                  </Heading>
                  <form onSubmit={addOrUpdateJob}>
                    <VStack spacing={3} align="stretch">
                      <Input
                        name="companyName"
                        value={form.companyName}
                        onChange={handleChange}
                        placeholder="Company Name"
                        required
                      />
                      <Input
                        name="jobTitle"
                        value={form.jobTitle}
                        onChange={handleChange}
                        placeholder="Job Title"
                        required
                      />
                      <Select name="status" value={form.status} onChange={handleChange} required>
                        {statusOptions.map(status => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </Select>
                      <Input
                        name="appliedDate"
                        type="date"
                        value={form.appliedDate}
                        onChange={handleChange}
                        required
                      />
                      <Textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        placeholder="Notes"
                      />
                      <HStack>
                        <Button type="submit" colorScheme="green">
                          {form.id ? 'Update Job' : 'Add Job'}
                        </Button>
                        {form.id && (
                          <Button type="button" onClick={handleCancelEdit}>
                            Leave Edit
                          </Button>
                        )}
                      </HStack>
                    </VStack>
                  </form>
                </Box>
              </Flex>
            }
          />

          <Route path="/contact" element={<ContactForm />} />
        </Routes>
      </Box>
    </Router>
  );
};

export default App;
