'use client';

import React, { useState, useEffect } from 'react';
import { Table, Button, Typography, Input, Space, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { useFirestore } from '@/app/hooks/useFirestore';
import { Tree } from '@/app/db/interfaces';
import { Timestamp } from 'firebase/firestore'; // Tambahkan import ini

const { Title, Paragraph } = Typography;

const TreeDataTablePage = () => {
  const [searchName, setSearchName] = useState('');
  const [trees, setTrees] = useState<Tree[]>([]);
  const { loading, error, getTreesByOwnerName, getTreesWithOwners } = useFirestore();

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
      message.error('Failed to load trees');
    }
  };

  const handleSearch = async () => {
    if (!searchName.trim()) {
      message.warning('Silakan masukkan nama petani');
      return;
    }
    try {
      const filteredTrees = await getTreesByOwnerName(searchName);

      setTrees(filteredTrees);
      if (filteredTrees.length === 0) {
        message.info('Tidak ada pohon yang ditemukan untuk petani ini');
      }
    } catch (err) {
      console.error('Error searching trees:', err);
      message.error('Gagal mencari pohon');
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
    message.info('Fitur tambah pohon akan segera hadir!');
  };

  return (
    <div style={{ padding: '16px' }}>
      <Title level={3}>Laporan Data Pohon</Title>
      <Paragraph>Tabel ini menampilkan data pohon kopi dan durian yang ditanam oleh para petani.</Paragraph>
      <Space direction="vertical" size="middle" style={{ width: '100%', marginBottom: '16px' }}>
        <Input placeholder="Masukkan Nama Petani" value={searchName} onChange={(e) => setSearchName(e.target.value)} style={{ width: '100%', maxWidth: '300px' }} />
        <Space wrap>
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            Cari
          </Button>
          <Button type="default" onClick={loadTrees}>
            Tampilkan Semua
          </Button>
        </Space>
      </Space>
      <Button type="primary" icon={<PlusOutlined />} onClick={handleAddTree} style={{ marginBottom: '16px', float: 'right' }}>
        Tambah Data Pohon
      </Button>
      <Table columns={columns} dataSource={trees.map((tree, index) => ({ ...tree, no: index + 1 }))} rowKey="id" loading={loading} scroll={{ x: true }} size="middle" pagination={{ pageSize: 10, showSizeChanger: true }} />
      {error && <Paragraph type="danger">{error}</Paragraph>}
      {/* <pre>{JSON.stringify({ loading, error, treesCount: trees.length }, null, 2)}</pre> */}
    </div>
  );
};

export default TreeDataTablePage;
