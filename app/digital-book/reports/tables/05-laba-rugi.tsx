import React from 'react';
import { formatRupiah } from './utils';

// Define interfaces for the report structure
interface ReportLabaRugi {
  code: string;
  name: string;
  date: string; // Adjust type if date is a Date object
  children: IncomeExpenseGroup[];
  total: Total;
}

interface IncomeExpenseGroup {
  type: string;
  children: IncomeExpense[];
  total: Total;
}

interface IncomeExpense {
  label: string;
  amount: number;
}

interface Total {
  label: string;
  amount: number;
}

const LaporanLabaRugi: React.FC<{ report: ReportLabaRugi }> = ({ report }) => {
  // Ambil total pendapatan, beban, dan laba bersih

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
          <tbody>
            {/* Pendapatan dari Penjualan */}
            {report.children.map((category, index) => (
              <React.Fragment key={index}>
                <tr className="bg-gray-200">
                  <td className="px-4 py-2 border-b border-black border-r text-left font-bold">{category.type}</td>
                  <td className="px-4 py-2 border-b border-black text-right"></td>
                </tr>

                {/* Pengecekan apakah category.children ada */}
                {category.children &&
                  category.children.map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-2 border-b border-black border-r text-left">
                        {/* Menambahkan penomoran pada item */}
                        {`${idx + 1}. ${item.label}`}
                      </td>
                      <td className="px-4 py-2 border-b border-black text-left">
                        <span className="text-left">Rp</span>
                        <span className="float-right">{formatRupiah(item.amount)}</span>
                      </td>
                    </tr>
                  ))}

                {/* Pengecekan apakah category.total ada */}
                {category.total && (
                  <tr className="bg-[#DAF2D0] font-bold">
                    <td className="px-4 py-2 border-b border-black border-r text-left">{category.total.label}</td>
                    <td className="px-4 py-2 border-b border-black text-left">
                      <span className="text-left">Rp</span>
                      <span className="float-right">{formatRupiah(category.total.amount)}</span>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}

            {/* Total Laba Bersih */}
            <tr className="bg-[#4EA72E] font-bold">
              <td className="px-4 py-2 border-b border-black border-r text-left">{report.total.label}</td>
              <td className="px-4 py-2 border-b border-black text-left">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(report.total.amount)}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanLabaRugi;
