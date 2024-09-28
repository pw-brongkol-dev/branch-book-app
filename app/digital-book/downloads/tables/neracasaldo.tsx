import React from 'react';
import { accounts } from '../dummy-data/neraca-saldo'; // Pastikan path ini benar

// Fungsi untuk memformat angka menjadi format Rupiah tanpa 'Rp'
const formatRupiah = (value: number) => {
  if (value === 0) {
    return '-'; // Jika nilai 0, tampilkan "-"
  }
  const formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  return formattedValue.replace('Rp', ''); // Hilangkan 'Rp' agar bisa ditangani terpisah di JSX
};

// Fungsi untuk menghitung total Debit dan Kredit dalam satu iterasi
const getTotalValues = () => {
  return accounts.reduce(
    (totals, account) => {
      totals.totalDebit += account.Debit;
      totals.totalKredit += account.Kredit;
      return totals;
    },
    { totalDebit: 0, totalKredit: 0 } // Inisialisasi total Debit dan Kredit
  );
};

const NeracaSaldoTable: React.FC = () => {
  // Ambil total debit dan kredit
  const { totalDebit, totalKredit } = getTotalValues();

  return (
    <div className="w-[216mm] min-h-[297mm] mx-auto p-10" style={{ fontSize: '10pt' }}>
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
                <td className="px-2 py-1 border-b border-black border-r text-left">
                  <span className="text-left">Rp</span>
                  <span className="float-right">{formatRupiah(account.Debit)}</span>
                </td>
                <td className="px-2 py-1 border-b border-black text-left">
                  <span className="text-left">Rp</span>
                  <span className="float-right">{formatRupiah(account.Kredit)}</span>
                </td>
              </tr>
            ))}

            {/* Baris tambahan setelah baris terakhir */}
            <tr className="bg-[#4EA72E]">
              <td className="px-4 py-2 border-b border-black border-r text-center" colSpan={2}>
                <strong>JUMLAH</strong>
              </td>
              <td className="px-2 py-1 border-b border-black border-r text-left">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(totalDebit)}</span> {/* Tampilkan total Debit */}
              </td>
              <td className="px-2 py-1 border-b border-black text-left">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(totalKredit)}</span> {/* Tampilkan total Kredit */}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NeracaSaldoTable;
