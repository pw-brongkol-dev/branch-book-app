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
import { useState, useEffect } from 'react';
import { useFirestore } from '../hooks/useFirestore';
import { useRouter } from 'next/navigation';

export type PaymentGroup = {
  id: string;
  nominal: number;
  date: string;
  name_account: string;
  product_name: string;
  quantity: number | null;
  unit_price: number | null;
  ref: string;
  information: string;
  created_by_name: string;
};

const columns: ColumnDef<PaymentGroup>[] = [
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
    cell: ({ row }) => <div className="text-xs">{row.getValue('date')}</div>,
  },
  {
    accessorKey: 'information',
    header: 'Keterangan',
    cell: ({ row }) => <div className="text-xs">{row.getValue('information')}</div>,
  },
  {
    accessorKey: 'product_name',
    header: 'Produk',
    cell: ({ row }) => <div className="text-xs">{row.getValue('product_name') || '-'}</div>,
  },
  {
    accessorKey: 'name_account',
    header: 'Nama Akun',
    cell: ({ row }) => <div className="text-xs">{row.getValue('name_account')}</div>,
  },
  {
    accessorKey: 'quantity',
    header: 'Qty',
    cell: ({ row }) => {
      const qty = row.getValue('quantity') as number | null;
      return <div className="text-xs text-right">{qty || '-'}</div>;
    },
  },
  {
    accessorKey: 'unit_price',
    header: 'Harga Satuan',
    cell: ({ row }) => {
      const price = row.getValue('unit_price');
      if (!price) return <div className="text-xs text-right">-</div>;
      const formatted = new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
      }).format(price as number);
      return <div className="text-xs text-right">{formatted}</div>;
    },
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
      }).format(nominal as number);

      return <div className="text-xs text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'created_by_name',
    header: 'Dibuat Oleh',
    cell: ({ row }) => <div className="text-xs">{row.getValue('created_by_name')}</div>,
  },
];

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-lg font-bold">Konfirmasi</h2>
        <p>Apakah Anda yakin ingin menghapus item ini?</p>
        <div className="flex justify-end space-x-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            Batal
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-500 text-white rounded">
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

