import React from 'react';
import { accounts } from '../dummy-data/neraca-lajur';

const formatRupiah = (value: number) => {
    if (value === 0) {
        return '-'; // Jika nilai 0, tampilkan "-"
    }
    // Pisahkan Rp dan nominal agar bisa diberikan style yang berbeda
    const formattedValue = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
    return formattedValue.replace('Rp', ''); // Hilangkan 'Rp' agar bisa ditangani terpisah di JSX
};

// Fungsi untuk menghitung total Neraca Saldo Debit
const getTotalNeracaSaldoDebit = () => {
  return accounts.reduce((total, account) => total + account.NeracaSaldoDebit, 0);
};

// Fungsi untuk menghitung total Neraca Saldo Kredit
const getTotalNeracaSaldoKredit = () => {
  return accounts.reduce((total, account) => total + account.NeracaSaldoKredit, 0);
};

// Fungsi untuk menghitung total Laba Rugi Kredit
const getTotalLabaRugiKredit = () => {
  return accounts.reduce((total, account) => total + account.LabaRugiKredit, 0);
};

// Fungsi untuk menghitung total Laba Rugi Debit
const getTotalLabaRugiDebit = () => {
  return accounts.reduce((total, account) => total + account.LabaRugiDebit, 0);
};

// Fungsi untuk menghitung total Neraca Debit
const getTotalNeracaDebit = () => {
  return accounts.reduce((total, account) => total + account.NeracaDebit, 0);
};

// Fungsi untuk menghitung total Neraca Kredit
const getTotalNeracaKredit = () => {
  return accounts.reduce((total, account) => total + account.NeracaKredit, 0);
};

