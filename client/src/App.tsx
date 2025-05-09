// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import JobList from './components/JobList';
import JobForm from './components/JobForm';
import About from './components/About';
import Contact from './components/Contact';
import Privacy from './components/Privacy';
import Navbar from './components/Navbar';

export interface Job {
  id?: number;
  companyName: string;
  jobTitle: string;
  status: string;
  appliedDate: string;
  notes?: string;
}

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetch('/api/JobApplications')
      .then(res => res.json())
      .then(setJobs)
      .catch(err => console.error('Failed to load jobs', err));
  }, []);

  const addJob = async (job: Job) => {
    const response = await fetch('/api/JobApplications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });
    const newJob = await response.json();
    setJobs([...jobs, newJob]);
  };

  const updateJob = async (updatedJob: Job) => {
    await fetch(`/api/JobApplications/${updatedJob.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedJob)
    });
    setJobs(jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
  };

  const deleteJob = async (id: number) => {
    await fetch(`/api/JobApplications/${id}`, { method: 'DELETE' });
    setJobs(jobs.filter(j => j.id !== id));
  };

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/jobs" />} />
        <Route path="/jobs" element={
          <>
            <JobForm onJobAdded={addJob} />
            <JobList jobs={jobs} onJobUpdated={updateJob} onJobDeleted={deleteJob} />
          </>
        } />
        <Route path="/aboutme" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/email" element={<RedirectToMVCEmail />} />
      </Routes>
    </Router>
  );
};

// 👇 Add this helper component to redirect to the MVC Razor form
const RedirectToMVCEmail: React.FC = () => {
  window.location.href = 'https://localhost:5195/MVC/Email';
  return null;
};

export default App;
