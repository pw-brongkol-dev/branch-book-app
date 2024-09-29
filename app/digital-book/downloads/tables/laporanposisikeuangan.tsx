import React from 'react';
import { report } from '../dummy-data/laporan-posisi-keuangan'; // Pastikan path ini benar

// Fungsi untuk memformat angka menjadi format Rupiah tanpa 'Rp'
const formatRupiah = (value: number) => {
  if (value === 0) {
    return '-'; // Jika nilai 0, tampilkan "-"
  }
  const formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
  return formattedValue.replace('Rp', ''); // Hilangkan 'Rp' agar bisa ditangani terpisah di JSX
};

// Fungsi untuk menghitung total aktiva, kewajiban, dan ekuitas dalam satu iterasi
const getTotalValues = () => {
  let totalAktiva = 0;
  let totalKewajiban = 0;
  let totalEkuitas = 0;

  report.children.forEach((category) => {
    if (category.type === 'AKTIVA') {
      totalAktiva = category.total.amount;
    } else if (category.type === 'KEWAJIBAN DAN EKUITAS') {
      category.children.forEach((subCategory) => {
        if (subCategory.type.includes('Kewajiban')) {
          totalKewajiban += subCategory.total.amount;
        } else if (subCategory.type === 'Ekuitas') {
          totalEkuitas = subCategory.total.amount;
        }
      });
    }
  });

  return { totalAktiva, totalKewajiban, totalEkuitas };
};

const LaporanPosisiKeuanganTable: React.FC = () => {
  // Ambil total aktiva, kewajiban, dan ekuitas
  const { totalAktiva, totalKewajiban, totalEkuitas } = getTotalValues();

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
            {/* Header dihapus */}
          </thead>
          <tbody>
            {/* AKTIVA */}
            {report.children.map((category, index) => (
              <React.Fragment key={index}>
                <tr className="bg-gray-200">
                  <td className="px-4 py-2 border-b border-black text-left font-bold">{category.type}</td>
                  <td className="px-4 py-2 border-b border-black text-right"></td>
                </tr>
                {category.children.map((subCategory, idx) => (
                  <React.Fragment key={idx}>
                    <tr className="bg-gray-100">
                      <td className="px-4 py-2 border-b border-black text-left font-bold">{subCategory.type}</td>
                      <td className="px-4 py-2 border-b border-black text-right"></td>
                    </tr>
                    {subCategory.children.map((item, idy) => (
                      <tr key={idy}>
                        <td className="px-4 py-2 border-b border-black border-r text-left">{item.accountName}</td>
                        <td className="px-4 py-2 border-b border-black text-right">
                          <span className="float-left">Rp</span>
                          <span className="float-right">{formatRupiah(item.amount)}</span>
                        </td>
                      </tr>
                    ))}
                    {/* Total per subkategori */}
                    <tr className="bg-gray-100 font-bold">
                      <td className="px-4 py-2 border-b border-black border-r text-left">{subCategory.total.name}</td>
                      <td className="px-4 py-2 border-b border-black text-right">
                        <span className="float-left">Rp</span>
                        <span className="float-right">{formatRupiah(subCategory.total.amount)}</span>
                      </td>
                    </tr>
                  </React.Fragment>
                ))}
                {/* Total per kategori */}
                <tr className="bg-[#B5E6A2] font-bold">
                  <td className="px-4 py-2 border-b border-black border-r text-center">{category.total.name}</td>
                  <td className="px-4 py-2 border-b border-black text-right">
                    <span className="float-left">Rp</span>
                    <span className="float-right">{formatRupiah(category.total.amount)}</span>
                  </td>
                </tr>
              </React.Fragment>
            ))}

            {/* Total Keseluruhan */}
            {/* <tr className="bg-[#4EA72E] font-bold">
              <td className="px-4 py-2 border-b border-black border-r text-left">Total Kewajiban</td>
              <td className="px-4 py-2 border-b border-black text-right">
                <span className="float-left">Rp</span>
                <span className="float-right">{formatRupiah(totalKewajiban)}</span>
              </td>
            </tr> */}
            {/* <tr className="bg-[#4EA72E] font-bold">
              <td className="px-4 py-2 border-b border-black border-r text-left">Total Ekuitas</td>
              <td className="px-4 py-2 border-b border-black text-right">
                <span className="float-left">Rp</span>
                <span className="float-right">{formatRupiah(totalEkuitas)}</span>
              </td>
            </tr>
            <tr className="bg-[#4EA72E] font-bold">
              <td className="px-4 py-2 border-b border-black border-r text-left">Total Aktiva</td>
              <td className="px-4 py-2 border-b border-black text-right">
                <span className="float-left">Rp</span>
                <span className="float-right">{formatRupiah(totalAktiva)}</span>
              </td>
            </tr> */}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LaporanPosisiKeuanganTable;
