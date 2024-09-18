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

const TreeDataTablePage = () => {
  const [searchName, setSearchName] = useState('');
  const [trees, setTrees] = useState<Tree[]>([]);
  const { loading, error, getTreesByOwnerName, getTreesWithOwners } = useFirestore();
  const { toast } = useToast();

  useEffect(() => {
    console.log('Component mounted');
    loadTrees();
  }, []);

  const loadTrees = async () => {
    try {
      const treesWithOwners = await getTreesWithOwners();
      //   console.log('treesWithOwners', treesWithOwners);
      setTrees(treesWithOwners);
    } catch (err) {
      console.error('Error loading trees:', err);
      toast({
        title: 'Error',
        description: 'Failed to load trees',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = async () => {
    if (!searchName.trim()) {
      toast({
        title: 'Peringatan',
        description: 'Silakan masukkan nama petani',
        variant: 'destructive',
      });
      return;
    }
    try {
      const filteredTrees = await getTreesByOwnerName(searchName);

      setTrees(filteredTrees);
      if (filteredTrees.length === 0) {
        toast({
          title: 'Info',
          description: 'Tidak ada pohon yang ditemukan untuk petani ini',
        });
      }
    } catch (err) {
      console.error('Error searching trees:', err);
      toast({
        title: 'Error',
        description: 'Gagal mencari pohon',
        variant: 'destructive',
      });
    }
  };

  const columns = [
    { title: 'No', dataIndex: 'no', key: 'no', width: 50 },
    { title: 'Kode Pohon', dataIndex: 'code', key: 'code' },
    { title: 'Nama Petani', dataIndex: 'ownerName', key: 'ownerName', render: (ownerName: string) => ownerName || 'Unknown' },
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
        console.log('Full tree record:', record);
        console.log('planting_date:', planting_date, typeof planting_date);
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

  const handleAddTree = () => {
    toast({
      title: 'Info',
      description: 'Fitur tambah pohon akan segera hadir!',
      variant: 'default',
      duration: 3000,
      action: (
        <Button variant="outline" size="sm" onClick={() => console.log('Action clicked')}>
          Oke
        </Button>
      ),
    });
  };

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
          <Input
            placeholder="Masukkan Nama Petani"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
            className="pl-8 w-full pr-24" // Added pr-24 for button space
          />
          <Button onClick={handleSearch} className="absolute right-0 top-0 bottom-0 rounded-l-none">
            Cari
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Daftar Pohon</h3>
        <Button onClick={handleAddTree}>Tambah Data Pohon</Button>
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
            {trees.map((tree, index) => (
              <TableRow key={tree.id}>
                {columns.map((column) => (
                  <TableCell key={`${tree.id}-${column.key}`}>{column.render ? column.render(tree[column.dataIndex as keyof Tree] as any, tree) : String(tree[column.dataIndex as keyof Tree] ?? '')}</TableCell>
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
