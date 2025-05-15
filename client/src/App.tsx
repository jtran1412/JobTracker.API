import React, { useEffect, useState } from 'react'; 
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ContactForm from './ContactForm';
import { Job } from './types/Job';

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

  const handleEdit = (job: Job) => {
    setForm({
      companyName: job.companyName,
      jobTitle: job.jobTitle,
      status: job.status,
      appliedDate: job.appliedDate,
      notes: job.notes || ''
    });
  };

  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <h1>Job Tracker</h1>

        {/* Navigation */}
        <nav style={{ marginBottom: '1rem' }}>
          <button onClick={() => (window.location.href = '/jobs')}>
            Go to Job Tracker
          </button>
          <button onClick={() => (window.location.href = '/contact')} style={{ marginLeft: '1rem' }}>
            Submit a Contact Message
          </button>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/jobs" />} />
          
          <Route path="/jobs" element={
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              {/* Job List on the Left */}
              <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                <h2>Job List</h2>
                {jobs.length === 0 ? (
                  <p>No jobs yet.</p>
                ) : (
                  <ul>
                    {jobs.map(job => (
                      <li key={job.id} style={{ marginBottom: '1rem' }}>
                        <strong>{job.jobTitle}</strong> at {job.companyName} – {job.status}
                        <br />
                        <small>Applied on {new Date(job.appliedDate).toLocaleDateString()}</small>
                        {job.notes && <p>{job.notes}</p>}
                        <button onClick={() => deleteJob(job.id!)}>Delete</button>
                        <button onClick={() => handleEdit(job)} style={{ marginLeft: '1rem' }}>Edit</button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Form on the Right */}
              <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                <h2>{form.id ? 'Edit Job' : 'Add Job'}</h2>
                <form onSubmit={addJob}>
                  <input name="companyName" value={form.companyName} onChange={handleChange} placeholder="Company Name" required /><br />
                  <input name="jobTitle" value={form.jobTitle} onChange={handleChange} placeholder="Job Title" required /><br />
                  <input name="status" value={form.status} onChange={handleChange} placeholder="Status" required /><br />
                  <input name="appliedDate" type="date" value={form.appliedDate} onChange={handleChange} required /><br />
                  <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" /><br />
                  <button type="submit">{form.id ? 'Update Job' : 'Add Job'}</button>
                </form>
              </div>
            </div>
          } />

          <Route path="/contact" element={<ContactForm />} />
          <Route path="/aboutme" element={<p>About Me Page</p>} />
          <Route path="/privacy" element={<p>Privacy Page</p>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
