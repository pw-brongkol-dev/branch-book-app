'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFirestore } from '@/app/hooks/useFirestore';
import { Tree } from '@/app/db/interfaces';
import { Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import BackButton from '@/app/components/BackButton';
import { Search } from 'lucide-react';
import Link from 'next/link';

const TreeDataTablePage = () => {
  const [searchName, setSearchName] = useState('');
  const [trees, setTrees] = useState<Tree[]>([]);
  const [filteredTrees, setFilteredTrees] = useState<Tree[]>([]); // State untuk pohon yang sudah difilter
  const [usersMap, setUsersMap] = useState<{ [key: string]: string }>({});
  const { loading, error, getTreesWithOwners, getTreesByOwnerName, getAllUsers } = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    loadTrees();
    loadUsers(); // Load users when component mounts
  }, []);

  useEffect(() => {
    // Trigger pencarian hanya jika nama yang diinput >= 3 karakter
    if (searchName.length >= 3) {
      searchTreesByName(searchName);
    } else {
      setFilteredTrees(trees); // Jika kurang dari 3 karakter, tampilkan semua data pohon
    }
  }, [searchName, trees]);

  const loadTrees = async () => {
    try {
      const treesWithOwners = await getTreesWithOwners();
      setTrees(treesWithOwners);
      setFilteredTrees(treesWithOwners); // Inisialisasi dengan semua data pohon
    } catch (err) {
      console.error('Error loading trees:', err);
      toast({
        title: 'Error',
        description: 'Failed to load trees',
        variant: 'destructive',
      });
    }
  };

  const loadUsers = async () => {
    try {
      const users = await getAllUsers();
      const userMap: { [key: string]: string } = {};
      users.forEach((user) => {
        userMap[user.id] = user.name; // Map user ID to user name
      });
      setUsersMap(userMap);
    } catch (err) {
      console.error('Error loading users:', err);
      toast({
        title: 'Error',
        description: 'Failed to load users',
        variant: 'destructive',
      });
    }
  };

  const searchTreesByName = async (name: string) => {
    try {
      const filtered = await getTreesByOwnerName(name);
      setFilteredTrees(filtered);
    } catch (err) {
      console.error('Error searching trees by owner name:', err);
      toast({
        title: 'Error',
        description: 'Failed to search trees by owner name',
        variant: 'destructive',
      });
    }
  };

  const columns = [
    { title: 'No', dataIndex: 'no', key: 'no', width: 50, render: (_: any, __: Tree, index: number) => index + 1 },
    { title: 'Kode Pohon', dataIndex: 'code', key: 'code' },
    {
      title: 'Nama Petani',
      dataIndex: 'user_id',
      key: 'user_id',
      render: (user_id: string) => usersMap[user_id] || 'Unknown',
    },
    { title: 'Jenis Pohon', dataIndex: 'type', key: 'type' },
    { title: 'Aksesi', dataIndex: 'accession', key: 'accession' },
    {
      title: 'Lokasi',
      dataIndex: 'location',
      key: 'location',
      render: (location: string) => location || 'N/A',
    },
    {
      title: 'Tanggal Penanaman',
      dataIndex: 'planting_date',
      key: 'planting_date',
      render: (planting_date: Timestamp | null | undefined, record: Tree) => {
        if (planting_date && planting_date instanceof Timestamp) {
          const date = planting_date.toDate();
          return date.toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          });
        }
        return 'N/A';
      },
    },
  ];

  return (
    <div className="container mx-auto px-6 py-12 space-y-6">
      <BackButton />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Laporan Data Pohon</h2>
        <p className="text-muted-foreground">Tabel ini menampilkan data pohon kopi dan durian yang ditanam oleh para petani.</p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Masukkan Nama Petani" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="pl-8 w-full pr-24" />
          <Button className="absolute right-0 top-0 bottom-0 rounded-l-none">Cari</Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Daftar Pohon</h3>
        <Link href="/tree/tree-datatable/add-tree">
          <Button>Tambah Data Pohon</Button>
        </Link>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className="font-semibold">
                  {column.title}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTrees.map((tree, index) => (
              <TableRow key={tree.id}>
                {columns.map((column) => (
                  <TableCell key={`${tree.id}-${column.key}`}>{column.render ? column.render(tree[column.dataIndex as keyof Tree] as any, tree, index) : String(tree[column.dataIndex as keyof Tree] ?? '')}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default TreeDataTablePage;
