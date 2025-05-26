import React from 'react';
import {
  Box,
  HStack,
  Button,
  Text,
} from '@chakra-ui/react';
import {
  createColumnHelper,
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import { Job } from '../types/Job';

interface DataTableProps {
  jobs: Job[];
  onEdit: (job: Job) => void;
  onDelete: (id: number) => void;
}

const columnHelper = createColumnHelper<Job>();

const Datatable: React.FC<DataTableProps> = ({ jobs, onEdit, onDelete }) => {
  const columns = React.useMemo(() => [
    columnHelper.accessor('jobTitle', {
      header: 'Job Title',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('companyName', {
      header: 'Company',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('appliedDate', {
      header: 'Applied Date',
      cell: info => new Date(info.getValue()).toLocaleDateString(),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: info => {
        const job = info.row.original;
        return (
          <HStack spacing={2}>
            <Button size="sm" colorScheme="blue" onClick={() => onEdit(job)}>
              Edit
            </Button>
            <Button size="sm" colorScheme="red" onClick={() => onDelete(job.id!)}>
              Delete
            </Button>
          </HStack>
        );
      },
    }),
  ], [onEdit, onDelete]);

  const table = useReactTable({
    data: jobs,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (jobs.length === 0) {
    return <Text>No jobs yet.</Text>;
  }

  return (
    <Box overflowX="auto">
      <table style={{ width: '100%' }}>
        <thead>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <th key={header.id} style={{ textAlign: 'left', padding: '0.5rem' }}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map(row => (
            <tr key={row.id}>
              {row.getVisibleCells().map(cell => (
                <td key={cell.id} style={{ padding: '0.5rem' }}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Box>
  );
};

export default Datatable;
