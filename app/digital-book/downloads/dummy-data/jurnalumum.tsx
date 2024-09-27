import React from 'react';
import { transactions } from './jurnal-umum';

const JurnalUmum = () => {
  return (
    <div className="w-[216mm] min-h-[297mm] mx-auto p-10" style={{ fontSize: '10pt' }}> {/* Ubah dari '12pt' ke '10pt' */}
      {/* Bagian Header Laporan */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <h1 className="text-lg mb-2">Kode perusahaan</h1>
        <h1 className="text-3xl font-bold mb-2">Laporan Jurnal Umum</h1>
        <h1 className="text-lg">Bulan ini</h1>
      </div>

      {/* Bagian Tabel Transaksi */}
      <div className="bg-white rounded-md">
        <table className="w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b border-r text-left">Tanggal</th>
              <th className="px-4 py-2 border-b border-r text-left">Keterangan</th>
              <th className="px-4 py-2 border-b border-r text-left">Kode Akun</th>
              <th className="px-4 py-2 border-b border-r text-left">Nama Akun</th>
              <th className="px-4 py-2 border-b border-r text-right">Debit</th>
              <th className="px-4 py-2 border-b text-right">Kredit</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td className="px-4 py-2 border-b border-r">{transaction.Tanggal.toLocaleDateString()}</td>
                <td className="px-4 py-2 border-b border-r">{transaction.Keterangan}</td>
                <td className="px-4 py-2 border-b border-r">{transaction.KodeAkun}</td>
                <td className="px-4 py-2 border-b border-r">{transaction.NamaAkun}</td>
                <td className="px-4 py-2 border-b border-r text-right">
                  {transaction.Debit.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })}
                </td>
                <td className="px-4 py-2 border-b text-right">
                  {transaction.Kredit.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })}
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
