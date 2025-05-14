import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState<any[]>([]);  // State to store jobs
  const [loading, setLoading] = useState<boolean>(true);  // Loading state
  const [error, setError] = useState<string>('');  // Error state

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('/api/JobApplications');  // Fetch data from API
        setJobs(response.data);  // Set jobs to state
      } catch (error: any) {
        setError('Failed to load jobs. Please try again later.');
        console.error('Error fetching jobs:', error);  // Log errors for debugging
      } finally {
        setLoading(false);  // Set loading to false once data is fetched
      }
    };

    fetchJobs();
  }, []);  // Runs once when the component mounts

  if (loading) {
    return <div>Loading...</div>;  // Show loading message
  }

  if (error) {
    return <div>{error}</div>;  // Show error message if any
  }

  if (jobs.length === 0) {
    return <div>No jobs available</div>;  // Show message if no jobs are available
  }

  return (
    <div>
      <h1>Job List</h1>
      <ul>
        {jobs.map((job: any) => (
          <li key={job.id}>
            {job.jobTitle} at {job.companyName} - {job.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default JobList;