const NeracaLajurTable: React.FC = () => {
  const totalNeracaSaldoDebit = getTotalNeracaSaldoDebit();
  const totalNeracaSaldoKredit = getTotalNeracaSaldoKredit();
  const totalLabaRugiKredit = getTotalLabaRugiKredit();
  const totalLabaRugiDebit = getTotalLabaRugiDebit();
  const totalNeracaDebit = getTotalNeracaDebit();
  const totalNeracaKredit = getTotalNeracaKredit();

    return (
        <div className="w-[1100px] min-h-[550px] mx-auto p-5" style={{ fontSize: '8pt' }}> {/* Ubah dari '10pt' ke '8pt' dan padding */}
            {/* Bagian Header Laporan */}
            <div className="flex flex-col items-center justify-center text-center mb-10">
                <h1 className="text-lg mb-2">Kode perusahaan</h1>
                <h1 className="text-3xl font-bold mb-2">Neraca Lajur</h1>
                <h1 className="text-lg">Bulan ini</h1>
            </div>

            {/* Bagian Tabel Transaksi */}
            <div>
                <table className="w-[1000px] bg-white border border-black"> {/* Ubah border menjadi hitam */}
                    <thead>
                        <tr className="bg-[#4EA72E]">
                            <th rowSpan={2} className="px-2 py-1 border-b border-black border-r text-center">Nomor Akun</th>
                            <th rowSpan={2} className="px-2 py-1 border-b border-black border-r text-center">Nama Akun</th>
                            <th rowSpan={2} className="px-2 py-1 border-b border-black border-r text-center">Pos Saldo</th>
                            <th colSpan={2} className="px-2 py-1 border-b border-black border-r text-center">Neraca Saldo</th>
                            <th rowSpan={2} className="px-2 py-1 border-b border-black border-r text-center">Pos Laporan</th>
                            <th colSpan={2} className="px-2 py-1 border-b border-black border-r text-center">Laba Rugi </th>
                            <th colSpan={2} className="px-2 py-1 border-b border-black text-center">Neraca</th>
                        </tr>
                        <tr className='bg-[#4EA72E]'>
                            <th className='px-2 py-1 border-b border-black border-r text-center'>Debit</th>
                            <th className='px-2 py-1 border-b border-black border-r text-center'>Kredit</th>
                            <th className='px-2 py-1 border-b border-black border-r text-center'>Debit</th>
                            <th className='px-2 py-1 border-b border-black border-r text-center'>Kredit</th>
                            <th className='px-2 py-1 border-b border-black border-r text-center'>Debit</th>
                            <th className='px-2 py-1 border-b border-black border-r text-center'>Kredit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((items, index) => (
                            <tr key={index}>
                                <td className='px-2 py-1 border-b border-black border-r text-center'>{items.NomorAkun}</td>
                                <td className='px-2 py-1 border-b border-black border-r text-center'>{items.NamaAkun}</td>
                                <td className='px-2 py-1 border-b border-black border-r text-center'>{items.PosSaldo}</td>
                                <td className='px-2 py-1 border-b border-black border-r text-left'>
                                    <span className="text-left">Rp</span>
                                    <span className="float-right">{formatRupiah(items.NeracaDebit)}</span>
                                </td>
                                <td className='px-2 py-1 border-b border-black border-r text-left'>
                                    <span className="text-left">Rp</span>
                                    <span className="float-right">{formatRupiah(items.NeracaKredit)}</span>
                                </td>
                                <td className='px-2 py-1 border-b border-black border-r text-center'>{items.PosLaporan}</td>
                                <td className='px-2 py-1 border-b border-black border-r text-left'>
                                    <span className="text-left">Rp</span>
                                    <span className="float-right">{formatRupiah(items.LabaRugiDebit)}</span>
                                </td>
                                <td className='px-2 py-1 border-b border-black border-r text-left'>
                                    <span className="text-left">Rp</span>
                                    <span className="float-right">{formatRupiah(items.LabaRugiKredit)}</span>
                                </td>
                                <td className='px-2 py-1 border-b border-black border-r text-left'>
                                    <span className="text-left">Rp</span>
                                    <span className="float-right">{formatRupiah(items.NeracaSaldoDebit)}</span>
                                </td>
                                <td className='px-2 py-1 border-b border-black border-r text-left'>
                                    <span className="text-left">Rp</span>
                                    <span className="float-right">{formatRupiah(items.NeracaSaldoKredit)}</span>
                                </td>
                            </tr>
                        ))}
                        <tr className="bg-[#B5E6A2]">
                          <td className="px-4 py-2 border-b border-black border-r text-center" colSpan={2}><strong>JUMLAH</strong></td>
                          <td className="px-4 py-2 border-b border-black border-r text-center"></td>
                          <td className='px-2 py-1 border-b border-black border-r text-left'>
                            <span className="text-left">Rp</span>
                            <span className="float-right">{formatRupiah(totalNeracaSaldoDebit)}</span> {/* Gantilah dengan nilai yang sesuai */}
                          </td>
                          <td className='px-2 py-1 border-b border-black border-r text-left'>
                            <span className="text-left">Rp</span>
                            <span className="float-right">{formatRupiah(totalNeracaSaldoKredit)}</span> {/* Gantilah dengan nilai yang sesuai */}
                          </td>
                          <td className="px-4 py-2 border-b border-black border-r text-center"></td>
                          <td className='px-2 py-1 border-b border-black border-r text-left'>
                            <span className="text-left">Rp</span>
                            <span className="float-right">{formatRupiah(totalLabaRugiDebit)}</span> {/* Gantilah dengan nilai yang sesuai */}
                          </td>
                          <td className='px-2 py-1 border-b border-black border-r text-left'>
                            <span className="text-left">Rp</span>
                            <span className="float-right">{formatRupiah(totalLabaRugiKredit)}</span> {/* Gantilah dengan nilai yang sesuai */}
                          </td>
                          <td className='px-2 py-1 border-b border-black border-r text-left'>
                            <span className="text-left">Rp</span>
                            <span className="float-right">{formatRupiah(totalNeracaDebit)}</span> {/* Gantilah dengan nilai yang sesuai */}
                          </td>
                          <td className='px-2 py-1 border-b border-black border-r text-left'>
                            <span className="text-left">Rp</span>
                            <span className="float-right">{formatRupiah(totalNeracaKredit)}</span> {/* Gantilah dengan nilai yang sesuai */}
                          </td>
                        </tr>
                        <tr className="bg-[#B5E6A2]">
                          <td className="px-4 py-2 border-b border-black border-r text-center" colSpan={2}><strong>LABA/RUGI</strong></td>
                          <td className="px-4 py-2 border-b border-black border-r text-center"></td>
                          <td className="px-4 py-2 border-b border-black border-r text-center"></td>
                          <td className="px-4 py-2 border-b border-black border-r text-center"></td>
                          <td className="px-4 py-2 border-b border-black border-r text-center"></td>
                        </tr>
                        <tr className="bg-[#B5E6A2]">
                          <td className="px-4 py-2 border-b border-black border-r text-center" colSpan={2}><strong>TOTAL</strong></td>
                          <td className="px-4 py-2 border-b border-black border-r text-center"></td>
                          <td className="px-4 py-2 border-b border-black border-r text-center"></td>
                          <td className="px-4 py-2 border-b border-black border-r text-center"></td>
                          <td className="px-4 py-2 border-b border-black border-r text-center"></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NeracaLajurTable;
