import React from 'react';
import { accounts } from './neraca-saldo'; // Pastikan path ini benar

const NeracaSaldoTable: React.FC = () => {
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
        <table className="w-full bg-white border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border-b border-r text-center">Nomor Akun</th>
              <th className="px-4 py-2 border-b border-r text-center">Nama Akun</th>
              <th className="px-4 py-2 border-b border-r text-center">Debit</th>
              <th className="px-4 py-2 border-b text-center">Kredit</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account, index) => (
              <tr key={index}>
                <td className="px-2 py-1 border-b border-r text-center">{account.NomorAkun}</td>
                <td className="px-4 py-2 border-b border-r text-left">{account.NamaAkun}</td>
                <td className="px-4 py-2 border-b border-r text-left">
                  {account.Debit.toLocaleString('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                  })}
                </td>
                <td className="px-4 py-2 border-b text-left">
                  {account.Kredit.toLocaleString('id-ID', {
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

export default NeracaSaldoTable;
