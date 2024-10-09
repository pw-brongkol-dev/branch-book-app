'use client'; // Menandakan bahwa ini adalah komponen klien

import { useRouter } from 'next/navigation';
import { useFirestore } from '@/app/hooks/useFirestore';
import { useRef, useState, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import BackButton from '../../components/BackButton';
import LaporanLabaRugi from './tables/LaporanLabaRugi';
import LaporanPosisiKeuangan from './tables/LaporanPosisiKeuangan';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import docIcon from '@/app/icons/description_40dp_1C1B1F.svg';

export default function ProcessDataReport() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [inputYear, setInputYear] = useState(new Date().getFullYear()); // Default to current year
  const data = { transactions: [], accounts: [] }; // Data dummy langsung diinisialisasi

  useEffect(() => {
    const userId = localStorage.getItem('user_id_branch_book_app');
    if (!userId) {
      router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="relative">
      <BackButton color="violet" />
      <div className="flex flex-col px-6 pt-4 gap-6">
        <h2 className="text-3xl text-gray-700">Laporan Keuangan</h2>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="font-medium text-sm">Bulan</label>
            <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, index) => (
                  <SelectItem key={index} value={index + 1}>
                    {new Date(0, index).toLocaleString('default', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="font-medium text-sm">Tahun</label>
            <Input type="number" value={inputYear} onChange={(e) => setInputYear(Number(e.target.value))} min="2000" />
          </div>
        </div>

        {/* Langsung menampilkan ReportDownloads dengan data dummy */}
        <ReportDownloads data={data} />
      </div>
    </div>
  );
}

function ReportDownloads({ data }) {
  const componentRef1 = useRef(null);
  const componentRef2 = useRef(null);

  return (
    <main className="flex flex-col row-start-2 items-center sm:items-start">
      <div className="grid grid-cols-2 gap-3 w-full">
        <ReactToPrint
          trigger={() => (
            <button className="w-full text-left bg-violet-200 active:ring-4 active:ring-violet-200 active:bg-violet-300 p-4 rounded-2xl flex flex-col gap-1">
              <Image src={docIcon} alt="doc icon" />
              <span className="font-medium inline-block leading-5">
                Laporan Laba
                <br />
                Rugi
              </span>
            </button>
          )}
          content={() => componentRef1.current}
        />
        <ReactToPrint
          trigger={() => (
            <button className="w-full text-left bg-[#FFE49E] active:ring-4 active:ring-[#ffebb9] active:bg-[#ffdc85] p-4 rounded-2xl flex flex-col gap-1">
              <Image src={docIcon} alt="doc icon" width={40} height={40} />
              <span className="font-medium inline-block leading-5">
                Laporan Posisi
                <br />
                Keuangan
              </span>
            </button>
          )}
          content={() => componentRef2.current}
        />
      </div>

      {/* Komponen yang ingin dicetak */}
      <div className="w-1 h-1 overflow-hidden">
        <div ref={componentRef1}>
          <LaporanLabaRugi />
        </div>
      </div>
      <div className="w-1 h-1 overflow-hidden">
        <div ref={componentRef2}>
          <LaporanPosisiKeuangan />
        </div>
      </div>
    </main>
  );
}
