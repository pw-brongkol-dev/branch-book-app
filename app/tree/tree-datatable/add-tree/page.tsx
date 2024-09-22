'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BackButton from '@/app/components/BackButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore } from '@/app/hooks/useFirestore';
import { toast } from '@/hooks/use-toast';
import { Group } from '@/app/db/interfaces';

const AddTreeForm = () => {
  const { addTree, addUser, getAllGroups } = useFirestore();

  const [formData, setFormData] = useState({
    code: '',
    type: '',
    accession: '',
    location: '',
    plantingDate: '',
  });

  const [newUser, setNewUser] = useState({
    name: '',
    group_id: '',
  });

  const [groups, setGroups] = useState<Group[]>([]);

  // Fetch groups data when component mounts
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const fetchedGroups = await getAllGroups();
        setGroups(fetchedGroups);
      } catch (err) {
        console.error('Error fetching groups:', err);
      }
    };
    fetchGroups();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleUserChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewUser((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validasi form
    if (!formData.code || !newUser.name || !formData.type || !formData.accession || !formData.location || !formData.plantingDate) {
      toast({
        title: 'Error',
        description: 'Tolong isi semua kolom',
        variant: 'destructive',
      });
      return;
    }

    // Set group_id berdasarkan jenis pohon
    if (formData.type === 'durian') {
      const group = groups.find((group) => group.name === 'Ajuning Tani');
      if (group) {
        newUser.group_id = group.id;
      }
    } else if (formData.type === 'kopi') {
      const group = groups.find((group) => group.name === 'Karya Bakti I');
      if (group) {
        newUser.group_id = group.id;
      }
    }

    try {
      const userId = await addUser({
        name: newUser.name,
        group_id: newUser.group_id,
      });

      await addTree({
        code: formData.code,
        type: formData.type,
        accession: formData.accession,
        location: formData.location,
        planting_date: new Date(formData.plantingDate),
        user_id: userId,
      });

      toast({
        title: 'Success',
        description: 'Data pohon dan petani berhasil ditambahkan',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Gagal menambahkan data pohon atau user',
        variant: 'destructive',
      });
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
          <Input id="code" name="code" placeholder="Kode Pohon" value={formData.code} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="name">
            Nama Petani
          </label>
          <Input id="name" name="name" placeholder="Nama Petani" value={newUser.name} onChange={handleUserChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="type">
            Jenis Pohon
          </label>
          <Select value={formData.type} onValueChange={(value: string) => setFormData({ ...formData, type: value })} required>
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
          <Input id="accession" name="accession" placeholder="Aksesi" value={formData.accession} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="location">
            Lokasi
          </label>
          <Input id="location" name="location" placeholder="Lokasi" value={formData.location} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="plantingDate">
            Tanggal Penanaman
          </label>
          <Input type="date" id="plantingDate" name="plantingDate" value={formData.plantingDate} onChange={handleChange} required />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default AddTreeForm;
