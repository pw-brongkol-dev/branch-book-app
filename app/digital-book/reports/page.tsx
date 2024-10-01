'use client'; // Menandakan bahwa ini adalah komponen klien

import { useRef, useState } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import React from 'react';
import ReactToPrint from 'react-to-print';
// import JurnalUmum from './tables/jurnalumum';
// import NeracaLajur from './tables/neracalajur';
// import NeracaSaldo from './tables/neracasaldo';
// import LabaRugi from './tables/labarugi'
// import LaporanPosisiKeuangan from './tables/laporanposisikeuangan';
// import LaporanPerubahanModal from './tables/laporanperubahanmodal'
import { generateReportData } from './generate-report-data';
import BackButton from '../../components/BackButton';

export default function ReportPage() {
  const { reportJurnalUmum, reportNeracaLajur, reportNeracaSaldo, reportLabaRugi, reportLaporanPosisiKeuangan, reportLaporanPerubahanModal } =
    generateReportData({ month: 8, year: 2024 });

  const JurnalUmum = reportJurnalUmum;
  const NeracaLajur = reportNeracaLajur;
  const NeracaSaldo = reportNeracaSaldo;
  const LabaRugi = reportLabaRugi;
  const LaporanPosisiKeuangan = reportLaporanPosisiKeuangan;
  const LaporanPerubahanModal = reportLaporanPerubahanModal;

  const componentRef1 = useRef<React.ElementRef<typeof JurnalUmum>>(null); // Referensi ke komponen JurnalUmum
  const componentRef2 = useRef<React.ElementRef<typeof NeracaLajur>>(null);
  const componentRef3 = useRef<React.ElementRef<typeof NeracaSaldo>>(null);
  const componentRef4 = useRef<React.ElementRef<typeof LabaRugi>>(null);
  const componentRef5 = useRef<React.ElementRef<typeof LaporanPosisiKeuangan>>(null);
  const componentRef6 = useRef<React.ElementRef<typeof LaporanPerubahanModal>>(null);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <BackButton /> {/* Tambahkan BackButton di sini */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Download Laporan</h1>

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
            <JurnalUmum />
          </div>
        </div>
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef2}>
            <NeracaLajur />
          </div>
        </div>
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef3}>
            <NeracaSaldo />
          </div>
        </div>
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef4}>
            <LabaRugi />
          </div>
        </div>
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef5}>
            <LaporanPosisiKeuangan />
          </div>
        </div>
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef6}>
            <LaporanPerubahanModal />
          </div>
        </div>
      </main>
    </div>
  );
}
