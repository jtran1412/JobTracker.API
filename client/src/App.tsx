// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import JobForm from './components/JobForm';
import JobList from './components/JobList';
import About from './components/About';
import Contact from './components/Contact';
import Privacy from './components/Privacy';

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
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  const addJob = (job: Omit<Job, 'id'>) => {
    fetch('/api/JobApplications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    })
      .then((res) => res.json())
      .then((newJob) => setJobs([...jobs, newJob]));
  };

  const updateJob = (updatedJob: Job) => {
    fetch(`/api/JobApplications/${updatedJob.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedJob),
    }).then(() => {
      setJobs(jobs.map((job) => (job.id === updatedJob.id ? updatedJob : job)));
    });
  };

  const deleteJob = (id: number) => {
    fetch(`/api/JobApplications/${id}`, { method: 'DELETE' }).then(() => {
      setJobs(jobs.filter((job) => job.id !== id));
    });
  };

  return (
    <Router>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Job List</Link>
        <Link to="/aboutme" style={{ marginRight: '10px' }}>About</Link>
        <Link to="/contact" style={{ marginRight: '10px' }}>Contact</Link>
        <Link to="/privacy" style={{ marginRight: '10px' }}>Privacy</Link>
        <Link to="/email">Email Us</Link>
      </nav>

      <Routes>
        <Route
          path="/"
          element={
            <>
              <JobForm onJobAdded={addJob} />
              <JobList jobs={jobs} onJobUpdated={updateJob} onJobDeleted={deleteJob} />
            </>
          }
        />
        <Route path="/aboutme" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
      </Routes>
    </Router>
  );
};

export default App;
