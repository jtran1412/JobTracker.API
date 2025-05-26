import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Table, Thead, Tbody, Tr, Th, Td,
  Button, Box, Flex, Text,
} from '@chakra-ui/react';

// Define a Job interface to replace 'any'
interface Job {
  id: number;
  jobTitle: string;
  companyName: string;
  status: string;
}

const ITEMS_PER_PAGE = 5;

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);  // Use Job[] instead of any[]
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<keyof Job>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get<Job[]>('/api/JobApplications'); // Specify response type as Job[]
        setJobs(response.data);
      } catch (e) {
        setError('Failed to load jobs. Please try again later.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const sortedJobs = [...jobs].sort((a, b) => {
    if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedJobs = sortedJobs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const totalPages = Math.ceil(jobs.length / ITEMS_PER_PAGE);

  const toggleSort = (column: keyof Job) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (jobs.length === 0) return <div>No jobs available</div>;

  return (
    <Box maxW="800px" mx="auto" mt={6}>
      <Text fontSize="xl" mb={4}>Job List</Text>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th cursor="pointer" onClick={() => toggleSort('jobTitle')}>
              Job Title {sortColumn === 'jobTitle' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </Th>
            <Th cursor="pointer" onClick={() => toggleSort('companyName')}>
              Company {sortColumn === 'companyName' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </Th>
            <Th cursor="pointer" onClick={() => toggleSort('status')}>
              Status {sortColumn === 'status' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}
            </Th>
          </Tr>
        </Thead>
        <Tbody>
          {paginatedJobs.map(job => (
            <Tr key={job.id}>
              <Td>{job.jobTitle}</Td>
              <Td>{job.companyName}</Td>
              <Td>{job.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      <Flex justifyContent="space-between" alignItems="center" mt={4}>
        <Text>
          Showing {startIndex + 1} - {Math.min(startIndex + ITEMS_PER_PAGE, jobs.length)} of {jobs.length} jobs
        </Text>

        <Box>
          <Button
            onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            mr={2}
            size="sm"
          >
            Previous
          </Button>
          <Button
            onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            size="sm"
          >
            Next
          </Button>
        </Box>
      </Flex>
    </Box>
  );
};

export default JobList;
