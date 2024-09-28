'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BackButton from '@/app/components/BackButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore } from '@/app/hooks/useFirestore';
import { toast } from '@/hooks/use-toast';
import { Fertilization, Group, User, Tree } from '@/app/db/interfaces';
import { Timestamp } from 'firebase/firestore';

const AddTreeForm = () => {
  const { addTree, addUser, getAllGroups, getAllUsers, getAllTrees, getAllFertilizations, addRelTreeFertilization } = useFirestore();

  // State management
  const [formData, setFormData] = useState({
    code: '',
    type: '',
    accession: '',
    location: '',
    plantingDate: '',
    user_id: '',
  });

  const [newUser, setNewUser] = useState({
    name: '',
    group_id: '',
  });

  const [groups, setGroups] = useState<Group[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [trees, setTrees] = useState<Tree[]>([]);
  const [fertData, setFertData] = useState<Fertilization[]>([]);
  const [loading, setLoading] = useState(false);
  const [example, setExample] = useState('abc');

  useEffect(() => {
    console.log(example);
    setExample('def');
    console.log(example);
  }, [example]);

  // Fetch groups and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupData = await getAllGroups();
        const userData = await getAllUsers();
        const fertData = await getAllFertilizations();
        const treeData = await getAllTrees();
        setGroups(groupData);
        setUsers(userData);
        setFertData(fertData);
        setTrees(treeData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [getAllGroups, getAllUsers, getAllFertilizations, getAllTrees]);

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Handle user input changes
  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  // Handle tree type selection
  const handleTypeChange = (value: string) => {
    setFormData((prevData) => ({ ...prevData, type: value }));

    let selectedGroup = null;
    if (value === 'Durian') {
      selectedGroup = groups.find((group) => group.name === 'Ajuning Tani');
    } else if (value === 'Kopi') {
      selectedGroup = groups.find((group) => group.name === 'Karya Bakti 1');
    }

    if (selectedGroup) {
      setNewUser((prevUser) => ({ ...prevUser, group_id: selectedGroup?.id }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const plantingDateTimestamp = formData.plantingDate ? Timestamp.fromDate(new Date(formData.plantingDate)) : Timestamp.now();

      // Menyalin formData dan menambahkan planting_date
      let finalFormData = {
        ...formData,
        planting_date: plantingDateTimestamp,
        user_id: '', // Inisialisasi awal
      };

      // Format nama user
      const formattedName = newUser.name.charAt(0).toUpperCase() + newUser.name.slice(1).toLowerCase();
      const userExists = users.some((user) => user.name.toLowerCase() === formattedName.toLowerCase());

      let newUserId: string | undefined;

      if (!userExists) {
        // Tambahkan pengguna baru dan ambil ID-nya
        const addedUser = await addUser({ ...newUser, name: formattedName }); // pastikan await di sini
        newUserId = addedUser.id; // Asumsikan addUser mengembalikan objek user dengan id
        console.log('User added:', addedUser);
        toast({ title: 'User added successfully' });
      } else {
        // Ambil ID pengguna yang sudah ada
        const foundUser = users.find((user) => user.name.toLowerCase() === formattedName.toLowerCase());
        newUserId = foundUser?.id;
      }

      // Pastikan user_id sudah valid, dan masukkan ke finalFormData
      if (newUserId) {
        finalFormData = {
          ...finalFormData,
          user_id: newUserId,
        };
      } else {
        console.error('User ID is undefined');
        throw new Error('User ID not found');
      }

      // Tunggu sampai data pohon berhasil ditambahkan dengan user_id
      console.log('Tree data with user_id:', finalFormData);
      await addTree(finalFormData); // Pastikan menunggu sampai addTree selesai
      toast({ title: 'Data pohon berhasil ditambahkan' });

      // Cari pohon yang baru ditambahkan berdasarkan kode
      const newTree = trees.find((tree) => tree.code === finalFormData.code);
      console.log('ini newtree', newTree);

      const fertilizationRelations = fertData.map((fertilization) => ({
        fertilization_id: fertilization.id,
        is_completed: false,
        tree_id: newTree?.id || '', // Pastikan tree_id valid
      }));

      for (const relation of fertilizationRelations) {
        // await addRelTreeFertilization(relation);
        console.log('Relasi fertilization ditambahkan:', relation);
      }

      toast({ title: 'Relasi fertilization berhasil ditambahkan' });
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: 'Error',
        description: 'Gagal menambahkan data pohon atau relasi fertilization',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <BackButton />
      <h2 className="text-2xl font-bold mb-4 mt-6">Tambah Data Pohon</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="code">
            Kode Pohon
          </label>
          <Input id="code" name="code" placeholder="Kode Pohon" value={formData.code} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Nama Petani
          </label>
          <Input id="name" name="name" placeholder="Nama Petani" value={newUser.name} onChange={handleUserInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="type">
            Jenis Pohon
          </label>
          <Select value={formData.type} onValueChange={handleTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Jenis Pohon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Durian">Durian</SelectItem>
              <SelectItem value="Kopi">Kopi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="accession">
            Aksesi
          </label>
          <Input id="accession" name="accession" placeholder="Aksesi" value={formData.accession} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="location">
            Lokasi
          </label>
          <Input id="location" name="location" placeholder="Lokasi" value={formData.location} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="plantingDate">
            Tanggal Penanaman
          </label>
          <Input type="date" id="plantingDate" name="plantingDate" value={formData.plantingDate} onChange={handleInputChange} required />
        </div>
        <Button type="submit" disabled={loading}>
          {loading ? 'Loading...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default AddTreeForm;
