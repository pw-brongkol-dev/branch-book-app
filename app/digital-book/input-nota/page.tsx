import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BackButton from '../../components/BackButton';

const InputNota = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <BackButton />

      <div className="max-w-3xl mx-auto mt-10">
        <h1 className="text-2xl font-bold mb-5 text-gray-800">Input Nota</h1>
        <p className="text-base text-gray-600 mb-8">Silakan masukkan detail nota di form berikut ini.</p>

        <form className="space-y-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Label htmlFor="tanggal">Tanggal</Label>
              <Input id="tanggal" type="date" placeholder="Pilih tanggal" />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="keterangan">Keterangan</Label>
            <Input id="keterangan" placeholder="Masukkan keterangan" />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="kategori">Kategori</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pendapatan">Pendapatan</SelectItem>
                <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
                <SelectItem value="lainnya">Lainnya</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="nominal">Nominal</Label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-l-md">Rp</span>
              <Input id="nominal" type="number" placeholder="Masukkan nominal" min="0" className="rounded-l-none" />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" className="text-gray-600">
              Batal
            </Button>
            <Button type="submit">Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputNota;
