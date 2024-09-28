import React from 'react';
import { report } from '../dummy-data/laba-rugi'; // Pastikan path ini benar

// Fungsi untuk memformat angka menjadi format Rupiah tanpa 'Rp'
const formatRupiah = (value: number) => {
  if (value === 0) {
    return '-'; // Jika nilai 0, tampilkan "-"
  }
  const formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  return formattedValue.replace('Rp', ''); // Hilangkan 'Rp' agar bisa ditangani terpisah di JSX
};

// Fungsi untuk mengambil total laba bersih, total pendapatan, dan total beban dalam satu iterasi
const getTotalValues = () => {
  let totalPendapatan = 0;
  let totalBeban = 0;

  report.children.forEach((category) => {
    if (category.type === 'Pendapatan dari Penjualan') {
      totalPendapatan = category.total.amount;
    } else if (category.type === 'Beban-Beban Usaha') {
      totalBeban = category.total.amount;
    }
  });

  const labaBersih = report.total.amount;
  return { totalPendapatan, totalBeban, labaBersih };
};

const LaporanLabaRugiTable: React.FC = () => {
  // Ambil total pendapatan, beban, dan laba bersih
  const { totalPendapatan, totalBeban, labaBersih } = getTotalValues();

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
            {/* Pendapatan dari Penjualan */}
            {report.children.map((category, index) => (
              <React.Fragment key={index}>
                <tr className="bg-gray-200">
                  <td className="px-4 py-2 border-b border-black border-r text-left font-bold">{category.type}</td>
                  <td className="px-4 py-2 border-b border-black text-right"></td>
                </tr>
                {category.children.map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-4 py-2 border-b border-black border-r text-left">{item.label}</td>
                    <td className="px-4 py-2 border-b border-black text-right">
                      <span>Rp</span>
                      <span className="float-right">{formatRupiah(item.amount)}</span>
                    </td>
                  </tr>
                ))}
                {/* Total tiap kategori */}
                <tr className="bg-gray-100 font-bold">
                  <td className="px-4 py-2 border-b border-black border-r text-left">{category.total.label}</td>
                  <td className="px-4 py-2 border-b border-black text-right">
                    <span>Rp</span>
                    <span className="float-right">{formatRupiah(category.total.amount)}</span>
                  </td>
                </tr>
              </React.Fragment>
            ))}

            {/* Total Laba Bersih */}
            <tr className="bg-[#4EA72E] font-bold">
              <td className="px-4 py-2 border-b border-black border-r text-left">{report.total.name}</td>
              <td className="px-4 py-2 border-b border-black text-right">
                <span>Rp</span>
                <span className="float-right">{formatRupiah(labaBersih)}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanLabaRugiTable;
