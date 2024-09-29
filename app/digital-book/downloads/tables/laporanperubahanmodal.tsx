import React from 'react';
import { report } from '../dummy-data/laporan-perubahan-modal'; // Pastikan path ini benar

// Fungsi untuk memformat angka menjadi format Rupiah tanpa 'Rp'
const formatRupiah = (value: number) => {
  if (value === 0) {
    return '-'; // Jika nilai 0, tampilkan "-"
  }
  const formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  return formattedValue.replace('Rp', ''); // Hilangkan 'Rp' agar bisa ditangani terpisah di JSX
};

// Fungsi untuk menghitung total modal awal, perubahan modal, dan modal akhir dalam satu iterasi
const getTotalValues = () => {
  let saldoAwal = 0;
  let perubahanModal = 0;
  let modalAkhir = 0;

  report.children.forEach((category) => {
    if (category.total && category.total.name === 'Saldo Awal') {
      saldoAwal = category.total.amount;
    } else if (category.total && category.total.name.includes('Penambahan Modal')) {
      perubahanModal = category.total.amount;
    }
  });

  modalAkhir = report.total.amount;

  return { saldoAwal, perubahanModal, modalAkhir };
};

const LaporanPerubahanModalTable: React.FC = () => {
  // Ambil total saldo awal, perubahan modal, dan modal akhir
  const { saldoAwal, perubahanModal, modalAkhir } = getTotalValues();

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
                <span className="float-right">{formatRupiah(saldoAwal)}</span>
              </td>
            </tr>

            {/* Perubahan Modal */}
            <tr className="bg-gray-200">
              <td className="px-4 py-2 border-b border-black border-r text-left font-bold">Perubahan Modal</td>
              <td className="px-4 py-2 border-b border-black text-right"></td>
            </tr>

            {/* Pastikan children ada sebelum mapping */}
            {report.children[1].children && report.children[1].children[0].children &&
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
                <span className="float-right">{formatRupiah(perubahanModal)}</span>
              </td>
            </tr>

            {/* Modal Akhir */}
            <tr className="bg-[#4EA72E] font-bold">
              <td className="px-4 py-2 border-b border-black border-r text-left">{report.total.name}</td>
              <td className="px-4 py-2 border-b border-black text-right">
                <span>Rp</span>
                <span className="float-right">{formatRupiah(modalAkhir)}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanPerubahanModalTable;
