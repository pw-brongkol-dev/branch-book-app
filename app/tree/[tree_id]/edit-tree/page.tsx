'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import BackButton from '@/app/components/BackButton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useFirestore } from '@/app/hooks/useFirestore';
import { toast } from '@/hooks/use-toast';

const EditTreeForm = ({ params }: { params: { tree_id: string } }) => {
  const tree_code = params.tree_id;
  const { getUserById, getTreeByCode, updateTree } = useFirestore(); // Tambahkan method updateTree untuk submit
  const [fetchStatus, setFetchStatus] = useState('idle');

  interface TreeDetail {
    code: string;
    accession: string;
    owner: string;
    type: string;
    planting_date: string;
    location: string;
  }

  const [treeDetail, setTreeDetail] = useState<TreeDetail | undefined>({
    code: '',
    accession: '',
    owner: '',
    type: '',
    planting_date: '',
    location: '',
  });

  const fetchData = async () => {
    try {
      setFetchStatus('loading');
      const tree = await getTreeByCode(tree_code);
      if (!tree) throw 'fetch error: tree not found';

      const user = await getUserById(tree.user_id);
      if (!user) throw 'fetch error: user not found';

      const data = {
        code: tree.code,
        owner: user.name,
        type: tree.type,
        accession: tree.accession,
        location: tree.location,
        planting_date: tree.planting_date.toDate().toISOString().split('T')[0],
      };

      setTreeDetail(data);
      setFetchStatus('success');
    } catch (err) {
      setFetchStatus('error');
      console.error(err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTreeDetail((prev) => prev && { ...prev, [name]: value });
  };

  const handleSelectChange = (value: string) => {
    setTreeDetail((prev) => prev && { ...prev, type: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (treeDetail) {
        await updateTree(tree_code, {
          ...treeDetail,
          planting_date: new Date(treeDetail.planting_date), // konversi kembali ke format Date untuk Firebase
        });
        toast({
          title: 'Success',
          description: 'Data pohon dan petani berhasil diubah',
        });
      }
    } catch (err) {
      toast({
        title: 'Error',
        description: 'Data pohon dan petani gagal diubah',
        variant: 'destructive',
      });
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
          <Input id="code" name="code" value={treeDetail?.code || ''} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="owner">
            Nama Petani
          </label>
          <Input id="owner" name="owner" value={treeDetail?.owner || ''} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="type">
            Jenis Pohon
          </label>
          <Select value={treeDetail?.type || ''} onValueChange={handleSelectChange} required>
            <SelectTrigger>
              <SelectValue placeholder="Pilih Jenis Pohon" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="durian">Durian</SelectItem>
              <SelectItem value="kopi">Kopi</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="accession">
            Aksesi
          </label>
          <Input id="accession" name="accession" value={treeDetail?.accession || ''} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="location">
            Lokasi
          </label>
          <Input id="location" name="location" value={treeDetail?.location || ''} onChange={handleInputChange} required />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" htmlFor="planting_date">
            Tanggal Penanaman
          </label>
          <Input type="date" id="planting_date" name="planting_date" value={treeDetail?.planting_date || ''} onChange={handleInputChange} required />
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
};

export default EditTreeForm;
