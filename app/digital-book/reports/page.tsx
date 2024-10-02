'use client'; // Menandakan bahwa ini adalah komponen klien

import { useRouter } from 'next/navigation';
import { useFirestore } from '@/app/hooks/useFirestore';

import { useRef, useState, useEffect } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import React from 'react';
import ReactToPrint from 'react-to-print';

import { generateReportData } from './generate-report-data';
import BackButton from '../../components/BackButton';

import JurnalUmum from './tables/02-jurnal-umum';
import NeracaLajur from './tables/03-neraca-lajur';
import NeracaSaldo from './tables/04-neraca-saldo';
import LabaRugi from './tables/05-laba-rugi';
import LaporanPosisiKeuangan from './tables/06-laporan-posisi-keuangan';
import LaporanPerubahanModal from './tables/07-laporan-perubahan-modal';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';

export default function ProcessDataReport() {
  const router = useRouter();
  const { getTransactionsByUserId, getAllAccounts } = useFirestore();
  const [data, setData] = useState(null);
  const [processDataStatus, setProcessDataStatus] = useState('idle');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // Default to current month
  const [inputYear, setInputYear] = useState(new Date().getFullYear()); // Default to current year

  useEffect(() => {
    setProcessDataStatus('processing');
    const userId = localStorage.getItem('user_id_branch_book_app');
    if (!userId) {
      router.push('/auth/login');
    } else {
      handleProcess();
      setProcessDataStatus('completed');
    }
  }, [router, selectedMonth, inputYear]);

  const handleProcess = async () => {
    const userId = localStorage.getItem('user_id_branch_book_app');
    if (userId) {
      try {
        const transactions = await getTransactionsByUserId(userId, selectedMonth, inputYear);
        const accounts = await getAllAccounts();

        const reportData = generateReportData({
          month: selectedMonth,
          year: inputYear,
          transactions: transactions,
          accounts: accounts,
        });

        setData(reportData);
        console.log(reportData);
      } catch (err) {
        console.error('error', err);
      }
    }
  };

  return (
    <div className="w-full h-dvh grid place-items-center">
      <div className="max-w-md mx-auto flex flex-col gap-4">
        <BackButton />
        <h1 className="text-3xl font-bold">Download Laporan</h1>
        <div className="flex gap-4">
          <div className="flex-1">
            <label>Bulan</label>
            <Select value={selectedMonth} onValueChange={(value) => setSelectedMonth(Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Month" />
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
          <div className="flex-1">
            <label>Tahun</label>
            <Input
              type="number"
              value={inputYear}
              onChangeCapture={(e) => setInputYear(Number(e.target.value))}
              min="2000" // Set a minimum year
            />
          </div>
        </div>
        {processDataStatus === 'idle' ? (
          <p>please wait</p>
        ) : processDataStatus === 'processing' ? (
          <p>loading...</p>
        ) : (
          data && <ReportDownloads data={data} />
        )}
      </div>
    </div>
  );
}

function ReportDownloads({ data }) {
  const { reportJurnalUmum, reportNeracaLajur, reportNeracaSaldo, reportLabaRugi, reportLaporanPosisiKeuangan, reportLaporanPerubahanModal } = data;

  const componentRef1 = useRef<React.ElementRef<typeof JurnalUmum>>(null); // Referensi ke komponen JurnalUmum
  const componentRef2 = useRef<React.ElementRef<typeof NeracaLajur>>(null);
  const componentRef3 = useRef<React.ElementRef<typeof NeracaSaldo>>(null);
  const componentRef4 = useRef<React.ElementRef<typeof LabaRugi>>(null);
  const componentRef5 = useRef<React.ElementRef<typeof LaporanPosisiKeuangan>>(null);
  const componentRef6 = useRef<React.ElementRef<typeof LaporanPerubahanModal>>(null);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="grid grid-cols-2 gap-6">
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
                <FaFileAlt className="mr-2 pl-2 text-2xl" />
                <span className="text-left"> Jurnal Umum </span>
              </button>
            )}
            content={() => componentRef1.current} // Pastikan ini mengembalikan referensi yang benar
          />
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
                <FaFileAlt className="mr-2 pl-2 text-2xl" />
                <span className="text-left"> Neraca Lajur </span>
              </button>
            )}
            content={() => componentRef2.current} // Pastikan ini
          />
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
                <FaFileAlt className="mr-2 pl-2 text-2xl" />
                <span className="text-left"> Neraca Saldo </span>
              </button>
            )}
            content={() => componentRef3.current} // Pastikan ini mengembalikan referensi yang benar
          />
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
                <FaFileAlt className="mr-2 pl-2 text-2xl" />
                <span className="text-left"> Laba Rugi </span>
              </button>
            )}
            content={() => componentRef4.current}
          />
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center justify-start bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
                <FaFileAlt className="mr-2 pl-2 text-2xl" />
                <span className="text-left"> Laporan Posisi Keuangan </span>
              </button>
            )}
            content={() => componentRef5.current}
          />
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
                <FaFileAlt className="mr-2 pl-2 text-2xl" />
                <span className="text-left"> Laporan Perubahan Modal </span>
              </button>
            )}
            content={() => componentRef6.current}
          />
        </div>

        {/* Komponen yang ingin dicetak */}
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef1}>
            <JurnalUmum transactions={reportJurnalUmum} />
          </div>
        </div>
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef2}>
            <NeracaLajur accounts={reportNeracaLajur} />
          </div>
        </div>
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef3}>
            <NeracaSaldo report={reportNeracaSaldo} />
          </div>
        </div>
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef4}>
            <LabaRugi report={reportLabaRugi} />
          </div>
        </div>
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef5}>
            <LaporanPosisiKeuangan report={reportLaporanPosisiKeuangan} />
          </div>
        </div>
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef6}>
            <LaporanPerubahanModal report={reportLaporanPerubahanModal} />
          </div>
        </div>
      </main>
    </div>
  );
}
