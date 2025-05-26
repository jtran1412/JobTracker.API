import React, { useEffect, useState, useMemo } from 'react';
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
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link as RouterLink,
} from 'react-router-dom';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import ContactForm from './ContactForm';
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

type SortColumn = keyof Job | null;
type SortDirection = 'asc' | 'desc';

const PAGE_SIZE = 5;

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [form, setForm] = useState<Partial<Job>>({
    companyName: '',
    jobTitle: '',
    status: 'applied',
    appliedDate: '',
    notes: '',
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<SortColumn>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const [filterText, setFilterText] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetch('/api/JobApplications')
      .then((res) => res.json())
      .then(setJobs)
      .catch((err) => console.error('Failed to load jobs', err));
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesText =
        job.companyName.toLowerCase().includes(filterText.toLowerCase()) ||
        job.jobTitle.toLowerCase().includes(filterText.toLowerCase());
      const matchesStatus = filterStatus ? job.status === filterStatus : true;
      return matchesText && matchesStatus;
    });
  }, [jobs, filterText, filterStatus]);

  const sortedJobs = useMemo(() => {
    if (!sortColumn) return filteredJobs;
    const sorted = [...filteredJobs].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      if (sortColumn === 'appliedDate') {
        return sortDirection === 'asc'
          ? new Date(aVal).getTime() - new Date(bVal).getTime()
          : new Date(bVal).getTime() - new Date(aVal).getTime();
      }

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDirection === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return 0;
    });
    return sorted;
  }, [filteredJobs, sortColumn, sortDirection]);

  const totalJobs = sortedJobs.length;
  const pageCount = Math.ceil(totalJobs / PAGE_SIZE);
  const pagedJobs = sortedJobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const addOrUpdateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `/api/JobApplications/${form.id}` : '/api/JobApplications';

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
        notes: '',
      });
    } catch (err) {
      console.error(err);
    }
  };

  const deleteJob = async (id: number) => {
    await fetch(`/api/JobApplications/${id}`, { method: 'DELETE' });
    setJobs(jobs.filter((j) => j.id !== id));
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

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const goToPage = (page: number) => {
    if (page < 1 || page > pageCount) return;
    setCurrentPage(page);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [filterText, filterStatus, sortColumn, sortDirection]);

  return (
    <Router>
      <Box p={6}>
        <Heading mb={4}>Job Tracker</Heading>

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
              <Flex direction="column" gap={6}>
                <HStack spacing={4} mb={4}>
                  <Input
                    placeholder="Search by Job Title or Company"
                    value={filterText}
                    onChange={(e) => setFilterText(e.target.value)}
                    width="300px"
                  />
                  <Select
                    placeholder="Filter by Status"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    width="200px"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </Select>
                </HStack>

                <Flex gap={8} align="flex-start" wrap="wrap">
                  <Box flex={1} p={4} borderWidth="1px" borderRadius="lg" w="100%" overflowX="auto">
                    <Heading size="md" mb={4}>
                      Job List
                    </Heading>
                    <Table variant="simple" size="sm">
                      <Thead>
                        <Tr>
                          {['companyName', 'jobTitle', 'status', 'appliedDate'].map((col) => (
                            <Th
                              key={col}
                              cursor="pointer"
                              onClick={() => handleSort(col as SortColumn)}
                              userSelect="none"
                            >
                              {col === 'companyName' && 'Company'}
                              {col === 'jobTitle' && 'Job Title'}
                              {col === 'status' && 'Status'}
                              {col === 'appliedDate' && 'Applied Date'}
                              {sortColumn === col ? (
                                sortDirection === 'asc' ? (
                                  <TriangleUpIcon ml={2} />
                                ) : (
                                  <TriangleDownIcon ml={2} />
                                )
                              ) : null}
                            </Th>
                          ))}
                          <Th>Actions</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {pagedJobs.map((job) => (
                          <Tr key={job.id}>
                            <Td>{job.companyName}</Td>
                            <Td>{job.jobTitle}</Td>
                            <Td>{job.status.charAt(0).toUpperCase() + job.status.slice(1)}</Td>
                            <Td>{job.appliedDate.split('T')[0]}</Td>
                            <Td>
                              <Button
                                size="sm"
                                mr={2}
                                colorScheme="yellow"
                                onClick={() => handleEdit(job)}
                              >
                                Edit
                              </Button>
                              <Button
                                size="sm"
                                colorScheme="red"
                                onClick={() => job.id !== undefined && deleteJob(job.id)}
                              >
                                Delete
                              </Button>
                            </Td>
                          </Tr>
                        ))}
                        {pagedJobs.length === 0 && (
                          <Tr>
                            <Td colSpan={5} textAlign="center">
                              No jobs found
                            </Td>
                          </Tr>
                        )}
                      </Tbody>
                    </Table>

                    <Text mt={2}>
                      Showing{' '}
                      {totalJobs === 0
                        ? 0
                        : (currentPage - 1) * PAGE_SIZE + 1}{' '}
                      - {Math.min(currentPage * PAGE_SIZE, totalJobs)} of {totalJobs} jobs
                    </Text>

                    <HStack spacing={2} mt={2}>
                      <Button
                        size="sm"
                        onClick={() => goToPage(currentPage - 1)}
                        isDisabled={currentPage === 1}
                      >
                        Prev
                      </Button>
                      {[...Array(pageCount).keys()].map((idx) => {
                        const pageNum = idx + 1;
                        return (
                          <Button
                            key={pageNum}
                            size="sm"
                            colorScheme={pageNum === currentPage ? 'teal' : undefined}
                            onClick={() => goToPage(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        );
                      })}
                      <Button
                        size="sm"
                        onClick={() => goToPage(currentPage + 1)}
                        isDisabled={currentPage === pageCount}
                      >
                        Next
                      </Button>
                    </HStack>
                  </Box>

                  <Box flex="0 0 320px" p={4} borderWidth="1px" borderRadius="lg" w="100%">
                    <Heading size="md" mb={4}>
                      {form.id ? 'Edit Job' : 'Add Job'}
                    </Heading>
                    <form onSubmit={addOrUpdateJob}>
                      <VStack spacing={4} align="stretch">
                        <Input
                          name="companyName"
                          placeholder="Company Name"
                          value={form.companyName || ''}
                          onChange={handleChange}
                          isRequired
                        />
                        <Input
                          name="jobTitle"
                          placeholder="Job Title"
                          value={form.jobTitle || ''}
                          onChange={handleChange}
                          isRequired
                        />
                        <Select
                          name="status"
                          value={form.status || ''}
                          onChange={handleChange}
                          isRequired
                        >
                          {statusOptions.map((status) => (
                            <option key={status} value={status}>
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                          ))}
                        </Select>
                        <Input
                          name="appliedDate"
                          type="date"
                          value={form.appliedDate || ''}
                          onChange={handleChange}
                          isRequired
                        />
                        <Textarea
                          name="notes"
                          placeholder="Notes (optional)"
                          value={form.notes || ''}
                          onChange={handleChange}
                        />
                        <HStack spacing={4}>
                          <Button colorScheme="teal" type="submit">
                            {form.id ? 'Update' : 'Add'}
                          </Button>
                          {form.id && (
                            <Button onClick={handleCancelEdit}>Cancel</Button>
                          )}
                        </HStack>
                      </VStack>
                    </form>
                  </Box>
                </Flex>
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
