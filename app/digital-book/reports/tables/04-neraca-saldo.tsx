import React from 'react';
import { formatRupiah } from './utils';

// Define types for the report structure
type ReportNeracaSaldo = {
  code: string;
  name: string;
  date: string; // Adjust type if date is a Date object
  children: AccountEntry[];
  total: {
    kredit: number,
    debit: number
  }
};

// Define types for the account entry structure
type AccountEntry = {
  NomorAkun: string;
  NamaAkun: string;
  Debit: number;
  Kredit: number;
};


const NeracaSaldoTable: React.FC<{ report: ReportNeracaSaldo }> = ({ report }) => {
  const totalDebit = report.total.debit;
  const totalKredit = report.total.kredit;

  return (
    <div className="w-[216mm] min-h-[297mm] mx-auto p-10" style={{ fontSize: '10pt' }}>
      {' '}
      {/* Ubah dari '12pt' ke '10pt' */}
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
