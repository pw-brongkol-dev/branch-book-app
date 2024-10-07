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
import { useRouter } from 'next/navigation';

const AddTreeForm = () => {
  const { addTree, addUser, getAllGroups, getAllUsers, getAllTrees, getAllFertilizations, addRelTreeFertilization } = useFirestore();
  const router = useRouter();
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
  // const [example, setExample] = useState('abc');

  // useEffect(() => {
  //   console.log(example);
  //   setExample('def');
  //   console.log(example);
  // }, [example]);

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
        user_id: '',
      };

      console.log('Initial finalFormData:', finalFormData);

      // Format nama user
      const formattedName = newUser.name.charAt(0).toUpperCase() + newUser.name.slice(1).toLowerCase();
      console.log('Formatted User Name:', formattedName);

      const userExists = users.some((user) => user.name.toLowerCase() === formattedName.toLowerCase());
      console.log('User exists:', userExists);

      let newUserId: string | undefined;

      if (!userExists) {
        // Tambahkan pengguna baru dan ambil ID-nya
        const addedUser = await addUser({ ...newUser, name: formattedName });
        console.log('Added User:', addedUser);

        if (typeof addedUser === 'string') {
          newUserId = addedUser;
          console.log('New User ID:', newUserId);
          toast({ title: 'User added successfully' });
        } else {
          console.error('Failed to get added user ID:', addedUser);
          throw new Error('Failed to get user ID from addUser');
        }
      } else {
        const foundUser = users.find((user) => user.name.toLowerCase() === formattedName.toLowerCase());
        console.log('Found User:', foundUser);

        if (foundUser && foundUser.id) {
          newUserId = foundUser.id;
          console.log('Existing User ID:', newUserId);
        } else {
          console.error('Failed to find user ID in existing users');
          throw new Error('User ID not found for existing user');
        }
      }

      if (newUserId) {
        finalFormData = {
          ...finalFormData,
          user_id: newUserId,
        };
        console.log('Updated finalFormData with user_id:', finalFormData);
      } else {
        console.error('User ID is undefined after user processing');
        throw new Error('User ID not found');
      }

      // Tunggu sampai data pohon berhasil ditambahkan dengan user_id
      console.log('Tree data with user_id:', finalFormData);
      const addedTree = await addTree(finalFormData); // Pastikan menunggu sampai addTree selesai
      console.log('Added Tree:', addedTree);
      toast({ title: 'Data pohon berhasil ditambahkan' });

      let newTreeId: string | undefined;

      // Jika addTree mengembalikan id pohon, kita bisa langsung gunakan
      if (addedTree && addedTree.id) {
        newTreeId = addedTree.id;
        console.log('Newly added Tree ID:', newTreeId);
      } else {
        // Refresh atau update data pohon lokal setelah menambahkan, untuk memastikan data sinkron
        const updatedTrees = await getAllTrees();
        setTrees(updatedTrees);

        // Jika addTree tidak mengembalikan id, cari pohon berdasarkan kode di data yang baru di-update
        const newTree = updatedTrees.find((tree) => tree.code === finalFormData.code);
        console.log('Newly added tree from updated trees:', newTree);

        if (newTree && newTree.id) {
          newTreeId = newTree.id;
          console.log('Tree ID from updated trees:', newTreeId);
        } else {
          console.error('Failed to find the new tree by code');
          throw new Error('New tree ID is undefined');
        }
      }

      if (newTreeId) {
        const fertilizationRelations = fertData.map((fertilization) => ({
          fertilization_id: fertilization.id,
          is_completed: false,
          tree_id: newTreeId, // Pastikan tree_id valid
        }));

        console.log('Fertilization Relations:', fertilizationRelations);

        for (const relation of fertilizationRelations) {
          await addRelTreeFertilization(relation);
          console.log('Relasi fertilization ditambahkan:', relation);
        }

        toast({ title: 'Relasi fertilization berhasil ditambahkan' });
      } else {
        console.error('New tree ID is still undefined after tree addition');
        throw new Error('Failed to retrieve tree ID');
      }

      router.push('/tree/tree-datatable');
    } catch (error) {
      console.error('Error during form submission:', error);
      toast({
        title: 'Error',
        description: 'Gagal menambahkan data pohon atau relasi fertilization',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="">
      <BackButton color='green' />
      <div className='px-6 py-4'>
      <h2 className="text-2xl mb-4 mt-6">Tambah Data Pohon</h2>
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
    </div>
  );
};

export default AddTreeForm;