const TableViewBookKelompok = () => {
  const router = useRouter();
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [kelompokName, setKelompokName] = useState('');
  const [kelompokId, setKelompokId] = useState('');
  const [pemasukanData, setDataPemasukan] = useState<PaymentGroup[]>([]);
  const [pengeluaranData, setDataPengeluaran] = useState<PaymentGroup[]>([]);
  const [fetchStatus, setFetchStatus] = useState('idle');
  const [isModalOpen, setModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PaymentGroup | null>(null);

  const {
    getUserById,
    getTransactionsGroupByUserId,
    getAllAccountsGroup,
    getProductsGroupByUserId,
    deleteTransactionGroup,
  } = useFirestore();

  useEffect(() => {
    handleProcess();
  }, []);

  async function handleProcess() {
    const userId = localStorage.getItem('user_id_branch_book_app');
    if (!userId) {
      router.push('/auth/login');
      return;
    }

    try {
      setFetchStatus('loading');

      // Get current user
      const user = await getUserById(userId);
      if (!user || !user.group_id) {
        alert('Anda belum terdaftar di kelompok manapun.');
        router.push('/');
        return;
      }

      // Get kelompok data (kelompok adalah user dengan is_group: true)
      const kelompokId = userId;
      const kelompok = await getUserById(kelompokId);
      if (!kelompok || !kelompok.is_group) {
        alert('Data kelompok tidak valid.');
        router.push('/');
        return;
      }

      setKelompokId(kelompokId);
      setKelompokName(kelompok.name);

      // Fetch all data using kelompokId
      const transactions = await getTransactionsGroupByUserId(kelompokId);
      const accounts = await getAllAccountsGroup();
      const products = await getProductsGroupByUserId(kelompokId);

      // Get all group members for created_by names
      const allUsers = await getUserById(userId); // This should be getAllUsers but we'll use what we have

      // Process transactions
      const pemasukanAllData: PaymentGroup[] = [];
      const pengeluaranAllData: PaymentGroup[] = [];

      for (const transaction of transactions) {
        const account = accounts.find((acc) => acc.id === transaction.account_id);
        const product = products.find((prod) => prod.id === transaction.product_id);
        const creator = await getUserById(transaction.created_by);

        const data: PaymentGroup = {
          id: transaction.id,
          nominal: transaction.total_amount,
          date: transaction.date.toDate().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          name_account: account ? account.name : '',
          product_name: product ? product.name : '',
          quantity: transaction.quantity || null,
          unit_price: transaction.unit_price || null,
          ref: transaction.ref,
          information: transaction.description,
          created_by_name: creator ? creator.name : 'Unknown',
        };

        if (transaction.type === 'pemasukan') {
          pemasukanAllData.push(data);
        } else if (transaction.type === 'pengeluaran') {
          pengeluaranAllData.push(data);
        }
      }

      setDataPemasukan(pemasukanAllData);
      setDataPengeluaran(pengeluaranAllData);
      setFetchStatus('success');
    } catch (err) {
      console.error('error', err);
      setFetchStatus('error');
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteTransactionGroup(id);
      handleProcess(); // Refresh data
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const openModal = (item: PaymentGroup) => {
    setItemToDelete(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setItemToDelete(null);
  };

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
      <BackButton color="blue" />

      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="px-6 pt-4">
          <h1 className="text-2xl font-bold text-gray-800">Buku Usaha Digital Kelompok</h1>
          <p className="text-sm text-gray-600">Kelompok: {kelompokName || 'Loading...'}</p>
        </div>

        {/* Menu Cards */}
        <div className="flex px-6 gap-2">
          <Link href={'/digital-book-kelompok/input-nota'} className="flex-1">
            <div className="bg-[#FFE49E] active:ring-4 active:ring-[#ffebb9] active:bg-[#ffdc85] p-4 rounded-2xl flex flex-col gap-1">
              <Image src={addIcon} alt="add icon" width={40} height={40} />
              <span className="font-medium inline-block leading-5">
                Tambah
                <br />
                Transaksi
              </span>
            </div>
          </Link>
          <Link href={'/digital-book-kelompok/products'} className="flex-1">
            <div className="bg-teal-200 active:ring-4 active:ring-teal-200 active:bg-teal-300 p-4 rounded-2xl flex flex-col gap-1">
              <Image src={addIcon} alt="products icon" width={40} height={40} />
              <span className="font-medium inline-block leading-5">
                Kelola
                <br />
                Produk
              </span>
            </div>
          </Link>
          <Link href={'/digital-book-kelompok/reports'} className="flex-1">
            <div className="bg-blue-200 active:ring-4 active:ring-blue-200 active:bg-blue-300 p-4 rounded-2xl flex flex-col gap-1">
              <Image src={docIcon} alt="reports icon" />
              <span className="font-medium inline-block leading-5">
                Laporan
                <br />
                Keuangan
              </span>
            </div>
          </Link>
        </div>

        {fetchStatus === 'success' ? (
          <div className="flex flex-col gap-6">
            {/* Table for Data Pemasukan */}
            <div className="flex flex-col gap-2 px-6">
              <span className="text-2xl">Data Pemasukan</span>
              <div>
                <div className="bg-white shadow-sm rounded-2xl p-3 border border-blue-200 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      {pemasukanTable.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} className="text-xs">
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          ))}
                          <TableHead className="text-xs">Actions</TableHead>
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {pemasukanTable.getRowModel().rows.length ? (
                        pemasukanTable.getRowModel().rows.map((row) => (
                          <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                            ))}
                            <TableCell>
                              <button onClick={() => openModal(row.original)} className="text-red-500 text-xs">
                                Hapus
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length + 1} className="text-center text-sm">
                            Belum ada data pemasukan.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pemasukanTable.previousPage()}
                    disabled={!pemasukanTable.getCanPreviousPage()}
                  >
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
                <div className="bg-white shadow-sm rounded-2xl p-3 border border-blue-200 overflow-x-auto">
                  <Table>
                    <TableHeader>
                      {pengeluaranTable.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                          {headerGroup.headers.map((header) => (
                            <TableHead key={header.id} className="text-xs">
                              {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                            </TableHead>
                          ))}
                          <TableHead className="text-xs">Actions</TableHead>
                        </TableRow>
                      ))}
                    </TableHeader>
                    <TableBody>
                      {pengeluaranTable.getRowModel().rows.length ? (
                        pengeluaranTable.getRowModel().rows.map((row) => (
                          <TableRow key={row.id}>
                            {row.getVisibleCells().map((cell) => (
                              <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                            ))}
                            <TableCell>
                              <button onClick={() => openModal(row.original)} className="text-red-500 text-xs">
                                Hapus
                              </button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={columns.length + 1} className="text-center text-sm">
                            Belum ada data pengeluaran.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
                <div className="flex items-center justify-between space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pengeluaranTable.previousPage()}
                    disabled={!pengeluaranTable.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => pengeluaranTable.nextPage()}
                    disabled={!pengeluaranTable.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : fetchStatus === 'loading' ? (
          <p className="text-center">Loading...</p>
        ) : fetchStatus === 'error' ? (
          <p className="text-center text-red-500">Terjadi kesalahan saat memuat data.</p>
        ) : (
          <p className="text-center">Memuat data...</p>
        )}

        <ConfirmationModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onConfirm={() => {
            if (itemToDelete) {
              handleDelete(itemToDelete.id);
            }
            closeModal();
          }}
        />

        <div className="relative bottom-0">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default TableViewBookKelompok;
