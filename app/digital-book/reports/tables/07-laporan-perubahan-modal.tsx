import React from 'react';
import { formatRupiah } from './utils';

// Define interfaces for the report structure
interface ReportLaporanPerubahanModal {
  code: string;
  name: string;
  date: string; // Adjust type if date is a Date object
  children: ModalChange[];
  total: Total;
}

interface ModalChange {
  total?: Total; // Optional, as it may not be present in all children
  children?: ModalChangeDetail[]; // Optional, as it may not be present in all children
}

interface ModalChangeDetail {
  type: string;
  children: ModalChangeItem[];
}

interface ModalChangeItem {
  accountName: string;
  amount: number;
}

interface Total {
  name: string;
  amount: number;
}

const LaporanPerubahanModal: React.FC<{ report: ReportLaporanPerubahanModal }> = ({ report }) => {
  // Ambil total saldo awal, perubahan modal, dan modal akhir

  return (
    <div className="w-[216mm] min-h-[297mm] mx-auto p-10" style={{ fontSize: '10pt' }}>
      {/* Bagian Header Laporan */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">{report.name}</h1>
        <h2 className="text-lg mb-2">{report.date}</h2>
      </div>

      {/* Bagian Tabel Transaksi */}
      <div className="bg-white rounded-md">
        <table className="w-full bg-white border border-black">
          <thead>
            <tr className="bg-[#4EA72E]">
              <th className="px-4 py-2 border-b border-black border-r text-center">Deskripsi</th>
              <th className="px-4 py-2 border-b border-black text-center">Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {/* Saldo Awal */}
            <tr className="bg-gray-100 font-bold">
              <td className="px-4 py-2 border-b border-black border-r text-left">{report.children[0].total.name}</td>
              <td className="px-4 py-2 border-b border-black text-right">
                <span>Rp</span>
                <span className="float-right">{formatRupiah(report.children[0].total.amount)}</span>
              </td>
            </tr>

            {/* Perubahan Modal */}
            <tr className="bg-gray-200">
              <td className="px-4 py-2 border-b border-black border-r text-left font-bold">Perubahan Modal</td>
              <td className="px-4 py-2 border-b border-black text-right"></td>
            </tr>

            {/* Pastikan children ada sebelum mapping */}
            {report.children[1].children &&
              report.children[1].children[0].children &&
              report.children[1].children[0].children.map((item, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 border-b border-black border-r text-left">{item.accountName}</td>
                  <td className="px-4 py-2 border-b border-black text-right">
                    <span>Rp</span>
                    <span className="float-right">{formatRupiah(item.amount)}</span>
                  </td>
                </tr>
              ))}

            {/* Total Perubahan Modal */}
            <tr className="bg-gray-100 font-bold">
              <td className="px-4 py-2 border-b border-black border-r text-left">{report.children[1].total.name}</td>
              <td className="px-4 py-2 border-b border-black text-right">
                <span>Rp</span>
                <span className="float-right">{formatRupiah(report.children[1].total.amount)}</span>
              </td>
            </tr>

            {/* Modal Akhir */}
            <tr className="bg-[#4EA72E] font-bold">
              <td className="px-4 py-2 border-b border-black border-r text-left">{report.total.name}</td>
              <td className="px-4 py-2 border-b border-black text-right">
                <span>Rp</span>
                <span className="float-right">{formatRupiah(report.total.amount)}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanPerubahanModal;
