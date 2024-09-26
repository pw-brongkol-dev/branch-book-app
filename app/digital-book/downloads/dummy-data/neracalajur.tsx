import React from 'react';
import { accounts } from './neraca-lajur';

const formatRupiah = (value: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(value);
};

const NeracaLajurTable: React.FC = () => {
    return (
        <div className="w-[210mm] min-h-[297mm] mx-auto p-5" style={{ fontSize: '8pt' }}> {/* Ubah dari '10pt' ke '8pt' dan padding */}
            {/* Bagian Header Laporan */}
            <div className="flex flex-col items-center justify-center text-center mb-10">
                <h1 className="text-lg mb-2">Kode perusahaan</h1>
                <h1 className="text-3xl font-bold mb-2">Neraca Lajur</h1>
                <h1 className="text-lg">Bulan ini</h1>
            </div>

            {/* Bagian Tabel Transaksi */}
            <div>
                <table className="w-full bg-white border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100">
                            <th rowSpan={2} className="px-2 py-1 border-b border-r text-left">Nomor Akun</th>
                            <th rowSpan={2} className="px-2 py-1 border-b border-r text-left">Nama Akun</th>
                            <th rowSpan={2} className="px-2 py-1 border-b border-r text-left">Pos Saldo</th>
                            <th colSpan={2} className="px-2 py-1 border-b border-r text-right">Neraca Saldo</th>
                            <th rowSpan={2} className="px-2 py-1 border-b border-r text-right">Pos Laporan</th>
                            <th colSpan={2} className="px-2 py-1 border-b border-r text-right">Laba Rugi </th>
                            <th colSpan={2} className="px-2 py-1 border-b text-right">Neraca</th>
                        </tr>
                        <tr className='bg-gray-100'>
                            <th className='px-2 py-1 border-b border-r text-left'>Debit</th>
                            <th className='px-2 py-1 border-b border-r text-left'>Kredit</th>
                            <th className='px-2 py-1 border-b border-r text-left'>Debit</th>
                            <th className='px-2 py-1 border-b border-r text-left'>Kredit</th>
                            <th className='px-2 py-1 border-b border-r text-left'>Debit</th>
                            <th className='px-2 py-1 border-b border-r text-left'>Kredit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.map((items, index) => (
                            <tr key={index}>
                                <td className='px-2 py-1 border-b border-r text-center'>{items.NomorAkun}</td>
                                <td className='px-2 py-1 border-b border-r text-center'>{items.NamaAkun}</td>
                                <td className='px-2 py-1 border-b border-r text-center'>{items.PosSaldo}</td>
                                <td className='px-2 py-1 border-b border-r text-center'>{formatRupiah(items.NeracaDebit)}</td>
                                <td className='px-2 py-1 border-b border-r text-center'>{formatRupiah(items.NeracaKredit)}</td>
                                <td className='px-2 py-1 border-b border-r text-center'>{items.PosLaporan}</td>
                                <td className='px-2 py-1 border-b border-r text-center'>{formatRupiah(items.LabaRugiDebit)}</td>
                                <td className='px-2 py-1 border-b border-r text-center'>{formatRupiah(items.LabaRugiKredit)}</td>
                                <td className='px-2 py-1 border-b border-r text-center'>{formatRupiah(items.NeracaSaldoDebit)}</td>
                                <td className='px-2 py-1 border-b border-r text-center'>{formatRupiah(items.NeracaSaldoKredit)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default NeracaLajurTable;