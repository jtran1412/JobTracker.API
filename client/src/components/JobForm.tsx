// src/components/JobForm.tsx
import React, { useState } from 'react';
import { Job } from '../App';

interface JobFormProps {
  onJobAdded: (job: Omit<Job, 'id'>) => void;
}

const JobForm: React.FC<JobFormProps> = ({ onJobAdded }) => {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [status, setStatus] = useState('');
  const [appliedDate, setAppliedDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newJob: Omit<Job, 'id'> = {
      companyName,
      jobTitle,
      status,
      appliedDate,
      notes,
    };

    onJobAdded(newJob);

    // Clear the form
    setCompanyName('');
    setJobTitle('');
    setStatus('');
    setAppliedDate('');
    setNotes('');
  };

  return (
    <div>
      <h2>Add a Job Application</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Company Name:</label>
          <input
            type="text"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => setJobTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Status:</label>
          <input
            type="text"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Applied Date:</label>
          <input
            type="date"
            value={appliedDate}
            onChange={(e) => setAppliedDate(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Notes:</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit">Add Job</button>
      </form>
    </div>
  );
};

export default JobForm;
