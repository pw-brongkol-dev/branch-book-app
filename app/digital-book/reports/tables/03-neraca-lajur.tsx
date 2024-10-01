import React from 'react';
import { formatRupiah } from './utils';

// Define types for the report structure
type ReportNeracaLajur = {
  code: string;
  name: string;
  date: string; // Adjust type if date is a Date object
  children: TransactionGroup[];
  sum: {
    neracaSaldoDebit: number;
    neracaSaldoKredit: number;
    labaRugiDebit: number;
    labaRugiKredit: number;
    neracaDebit: number;
    neracaKredit: number;
  };
  profitLoss: {
    labaRugi: number;
    neraca: number;
  };
  total: {
    labaRugiDebit: number;
    labaRugiKredit: number;
    neracaDebit: number;
    neracaKredit: number;
  };
};

// Define types for the grouped transaction structure
type TransactionGroup = {
  NomorAkun: string;
  NamaAkun: string;
  PosSaldo: string;
  NeracaSaldoDebit: number;
  NeracaSaldoKredit: number;
  PosLaporan: string;
  LabaRugiDebit: number;
  LabaRugiKredit: number;
  NeracaDebit: number;
  NeracaKredit: number;
};

const NeracaLajurTable: React.FC<{ accounts: ReportNeracaLajur }> = ({ accounts }) => {
  // Ambil semua total dari fungsi getTotalValues
  const { neracaSaldoDebit, neracaSaldoKredit, labaRugiDebit, labaRugiKredit, neracaDebit, neracaKredit } = accounts.sum;

  return (
    <div className="w-[1100px] min-h-[550px] mx-auto p-5" style={{ fontSize: '8pt' }}>
      {/* Bagian Header Laporan */}
      <div className="flex flex-col items-center justify-center text-center mb-10">
        <h1 className="text-lg mb-2">{accounts.code}</h1> {/* Menampilkan kode perusahaan */}
        <h1 className="text-3xl font-bold mb-2">{accounts.name}</h1> {/* Menampilkan nama laporan */}
        <h1 className="text-lg">{accounts.date}</h1> {/* Menampilkan tanggal laporan */}
      </div>

      {/* Bagian Tabel Transaksi */}
      <div>
        <table className="w-[1050px] bg-white border border-black">
          <thead>
            <tr className="bg-[#4EA72E]">
              <th rowSpan={2} className="px-2 py-1 border-b border-black border-r text-center">
                Nomor Akun
              </th>
              <th rowSpan={2} className="px-2 py-1 border-b border-black border-r text-center">
                Nama Akun
              </th>
              <th rowSpan={2} className="px-2 py-1 border-b border-black border-r text-center">
                Pos Saldo
              </th>
              <th colSpan={2} className="px-2 py-1 border-b border-black border-r text-center">
                Neraca Saldo
              </th>
              <th rowSpan={2} className="px-2 py-1 border-b border-black border-r text-center">
                Pos Laporan
              </th>
              <th colSpan={2} className="px-2 py-1 border-b border-black border-r text-center">
                Laba Rugi
              </th>
              <th colSpan={2} className="px-2 py-1 border-b border-black text-center">
                Neraca
              </th>
            </tr>
            <tr className="bg-[#4EA72E]">
              <th className="px-2 py-1 border-b border-black border-r text-center">Debit</th>
              <th className="px-2 py-1 border-b border-black border-r text-center">Kredit</th>
              <th className="px-2 py-1 border-b border-black border-r text-center">Debit</th>
              <th className="px-2 py-1 border-b border-black border-r text-center">Kredit</th>
              <th className="px-2 py-1 border-b border-black border-r text-center">Debit</th>
              <th className="px-2 py-1 border-b border-black border-r text-center">Kredit</th>
            </tr>
          </thead>
          <tbody>
            {accounts.children.map((item, index) => (
              <tr key={index}>
                <td className="px-2 py-1 border-b border-black border-r text-center">{item.NomorAkun}</td>
                <td className="px-2 py-1 border-b border-black border-r text-center">{item.NamaAkun}</td>
                <td className="px-2 py-1 border-b border-black border-r text-center">{item.PosSaldo}</td>
                <td className="px-2 py-1 border-b border-black border-r text-left">
                  <span className="text-left">Rp</span>
                  <span className="float-right">{formatRupiah(item.NeracaSaldoDebit)}</span>
                </td>
                <td className="px-2 py-1 border-b border-black border-r text-left">
                  <span className="text-left">Rp</span>
                  <span className="float-right">{formatRupiah(item.NeracaSaldoKredit)}</span>
                </td>
                <td className="px-2 py-1 border-b border-black border-r text-center">{item.PosLaporan}</td>
                <td className="px-2 py-1 border-b border-black border-r text-left">
                  <span className="text-left">Rp</span>
                  <span className="float-right">{formatRupiah(item.LabaRugiDebit)}</span>
                </td>
                <td className="px-2 py-1 border-b border-black border-r text-left">
                  <span className="text-left">Rp</span>
                  <span className="float-right">{formatRupiah(item.LabaRugiKredit)}</span>
                </td>
                <td className="px-2 py-1 border-b border-black border-r text-left">
                  <span className="text-left">Rp</span>
                  <span className="float-right">{formatRupiah(item.NeracaDebit)}</span>
                </td>
                <td className="px-2 py-1 border-b border-black border-r text-left">
                  <span className="text-left">Rp</span>
                  <span className="float-right">{formatRupiah(item.NeracaKredit)}</span>
                </td>
              </tr>
            ))}

            {/* Baris Jumlah */}
            <tr className="bg-[#B5E6A2]">
              <td className="px-4 py-2 border-b border-black border-r text-center" colSpan={2}>
                <strong>JUMLAH</strong>
              </td>
              <td className="px-4 py-2 border-b border-black border-r text-center"></td>
              <td className="px-2 py-1 border-b border-black border-r text-left">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(neracaSaldoDebit)}</span>
              </td>
              <td className="px-2 py-1 border-b border-black border-r text-left">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(neracaSaldoKredit)}</span>
              </td>
              <td className="px-4 py-2 border-b border-black border-r text-center"></td>
              <td className="px-2 py-1 border-b border-black border-r text-left">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(labaRugiDebit)}</span>
              </td>
              <td className="px-2 py-1 border-b border-black border-r text-left">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(labaRugiKredit)}</span>
              </td>
              <td className="px-2 py-1 border-b border-black border-r text-left">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(neracaDebit)}</span>
              </td>
              <td className="px-2 py-1 border-b border-black border-r text-left">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(neracaKredit)}</span>
              </td>
            </tr>

            {/* Baris Tambahan (Laba/Rugi & Total) */}
            <tr className="bg-[#B5E6A2]">
              <td className="px-4 py-2 border-b border-black border-r text-center" colSpan={2}>
                <strong>LABA/RUGI</strong>
              </td>
              <td className="px-4 py-2 border-b border-black border-r text-center"></td>
              <td className="px-4 py-2 border-b border-black border-r text-center"></td>
              <td className="px-4 py-2 border-b border-black border-r text-center"></td>
              <td className="px-4 py-2 border-b border-black border-r text-center"></td>
              <td className="px-4 py-2 border-b border-black border-r text-center">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(labaRugiKredit - labaRugiDebit)}</span>
              </td>
              <td className="px-4 py-2 border-b border-black border-r text-center"></td>
              <td className="px-4 py-2 border-b border-black border-r text-center"></td>
              <td className="px-4 py-2 border-b border-black border-r text-center">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(neracaDebit - neracaKredit)}</span>
              </td>
            </tr>
            <tr className="bg-[#B5E6A2]">
              <td className="px-4 py-2 border-b border-black border-r text-center" colSpan={2}>
                <strong>TOTAL</strong>
              </td>
              <td className="px-4 py-2 border-b border-black border-r text-center"></td>
              <td className="px-4 py-2 border-b border-black border-r text-center"></td>
              <td className="px-4 py-2 border-b border-black border-r text-center"></td>
              <td className="px-4 py-2 border-b border-black border-r text-center"></td>
              <td className="px-4 py-2 border-b border-black border-r text-center">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(labaRugiDebit + (labaRugiKredit - labaRugiDebit))}</span>
              </td>
              <td className="px-4 py-2 border-b border-black border-r text-center">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(labaRugiKredit)}</span>
              </td>
              <td className="px-4 py-2 border-b border-black border-r text-center">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(neracaDebit)}</span>
              </td>
              <td className="px-4 py-2 border-b border-black border-r text-center">
                <span className="text-left">Rp</span>
                <span className="float-right">{formatRupiah(neracaKredit + (neracaDebit - neracaKredit))}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default NeracaLajurTable;
