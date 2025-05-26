// src/components/DataTable.tsx
import React from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Text,
} from '@chakra-ui/react';
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnDef,
} from '@tanstack/react-table';

interface JobApplication {
  id: number;
  companyName: string;
  jobTitle: string;
  status: string;
  appliedDate: string;
  notes?: string;
}

interface DataTableProps {
  data: JobApplication[];
}

const columns: ColumnDef<JobApplication>[] = [
  {
    accessorKey: 'companyName',
    header: 'Company',
  },
  {
    accessorKey: 'jobTitle',
    header: 'Title',
  },
  {
    accessorKey: 'status',
    header: 'Status',
  },
  {
    accessorKey: 'appliedDate',
    header: 'Applied',
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
  },
];

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Box p={4}>
      <Text fontSize="xl" mb={4}>
        Job Applications
      </Text>
      <TableContainer>
        <Table variant="simple">
          <Thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <Tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <Th key={header.id}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </Th>
                ))}
              </Tr>
            ))}
          </Thead>
          <Tbody>
            {table.getRowModel().rows.map((row) => (
              <Tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <Td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
