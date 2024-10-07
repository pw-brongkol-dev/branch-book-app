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

import docIcon from '@/app/icons/description_40dp_1C1B1F.svg';
import Image from 'next/image';

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
    <div className="relative">
      <BackButton color="violet" />

      <div className="flex flex-col px-6 pt-4 gap-6">
        <h2 className="text-3xl text-gray-700">Laporan Keuangan</h2>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="font-medium text-sm">Bulan</label>
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
          <div className="flex-1 flex flex-col gap-1">
            <label className="font-medium text-sm">Tahun</label>
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
      <main className="flex flex-col row-start-2 items-center sm:items-start">
        <div className="grid grid-cols-2 gap-3 w-full">
          <ReactToPrint
            trigger={() => (
              <button className="w-full text-left bg-violet-200 active:ring-4 active:ring-violet-200 active:bg-violet-300 p-4 rounded-2xl flex flex-col gap-1">
                <Image src={docIcon} alt="add icon" />
                <span className="font-medium inline-block leading-5">
                  Jurnal
                  <br />
                  Umum
                </span>
              </button>
            )}
            content={() => componentRef1.current} // Pastikan ini mengembalikan referensi yang benar
          />
          <ReactToPrint
            trigger={() => (
              <button className="w-full text-left bg-[#FFE49E] active:ring-4 active:ring-[#ffebb9] active:bg-[#ffdc85] p-4 rounded-2xl flex flex-col gap-1">
                <Image src={docIcon} alt="add icon" width={40} height={40} />
                <span className="font-medium inline-block leading-5">
                  Neraca
                  <br />
                  Lajur
                </span>
              </button>
            )}
            content={() => componentRef2.current} // Pastikan ini
          />
          <ReactToPrint
            trigger={() => (
              <button className="w-full text-left bg-[#FFE49E] active:ring-4 active:ring-[#ffebb9] active:bg-[#ffdc85] p-4 rounded-2xl flex flex-col gap-1">
                <Image src={docIcon} alt="add icon" width={40} height={40} />
                <span className="font-medium inline-block leading-5">
                  Neraca
                  <br />
                  Saldo
                </span>
              </button>
            )}
            content={() => componentRef3.current} // Pastikan ini mengembalikan referensi yang benar
          />
          <ReactToPrint
            trigger={() => (
              <button className="w-full text-left bg-violet-200 active:ring-4 active:ring-violet-200 active:bg-violet-300 p-4 rounded-2xl flex flex-col gap-1">
                <Image src={docIcon} alt="add icon" />
                <span className="font-medium inline-block leading-5">
                  Laba
                  <br />
                  Rugi
                </span>
              </button>
            )}
            content={() => componentRef4.current}
          />
          <ReactToPrint
            trigger={() => (
              <button className="w-full text-left bg-violet-200 active:ring-4 active:ring-violet-200 active:bg-violet-300 p-4 rounded-2xl flex flex-col gap-1">
                <Image src={docIcon} alt="add icon" />
                <span className="font-medium inline-block leading-5">
                  Laporan Posisi
                  <br />
                  Keuangan
                </span>
              </button>
            )}
            content={() => componentRef5.current}
          />
          <ReactToPrint
            trigger={() => (
              <button className="w-full text-left bg-[#FFE49E] active:ring-4 active:ring-[#ffebb9] active:bg-[#ffdc85] p-4 rounded-2xl flex flex-col gap-1">
                <Image src={docIcon} alt="add icon" width={40} height={40} />
                <span className="font-medium inline-block leading-5">
                  Laporan
                  <br />
                  Perubahan Modal
                </span>
              </button>
            )}
            content={() => componentRef6.current}
          />
        </div>

        {/* Komponen yang ingin dicetak */}
        <div className="w-1 h-1 overflow-hidden">
          <div ref={componentRef1}>
            <JurnalUmum transactions={reportJurnalUmum} />
          </div>
        </div>
        <div className="w-1 h-1 overflow-hidden">
          <div ref={componentRef2}>
            <NeracaLajur accounts={reportNeracaLajur} />
          </div>
        </div>
        <div className="w-1 h-1 overflow-hidden">
          <div ref={componentRef3}>
            <NeracaSaldo report={reportNeracaSaldo} />
          </div>
        </div>
        <div className="w-1 h-1 overflow-hidden">
          <div ref={componentRef4}>
            <LabaRugi report={reportLabaRugi} />
          </div>
        </div>
        <div className="w-1 h-1 overflow-hidden">
          <div ref={componentRef5}>
            <LaporanPosisiKeuangan report={reportLaporanPosisiKeuangan} />
          </div>
        </div>
        <div className="w-1 h-1 overflow-hidden">
          <div ref={componentRef6}>
            <LaporanPerubahanModal report={reportLaporanPerubahanModal} />
          </div>
        </div>
      </main>
  );
}
