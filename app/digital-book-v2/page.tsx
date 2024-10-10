'use client';

import * as React from 'react';
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import BackButton from '../components/BackButton';
import Link from 'next/link';
import addIcon from '@/app/icons/add_40dp_1C1B1F.svg';
import docIcon from '@/app/icons/description_40dp_1C1B1F.svg';
import Image from 'next/image';
import Footer from '../components/Footer';
import { dummyPemasukan, dummyPengeluaran } from './dummyData';

export type Payment = {
  id: string;
  nominal: number;
  date: string;
  name_account: string;
  ref: string;
  information: string;
};

const columns: ColumnDef<Payment>[] = [
  {
    header: 'No',
    cell: ({ row }) => {
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
      const nominal = row.getValue('nominal');
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(nominal);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
];

// Convert dummyPemasukan data to the Payment type
const pemasukanData: Payment[] = dummyPemasukan.map((item) => ({
  id: item.No.toString(),
  nominal: parseFloat(item.Nominal.replace(/[^\d.-]/g, '')),
  date: item.Tanggal,
  name_account: item.NamaAkun,
  ref: item.Ref,
  information: item.Keterangan,
}));

// Convert dummyPengeluaran data to the Payment type
const pengeluaranData: Payment[] = dummyPengeluaran.map((item) => ({
  id: item.No.toString(),
  nominal: parseFloat(item.Nominal.replace(/[^\d.-]/g, '')),
  date: item.Tanggal,
  name_account: item.NamaAkun,
  ref: item.Ref,
  information: item.Keterangan,
}));

const TableViewBook = () => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [pemasukanPagination, setPemasukanPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const [pengeluaranPagination, setPengeluaranPagination] = React.useState({
    pageIndex: 0,
    pageSize: 5,
  });

  const pemasukanTable = useReactTable({
    data: pemasukanData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: pemasukanPagination,
    },
    manualPagination: false,
    pageCount: Math.ceil(pemasukanData.length / pemasukanPagination.pageSize),
  });

  const pengeluaranTable = useReactTable({
    data: pengeluaranData,
    columns,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      pagination: pengeluaranPagination,
    },
    manualPagination: false,
    pageCount: Math.ceil(pengeluaranData.length / pengeluaranPagination.pageSize),
  });

  return (
    <div className="relative min-h-dvh">
      <BackButton color="violet" />

      <div className="flex flex-col gap-6">
        <div className="flex px-6 pt-4 gap-2">
          <Link href={'/digital-book-v2/input-nota'} className="flex-1">
            <div className="bg-[#FFE49E] active:ring-4 active:ring-[#ffebb9] active:bg-[#ffdc85] p-4 rounded-2xl flex flex-col gap-1">
              <Image src={addIcon} alt="add icon" width={40} height={40} />
              <span className="font-medium inline-block leading-5">
                Tambah Data
                <br />
                Transaksi
              </span>
            </div>
          </Link>
          <Link href={'/digital-book-v2/reports'} className="flex-1">
            <div className="bg-violet-200 active:ring-4 active:ring-violet-200 active:bg-violet-300 p-4 rounded-2xl flex flex-col gap-1">
              <Image src={docIcon} alt="add icon" />
              <span className="font-medium inline-block leading-5">
                Laporan
                <br />
                Keuangan
              </span>
            </div>
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {/* Table for Data Pemasukan */}
          <div className="flex flex-col gap-2 px-6">
            <span className="text-2xl">Data Pemasukan</span>
            <div>
              <div className="bg-white shadow-sm rounded-2xl p-3 border border-violet-200">
                <Table>
                  <TableHeader>
                    {pemasukanTable.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {pemasukanTable.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => pemasukanTable.previousPage()} disabled={!pemasukanTable.getCanPreviousPage()}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => pemasukanTable.nextPage()} disabled={!pemasukanTable.getCanNextPage()}>
                  Next
                </Button>
              </div>
            </div>
          </div>

          {/* Table for Data Pengeluaran */}
          <div className="flex flex-col gap-2 px-6 mt-2">
            <span className="text-2xl">Data Pengeluaran</span>
            <div>
              <div className="bg-white shadow-sm rounded-2xl p-3 border border-violet-200">
                <Table>
                  <TableHeader>
                    {pengeluaranTable.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id}>
                            {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {pengeluaranTable.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-between space-x-2 py-4">
                <Button variant="outline" size="sm" onClick={() => pengeluaranTable.previousPage()} disabled={!pengeluaranTable.getCanPreviousPage()}>
                  Previous
                </Button>
                <Button variant="outline" size="sm" onClick={() => pengeluaranTable.nextPage()} disabled={!pengeluaranTable.getCanNextPage()}>
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="relative bottom-0">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default TableViewBook;
