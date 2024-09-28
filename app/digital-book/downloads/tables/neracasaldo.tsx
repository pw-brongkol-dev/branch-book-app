import React from 'react';
import { report } from '../dummy-data/neraca-saldo'; // Pastikan path ini benar

// Fungsi untuk memformat angka menjadi format Rupiah tanpa 'Rp'
const formatRupiah = (value: number) => {
  if (value === 0) {
      return '-'; // Jika nilai 0, tampilkan "-"
  }
  const formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  return formattedValue.replace('Rp', ''); // Hilangkan 'Rp' agar bisa ditangani terpisah di JSX
};

// Fungsi untuk menghitung total Debit
const getTotalDebit = () => {
  return report.children.reduce((total, account) => total + account.Debit, 0);
};

// Fungsi untuk menghitung total Kredit
const getTotalKredit = () => {
  return report.children.reduce((total, account) => total + account.Kredit, 0);
};

const NeracaSaldoTable: React.FC = () => {
  const totalDebit = getTotalDebit();
  const totalKredit = getTotalKredit();

  return (
    <div className="w-[216mm] min-h-[297mm] mx-auto p-10" style={{ fontSize: '10pt' }}> {/* Ubah dari '12pt' ke '10pt' */}
      {/* Bagian Header Laporan */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <h1 className="text-lg mb-2">{report.code}</h1> {/* Tambahkan kode perusahaan */}
        <h1 className="text-3xl font-bold mb-2">{report.name}</h1> {/* Ubah judul menjadi "NEACA SALDO" */}
        <h1 className="text-lg">{report.date}</h1>
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
            {report.children.map((account, index) => (
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
                <span className="float-right">{formatRupiah(totalDebit)}</span> {/* Tampilkan total Debit */}
              </td>
              <td className='px-2 py-1 border-b border-black text-left'>
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
