'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useFirestore } from '@/app/hooks/useFirestore';
import { Tree } from '@/app/db/interfaces';
import { Timestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';

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
    });
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-2">Laporan Data Pohon</h2>
      <p className="mb-4">Tabel ini menampilkan data pohon kopi dan durian yang ditanam oleh para petani.</p>
      <div className="space-y-4 mb-4">
        <Input placeholder="Masukkan Nama Petani" value={searchName} onChange={(e) => setSearchName(e.target.value)} className="max-w-sm" />
        <div className="space-x-2">
          <Button onClick={handleSearch}>Cari</Button>
          <Button variant="outline" onClick={loadTrees}>
            Tampilkan Semua
          </Button>
        </div>
      </div>
      <Button onClick={handleAddTree} className="mb-4 float-right">
        Tambah Data Pohon
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.title}</TableHead>
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
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default TreeDataTablePage;
