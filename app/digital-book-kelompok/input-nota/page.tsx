'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import BackButton from '../../components/BackButton';
import { useFirestore } from '@/app/hooks/useFirestore';
import { AccountGroupWithId, ProductGroupWithId } from '@/app/db/interfaces';
import { toast } from '@/hooks/use-toast';
import { Timestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

const InputNotaKelompok = () => {
  const router = useRouter();
  const {
    getUserById,
    addTransactionGroup,
    getAllAccountsGroup,
    getProductsGroupByUserId,
  } = useFirestore();

  const [accounts, setAccounts] = React.useState<AccountGroupWithId[]>([]);
  const [products, setProducts] = React.useState<ProductGroupWithId[]>([]);
  const [selectedAccount, setSelectedAccount] = React.useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = React.useState<string | undefined>(undefined);
  const [selectedTipe, setSelectedTipe] = React.useState<string | undefined>(undefined);
  const [loading, setLoading] = React.useState(false);
  const [kelompokId, setKelompokId] = React.useState<string>('');

  React.useEffect(() => {
    async function initialize() {
      const currentUserId = localStorage.getItem('user_id_branch_book_app');
      if (!currentUserId) {
        router.push('/auth/login');
        return;
      }

      try {
        const user = await getUserById(currentUserId);
        if (!user || !user.group_id) {
          alert('Anda belum terdaftar di kelompok manapun.');
          router.push('/');
          return;
        }

        setKelompokId(user.group_id);

        // Fetch accounts and products
        const accountsData = await getAllAccountsGroup();
        const productsData = await getProductsGroupByUserId(user.group_id);

        setAccounts(accountsData.sort((a, b) => a.code.localeCompare(b.code)));
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    initialize();
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    if (!selectedAccount) {
      alert('Pilih kategori terlebih dahulu.');
      return;
    }

    if (!selectedTipe) {
      alert('Pilih tipe transaksi terlebih dahulu.');
      return;
    }

    const currentUserId = localStorage.getItem('user_id_branch_book_app');
    if (!currentUserId) {
      alert('session expired');
      router.push('/auth/login');
      return;
    }

    const totalAmount = parseInt(formData.get('total_amount') as string) || 0;

    const data = {
      user_id: kelompokId,
      date: formData.get('date') ? Timestamp.fromDate(new Date(formData.get('date') as string)) : Timestamp.now(),
      description: formData.get('description') as string,
      account_id: selectedAccount,
      product_id: selectedProduct && selectedProduct !== 'no-product' ? selectedProduct : undefined,
      total_amount: totalAmount,
      ref: formData.get('ref') as string || '',
      type: selectedTipe as 'pemasukan' | 'pengeluaran',
    };

    if (!data.date || !data.description || !data.total_amount) {
      console.error('Please fill all required fields');
      alert('Mohon lengkapi semua field yang wajib diisi.');
      return;
    }

    try {
      setLoading(true);
      await addTransactionGroup(data);

      form.reset();
      setSelectedAccount(undefined);
      setSelectedProduct(undefined);
      setSelectedTipe(undefined);

      toast({
        title: 'Transaksi Ditambahkan',
        description: 'Transaksi berhasil ditambahkan ke database kelompok.',
      });

      // Redirect back to main page
      router.push('/digital-book-kelompok');
    } catch (error) {
      console.error('Error adding transaction:', error);
      alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <BackButton color="blue" />

      <div className="px-6 mt-5">
        <h1 className="text-2xl text-gray-800">Input Transaksi Kelompok</h1>
        <p className="text-sm text-gray-600">Silakan masukkan detail transaksi kelompok di form berikut ini.</p>
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
                defaultValue={new Date().toLocaleDateString('en-CA')}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="tipe">Tipe Transaksi</Label>
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
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="kategori">Kategori Akun</Label>
            <Select value={selectedAccount} onValueChange={(value) => setSelectedAccount(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih kategori akun" />
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
            <Label htmlFor="product">Produk (Opsional)</Label>
            <Select value={selectedProduct} onValueChange={(value) => setSelectedProduct(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih produk (opsional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="no-product">Tidak ada produk</SelectItem>
                {products.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="total_amount">Total Nominal</Label>
            <div className="flex items-center">
              <span className="px-3 py-2 bg-gray-200 border border-gray-300 rounded-l-md">Rp</span>
              <Input
                id="total_amount"
                name="total_amount"
                type="number"
                placeholder="Masukkan nominal"
                min="0"
                className="rounded-l-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="description">Keterangan</Label>
            <Input id="description" name="description" placeholder="Masukkan keterangan" />
          </div>

          <div className="flex flex-col gap-3">
            <Label htmlFor="ref">No. Referensi / Bukti (Opsional)</Label>
            <Input id="ref" name="ref" placeholder="Masukkan nomor referensi" />
          </div>

          <div className="flex justify-end space-x-4 pb-8">
            <button
              type="submit"
              disabled={loading}
              className="py-1.5 w-full bg-blue-500 active:bg-blue-600 text-white font-bold rounded-xl disabled:bg-gray-300"
            >
              {loading ? 'Menyimpan...' : 'Simpan Transaksi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputNotaKelompok;
