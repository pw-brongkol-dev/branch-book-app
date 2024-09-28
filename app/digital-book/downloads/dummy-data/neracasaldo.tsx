import React from 'react';
import { accounts } from './neraca-saldo'; // Pastikan path ini benar

const formatRupiah = (value: number) => {
  if (value === 0) {
      return '-'; // Jika nilai 0, tampilkan "-"
  }
  // Pisahkan Rp dan nominal agar bisa diberikan style yang berbeda
  const formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  return formattedValue.replace('Rp', ''); // Hilangkan 'Rp' agar bisa ditangani terpisah di JSX
};

// Fungsi untuk menghitung total Debit
const getTotalDebit = () => {
  return accounts.reduce((total, account) => total + account.Debit, 0);
};

// Fungsi untuk menghitung total Kredit
const getTotalKredit = () => {
  return accounts.reduce((total, account) => total + account.Kredit, 0);
};

const NeracaSaldoTable: React.FC = () => {
  const totalDebit = getTotalDebit();
  const totalKredit = getTotalKredit();

    return (
    <div className="w-[216mm] min-h-[297mm] mx-auto p-10" style={{ fontSize: '10pt' }}> {/* Ubah dari '12pt' ke '10pt' */}
      {/* Bagian Header Laporan */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <h1 className="text-lg mb-2">Kode perusahaan</h1>
        <h1 className="text-3xl font-bold mb-2">Neraca Saldo</h1>
        <h1 className="text-lg">Bulan ini</h1>
      </div>

      {/* Bagian Tabel Transaksi */}
      <div className="bg-white rounded-md">
        <table className="w-full bg-white border border-black">
          <thead>
            <tr className="bg-[#4EA72E]">
              <th className="px-4 py-2 border-b border-black border-r text-center">Nomor Akun</th>
              <th className="px-4 py-2 border-b border-black border-r text-center">Nama Akun</th>
              <th className="px-4 py-2 border-b border-black border-r text-center">Debit</th>
              <th className="px-4 py-2 border-b border-black text-center">Kredit</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={index}>
                <td className="px-2 py-1 border-b border-black border-r text-center">{account.NomorAkun}</td>
                <td className="px-4 py-2 border-b border-black border-r text-left">{account.NamaAkun}</td>
                <td className='px-2 py-1 border-b border-black border-r text-left'>
                  <span className="text-left">Rp</span>
                  <span className="float-right">{formatRupiah(account.Debit)}</span>
                </td>
                <td className='px-2 py-1 border-b border-black text-left'>
                  <span className="text-left">Rp</span>
                  <span className="float-right">{formatRupiah(account.Kredit)}</span>
                </td>
              </tr>
            ))}

            {/* Baris tambahan setelah baris terakhir */}
            <tr className="bg-[#4EA72E]">
              <td className="px-4 py-2 border-b border-black border-r text-center" colSpan={2}><strong>JUMLAH</strong></td>
              <td className='px-2 py-1 border-b border-black border-r text-left'>
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(totalDebit)}</span> {/* Gantilah dengan nilai yang sesuai */}
              </td>
              <td className='px-2 py-1 border-b border-black text-left'>
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(totalKredit)}</span> {/* Gantilah dengan nilai yang sesuai */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NeracaSaldoTable;
