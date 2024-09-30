import React from 'react';
import { transactions } from '../dummy-data/jurnal-umum'; // Pastikan path ini benar

// Fungsi untuk memformat angka menjadi format Rupiah tanpa 'Rp'
const formatRupiah = (value: number) => {
  if (value === 0) {
    return '-'; // Jika nilai 0, tampilkan "-"
  }
  // Pisahkan Rp dan nominal agar bisa diberikan style yang berbeda
  const formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  return formattedValue.replace('Rp', ''); // Hilangkan 'Rp' agar bisa ditangani terpisah di JSX
};

const JurnalUmum: React.FC = () => {
  return (
    <div className="w-[1000px] min-h-[297mm] mx-auto p-10" style={{ fontSize: '10pt' }}> {/* Ubah dari '12pt' ke '10pt' */}
      {/* Bagian Header Laporan */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <h1 className="text-lg mb-2">{transactions.code}</h1> {/* Tambahkan kode perusahaan */}
        <h1 className="text-3xl font-bold mb-2">{transactions.name}</h1> {/* Ubah judul menjadi "JURNAL UMUM" */}
        <h1 className="text-lg">{transactions.date}</h1> {/* Tanggal laporan diambil dari `transactions.date` */}
      </div>

      {/* Bagian Tabel Transaksi */}
      <div className="bg-white rounded-md">
        <table className="w-full bg-white border border-black"> {/* Border hitam */}
          <thead>
            <tr className="bg-[#4EA72E]">
              <th className="px-4 py-2 border-b border-r border-black text-left">Tanggal</th> {/* Border hitam vertikal */}
              <th className="px-4 py-2 border-b border-r border-black text-left">Keterangan</th> {/* Border hitam vertikal */}
              <th className="px-4 py-2 border-b border-r border-black text-left">Kode Akun</th> {/* Border hitam vertikal */}
              <th className="px-4 py-2 border-b border-r border-black text-left">Nama Akun</th> {/* Border hitam vertikal */}
              <th className="px-4 py-2 border-b border-r border-black text-right">Debit</th> {/* Border hitam vertikal */}
              <th className="px-4 py-2 border-b border-black text-right">Kredit</th> {/* Border hitam tanpa border-r karena ini kolom terakhir */}
            </tr>
          </thead>
          <tbody>
            {transactions.children.map((transaction, index) => (  // Sesuaikan dengan `transactions.children`
              <tr key={index}>
                <td className="px-4 py-2 border-b border-r border-black">{transaction.Tanggal.toLocaleDateString()}</td> {/* Border hitam vertikal */}
                <td className="px-4 py-2 border-b border-r border-black">{transaction.Keterangan}</td> {/* Border hitam vertikal */}
                <td className="px-4 py-2 border-b border-r border-black">{transaction.KodeAkun}</td> {/* Border hitam vertikal */}
                <td className="px-4 py-2 border-b border-r border-black">{transaction.NamaAkun}</td> {/* Border hitam vertikal */}
                <td className="px-4 py-2 border-b border-r border-black text-left">
                  <span className="text-left">Rp</span>
                  <span className="float-right">{formatRupiah(transaction.Debit)}</span>
                </td>
                <td className="px-4 py-2 border-b border-black text-left">
                  <span className="text-left">Rp</span>
                  <span className="float-right">{formatRupiah(transaction.Kredit)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default JurnalUmum;