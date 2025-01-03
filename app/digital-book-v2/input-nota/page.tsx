'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BackButton from '../../components/BackButton';
import { useFirestore } from '@/app/hooks/useFirestore';
import { Account } from '@/app/db/interfaces';
import { toast } from '@/hooks/use-toast';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const InputNota = () => {
  const router = useRouter();
  const { addTransaction, getAllAccounts } = useFirestore();
  const [accounts, setAccounts] = React.useState<Account[]>([]);
  const [selectedAccount, setSelectedAccount] = React.useState<string | undefined>(undefined);
  const [selectedTipe, setSelectedTipe] = React.useState<string | undefined>(undefined); // Separate state for Tipe
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    async function fetchAccounts() {
      try {
        const accounts = await getAllAccounts();
        setAccounts(accounts.sort((a, b) => a.code.localeCompare(b.code)));
      } catch (error) {
        console.error('Error fetching accounts:', error);
      }
    }
    fetchAccounts();
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!selectedAccount) {
      alert('Pilih kategori terlebih dahulu.');
      return;
    }

    const userId = localStorage.getItem('user_id_branch_book_app');

    if (!userId) {
      alert('session expired');
      router.push('/auth/login');
    }

    const data = {
      date: formData.get('date') ? Timestamp.fromDate(new Date(formData.get('date') as string)) : null,
      description: formData.get('description'),
      account_id: selectedAccount,
      total_amount: parseInt(formData.get('nominal') as string),
      user_id: userId,
      ref: '',
      type: selectedTipe,
    };

    if (!data.date || !data.description || !data.total_amount) {
      console.error('Please fill all required fields');
      return;
    }

    try {
      setLoading(true);
      await addTransaction(data);

      form.reset();
      //   setSelectedAccount(undefined);
      //   setSelectedTipe(undefined); // Reset Tipe as well
      toast({
        title: 'Nota Ditambahkan',
        description: 'Nota ditambahkan ke database.',
      });
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <BackButton color="violet" />

      <div className="px-6 mt-5">
        <h1 className="text-2xl text-gray-800">Input Nota</h1>
        <p className="text-sm text-gray-600">Silakan masukkan detail nota di form berikut ini.</p>
      </div>

      <div className="flex flex-col px-6 mt-8">
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                name="date"
                type="date"
                placeholder="Pilih tanggal"
                defaultValue={new Date().toLocaleDateString('en-CA')} // Set default to current local date in YYYY-MM-DD format
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="description">Keterangan</Label>
            <Input id="description" name="description" placeholder="Masukkan keterangan" />
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="kategori">Kategori</Label>
            <Select value={selectedAccount} onValueChange={(value) => setSelectedAccount(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    {account.code} - {account.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="tipe">Tipe</Label>
            <Select value={selectedTipe} onValueChange={(value) => setSelectedTipe(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pemasukan">Pemasukan</SelectItem>
                <SelectItem value="pengeluaran">Pengeluaran</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-3">
            <Label htmlFor="nominal">Nominal</Label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-l-md">Rp</span>
              <Input id="nominal" name="nominal" type="number" placeholder="Masukkan nominal" min="0" className="rounded-l-none" />
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="submit"
              disabled={loading}
              className="py-1.5 w-full bg-violet-500 active:bg-violet-600 text-white font-bold rounded-xl disabled:bg-gray-300"
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputNota;
