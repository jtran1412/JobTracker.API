// src/components/JobList.tsx
import React from 'react';
import { Job } from '../App'; // Adjust if your Job interface is declared elsewhere

interface JobListProps {
  jobs: Job[];
  onJobUpdated: (updatedJob: Job) => void;
  onJobDeleted: (jobId: number) => void;
}

const JobList: React.FC<JobListProps> = ({ jobs, onJobUpdated, onJobDeleted }) => {
  const handleUpdate = (job: Job) => {
    const updatedJob = { ...job, status: 'Updated Status' }; // Example change
    onJobUpdated(updatedJob);
  };

  const handleDelete = (jobId: number) => {
    onJobDeleted(jobId);
  };

  return (
    <div>
      <h2>Job List</h2>
      <ul>
        {jobs.map((job) => (
          <li key={job.id}>
            <strong>{job.companyName}</strong> - {job.jobTitle} - {job.status} - {job.appliedDate}
            {job.notes && <p>Notes: {job.notes}</p>}
            <div>
              <button onClick={() => handleUpdate(job)}>Update</button>
              <button onClick={() => handleDelete(job.id!)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
