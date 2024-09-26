'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BackButton from '@/app/components/BackButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore } from '@/app/hooks/useFirestore';
import { toast } from '@/hooks/use-toast';
import { Tree, User } from '@/app/db/interfaces';
import { Timestamp } from 'firebase/firestore';

const EditTreeForm = ({ params }: { params: { tree_id: string } }) => {
  const tree_code = params.tree_id;
  const { getUserById, getTreeByCode, updateTree, updateUser } = useFirestore();
  const [fetchStatus, setFetchStatus] = useState('idle');

  const [treeDetail, setTreeDetail] = useState<Tree & { id: string }>({
    id: '',
    user_id: '',
    code: '',
    accession: '',
    type: '',
    planting_date: new Date(),
    location: '',
  });

  const [userChanged, setUserChanged] = useState<User>({
    name: '',
    group_id: '',
  });

  const fetchData = async () => {
    try {
      setFetchStatus('loading');
      const tree = await getTreeByCode(tree_code);
      if (!tree) throw new Error('Tree not found');

      const user = await getUserById(tree.user_id);
      if (!user) throw new Error('User not found');

      const dataTree = {
        ...tree,
        planting_date: tree.planting_date.toDate().toISOString().split('T')[0],
      };
      console.log('datatree', dataTree);

      const dataUser = {
        name: user.name,
        group_id: user.group_id,
      };

      setTreeDetail(dataTree);
      setUserChanged(dataUser);
      console.log(dataTree);
      setFetchStatus('success');
    } catch (err) {
      setFetchStatus('error');
      console.error(err);
      toast({
        title: 'Error',
        description: 'Gagal mengambil data pohon dan petani',
        variant: 'destructive',
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'owner') {
      setUserChanged((prev) => ({ ...prev, name: value }));
    } else {
      setTreeDetail((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (value: string) => {
    setTreeDetail((prev) => ({ ...prev, type: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const treePlantingDate = new Date(treeDetail.planting_date);
      const treePlantingDateTimestamp = Timestamp.fromDate(treePlantingDate);
      // console.log('ini aman', treeDetail

      const { id, ...restTreeDetail } = treeDetail;
      await updateTree(treeDetail.id, {
        ...restTreeDetail,
        planting_date: treePlantingDateTimestamp, // Ensure planting_date is a Date object
      });

      if (userChanged.id) {
        await updateUser(userChanged.id, { name: userChanged.name });
      }

      toast({
        title: 'Success',
        description: 'Data pohon dan petani berhasil diubah',
      });
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Data pohon dan petani gagal diubah',
        variant: 'destructive',
      });
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tree_code]);

  return (
    <div className="container mx-auto px-6 py-12">
      <BackButton />
      <h2 className="text-2xl font-bold mb-4 mt-6">Edit Data Pohon</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="code">
            Kode Pohon
          </label>
          <Input id="code" name="code" value={treeDetail.code} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="owner">
            Nama Petani
          </label>
          <Input id="owner" name="owner" value={userChanged.name} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="type">
            Jenis Pohon
          </label>
          <Select onValueChange={handleSelectChange} value={treeDetail.type} required>
            <SelectTrigger>
              <SelectValue>{treeDetail.type ? treeDetail.type : 'Pilih Jenis Pohon'}</SelectValue>
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
          <Input id="accession" name="accession" value={treeDetail.accession} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="location">
            Lokasi
          </label>
          <Input id="location" name="location" value={treeDetail.location} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="planting_date">
            Tanggal Penanaman
          </label>
          <Input type="date" id="planting_date" name="planting_date" value={treeDetail.planting_date} onChange={handleInputChange} required />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default EditTreeForm;
