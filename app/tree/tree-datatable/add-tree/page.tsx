'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BackButton from '@/app/components/BackButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore } from '@/app/hooks/useFirestore';
import { toast } from '@/hooks/use-toast';
import { Group, User } from '@/app/db/interfaces';
import { Timestamp } from 'firebase/firestore'; // Import Firebase Timestamp

const AddTreeForm = () => {
  const { addTree, addUser, getAllGroups, getAllUsers } = useFirestore();

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
  const [loading, setLoading] = useState(false); // Loading state

  // Fetch groups and users on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const groupData = await getAllGroups();
        const userData = await getAllUsers();
        setGroups(groupData);
        setUsers(userData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

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
      selectedGroup = groups.find((group) => group.name === 'Karya Bakti I');
    }

    if (selectedGroup) {
      setNewUser((prevUser) => ({ ...prevUser, group_id: selectedGroup.id }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      // Convert planting date to Firebase Timestamp, or set a default value if plantingDate is empty
      const plantingDateTimestamp = formData.plantingDate ? Timestamp.fromDate(new Date(formData.plantingDate)) : Timestamp.now(); // Set default to current timestamp if no date provided

      const finalFormData = {
        code: formData.code,
        type: formData.type,
        accession: formData.accession,
        location: formData.location,
        planting_date: plantingDateTimestamp, // Ensure correct field name and type
        user_id: formData.user_id,
      };

      const userExists = users.some((user) => user.name === newUser.name);
      if (!userExists) {
        // await addUser(newUser);
        console.log('User added:', newUser);
        toast({ title: 'User added successfully' });
      }

      const foundUser = users.find((user) => user.name === newUser.name) || { id: newUser.name }; // Adjust if needed
      if (foundUser) {
        finalFormData.user_id = foundUser.id;
        // await addTree(finalFormData);
        console.log('Tree added:', finalFormData);
        toast({ title: 'Data pohon berhasil ditambahkan' });
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Gagal menambahkan data pohon' });
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
