// src/App.tsx
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ContactForm from './ContactForm'; // import ContactForm component

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

  const [form, setForm] = useState<Job>({
    companyName: '',
    jobTitle: '',
    status: '',
    appliedDate: '',
    notes: ''
  });

  useEffect(() => {
    fetch('/api/JobApplications')
      .then(res => res.json())
      .then(setJobs)
      .catch(err => console.error('Failed to load jobs', err));
  }, []);

  const addJob = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/JobApplications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (!res.ok) {
        console.error('Failed to add job');
        return;
      }

      const newJob = await res.json();
      setJobs(prev => [...prev, newJob]);
      setForm({ companyName: '', jobTitle: '', status: '', appliedDate: '', notes: '' });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (id: number) => {
    await fetch(`/api/JobApplications/${id}`, { method: 'DELETE' });
    setJobs(jobs.filter(j => j.id !== id));
  };

  const updateJob = async (updatedJob: Job) => {
    await fetch(`/api/JobApplications/${updatedJob.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedJob)
    });
    setJobs(jobs.map(j => j.id === updatedJob.id ? updatedJob : j));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <h1>Job Tracker</h1>
        <nav>
          <button onClick={() => window.location.href = '/contact'}>
            Submit a Contact Message
          </button>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/jobs" />} />
          <Route path="/jobs" element={
            <>
              <form onSubmit={addJob} style={{ marginBottom: '2rem' }}>
                <h2>Add Job</h2>
                <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company Name" required />
                <input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Job Title" required />
                <input name="status" value={form.status} onChange={handleChange} placeholder="Status" required />
                <input name="appliedDate" type="date" value={form.appliedDate} onChange={handleChange} required />
                <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" />
                <button type="submit">Add Job</button>
              </form>

              <h2>Job List</h2>
              {jobs.length === 0 ? (
                <p>No jobs yet.</p>
              ) : (
                <ul>
                  {jobs.map(job => (
                    <li key={job.id}>
                      <strong>{job.jobTitle}</strong> at {job.companyName} – {job.status}
                      <br />
                      <small>Applied on {job.appliedDate}</small>
                      {job.notes && <p>{job.notes}</p>}
                      <button onClick={() => deleteJob(job.id!)}>Delete</button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          } />
          <Route path="/contact" element={<ContactForm />} /> {/* Add ContactForm route */}
          <Route path="/aboutme" element={<p>About Me Page</p>} />
          <Route path="/privacy" element={<p>Privacy Page</p>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
