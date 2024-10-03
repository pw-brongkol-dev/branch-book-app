'use client';

import * as React from 'react';
import { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BackButton from '../components/BackButton';
import Link from 'next/link';
import { useFirestore } from '../hooks/useFirestore';
import { useState, useEffect } from 'react';

// const data: Payment[] = [
//   {
//     id: 'm5gr84i9',
//     nominal: 316000,
//     date: '12 September 2024',
//     name_account: 'Kas',
//     ref: ' ',
//     information: 'Penjualan kopi',
//   },
//   {
//     id: 'm5gr84i9',
//     nominal: 316000,
//     date: '12 September 2024',
//     name_account: 'Kas',
//     ref: ' ',
//     information: 'Penjualan kopi',
//   },
//   {
//     id: 'm5gr84i9',
//     nominal: 316000,
//     date: '12 September 2024',
//     name_account: 'Kas',
//     ref: ' ',
//     information: 'Penjualan kopi',
//   },
//   {
//     id: 'm5gr84i9',
//     nominal: 316000,
//     date: '12 September 2024',
//     name_account: 'Kas',
//     ref: ' ',
//     information: 'Penjualan kopi',
//   },
//   {
//     id: 'm5gr84i9',
//     nominal: 316000,
//     date: '12 September 2024',
//     name_account: 'Kas',
//     ref: ' ',
//     information: 'Penjualan kopi',
//   },
//   {
//     id: 'm5gr84i9',
//     nominal: 316000,
//     date: '12 September 2024',
//     name_account: 'Kas',
//     ref: ' ',
//     information: 'Penjualan kopi',
//   },
//   {
//     id: 'm5gr84i9',
//     nominal: 316000,
//     date: '12 September 2024',
//     name_account: 'Kas',
//     ref: ' ',
//     information: 'Penjualan kopi',
//   },
//   {
//     id: 'm5gr84i9',
//     nominal: 316000,
//     date: '12 September 2024',
//     name_account: 'Kas',
//     ref: ' ',
//     information: 'Penjualan kopi',
//   },
//   {
//     id: 'm5gr84i9',
//     nominal: 316000,
//     date: '12 September 2024',
//     name_account: 'Kas',
//     ref: ' ',
//     information: 'Penjualan kopi',
//   },
//   {
//     id: 'm5gr84i9',
//     nominal: 316000,
//     date: '12 September 2024',
//     name_account: 'Kas',
//     ref: ' ',
//     information: 'Penjualan kopi',
//   },
//   {
//     id: 'm5gr84i9',
//     nominal: 316000,
//     date: '12 September 2024',
//     name_account: 'Kas',
//     ref: ' ',
//     information: 'Penjualan kopi',
//   },
//   {
//     id: 'm5gr84i9',
//     nominal: 316000,
//     date: '12 September 2024',
//     name_account: 'Kas',
//     ref: ' ',
//     information: 'Penjualan kopi',
//   },
// ];

export type Payment = {
  id: string;
  nominal: number;
  date: string;
  name_account: string;
  ref: string;
  information: string;
};

export const columns: ColumnDef<Payment>[] = [
  {
    header: 'No',
    cell: ({ row, table }) => {
      const rowIndex = row.index + 1;
      return <div>{rowIndex}</div>;
    },
  },

  {
    accessorKey: 'date',
    header: 'Tanggal',
    cell: ({ row }) => <div>{row.getValue('date')}</div>,
  },
  {
    accessorKey: 'information',
    header: 'Keterangan',
    cell: ({ row }) => <div>{row.getValue('information')}</div>,
  },
  {
    accessorKey: 'name_account',
    header: 'Nama Akun',
    cell: ({ row }) => <div>{row.getValue('name_account')}</div>,
  },
  {
    accessorKey: 'ref',
    header: 'Ref',
    cell: ({ row }) => <div>{row.getValue('ref')}</div>,
  },
  {
    accessorKey: 'nominal',
    header: () => <div className="text-right">Nominal (Rp)</div>,
    cell: ({ row }) => {
      const nominal = parseFloat(row.getValue('nominal'));

      // Format the nominal as Rupiah
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(nominal);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];

const TableViewNota = () => {
  const { getTransactionsByUserId, getAllAccounts } = useFirestore()
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [data, setData] = useState([])
  const [fetchStatus, setFetchStatus] = useState('idle')
  
  useEffect(() => {
    fetchData()
  },[])

  const fetchData = async () => {
    setFetchStatus('loading')
    const userId = localStorage.getItem('user_id_branch_book_app');
    if (userId) {
      try {
        const transactions = await getTransactionsByUserId(userId);
        const accounts = await getAllAccounts();

        const transactionData = transactions.map((transaction) => ({
          id: transaction.id,
          nominal: transaction.total_amount,
          date: transaction.date.toDate().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          name_account: accounts.find(account => account.id === transaction.account_id)?.name || '', // find account name by transactiion.account_id
          ref: '',
          information: transaction.description,
        }))

        setData(transactionData);
        console.log(transactionData);
        setFetchStatus('completed')
      } catch (err) {
        console.error('error', err);
        setFetchStatus('error')
      }
    }
  }

  // Pagination state management
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
    manualPagination: false, // Using the table's internal pagination
    pageCount: Math.ceil(data.length / pagination.pageSize), // Adjust if you have server-side data
  });

  if (fetchStatus === 'idle') {
    return <div>loading...</div>
  }

  if (fetchStatus === 'loading') {
    return <div>loading</div>
  }

  if (fetchStatus === 'error') {
    return <div>try again</div>
  }

  return (
    <div className="w-full p-6 bg-gray-100 min-h-screen">
      <div className='max-w-md mx-auto'>
      <BackButton />
      <div className="mt-8">
        <div className="flex flex-col mb-4 p-4 ">
          <h1 className="text-2xl font-bold text-gray-800">Daftar Transaksi</h1>
          <div className="flex justify-end mt-2">
            <Link href="/digital-book/input-nota">
              <Button className="bg-blue-600 text-white hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105">Input Nota Transaksi</Button>
            </Link>
            <div className="mx-2" /> {/* Tambahkan padding di sini */}
            <Link href="/digital-book/reports">
              <Button className="bg-green-600 text-white hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105">Unduh Laporan</Button>
            </Link>
          </div>
        </div>
        <div className="bg-white shadow-sm rounded-md p-3">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return <TableHead key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}</TableHead>;
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'} className="hover:bg-gray-100 transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between space-x-2 py-4">
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.previousPage();
                setPagination((prev) => ({ ...prev, pageIndex: table.getState().pagination.pageIndex - 1 }));
              }}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                table.nextPage();
                setPagination((prev) => ({ ...prev, pageIndex: table.getState().pagination.pageIndex + 1 }));
              }}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default TableViewNota;