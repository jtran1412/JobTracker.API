import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link
} from 'react-router-dom';
import ContactForm from './ContactForm';
import { Job, JobStatus } from './types/Job';

const statusOptions: JobStatus[] = [
  'applied',
  'got interview',
  'interviewed',
  'rejected',
  'got offer',
];

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<Partial<Job>>({
    companyName: '',
    jobTitle: '',
    status: 'applied',
    appliedDate: '',
    notes: ''
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

      setJobs((prev) =>
        form.id ? prev.map((j) => (j.id === savedJob.id ? savedJob : j)) : [...prev, savedJob]
      );

      setForm({
        companyName: '',
        jobTitle: '',
        status: 'applied',
        appliedDate: '',
        notes: ''
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (id: number) => {
    await fetch(`/api/JobApplications/${id}`, { method: 'DELETE' });
    setJobs(jobs.filter(j => j.id !== id));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEdit = (job: Job) => {
    setForm({
      ...job,
      appliedDate: job.appliedDate.split('T')[0]
    });
  };

  const handleCancelEdit = () => {
    setForm({
      companyName: '',
      jobTitle: '',
      status: 'applied',
      appliedDate: '',
      notes: ''
    });
  };

  return (
    <Router>
      <div style={{ padding: '1rem' }}>
        <h1>Job Tracker</h1>

        {/* Navigation */}
        <nav style={{ marginBottom: '1rem' }}>
          <Link to="/jobs"><button>Go to Job Tracker</button></Link>
          <Link to="/contact"><button style={{ marginLeft: '1rem' }}>Submit a Contact Message</button></Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/jobs" />} />

          <Route path="/jobs" element={
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
              {/* Job List */}
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

              {/* Form */}
              <div style={{ flex: 1, border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
                <h2>{form.id ? 'Edit Job' : 'Add Job'}</h2>
                <form onSubmit={addOrUpdateJob}>
                  <input
                    name="companyName"
                    value={form.companyName}
                    onChange={handleChange}
                    placeholder="Company Name"
                    required
                  /><br />

                  <input
                    name="jobTitle"
                    value={form.jobTitle}
                    onChange={handleChange}
                    placeholder="Job Title"
                    required
                  /><br />

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    required
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select><br />

                  <input
                    name="appliedDate"
                    type="date"
                    value={form.appliedDate}
                    onChange={handleChange}
                    required
                  /><br />

                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Notes"
                  /><br />

                  <button type="submit">{form.id ? 'Update Job' : 'Add Job'}</button>
                  {form.id && (
                    <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '1rem' }}>
                      Leave Edit
                    </button>
                  )}
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
