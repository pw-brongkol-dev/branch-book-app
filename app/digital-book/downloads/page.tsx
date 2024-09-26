'use client'; // Menandakan bahwa ini adalah komponen klien

import { useRef } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import React from 'react';
import ReactToPrint from 'react-to-print';
import JurnalUmum from './dummy-data/jurnalumum';
import NeracaLajur from './dummy-data/neracalajur';
import NeracaSaldo from './dummy-data/neracasaldo';
import BackButton from '../../components/BackButton';

export default function Home() {
  const componentRef = useRef<React.ElementRef<typeof JurnalUmum>>(null); // Referensi ke komponen JurnalUmum
  const componentRef1 = useRef<React.ElementRef<typeof NeracaLajur>>(null);
  const componentRef2 = useRef<React.ElementRef<typeof NeracaSaldo>>(null);

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
            content={() => componentRef.current} // Pastikan ini mengembalikan referensi yang benar
          />
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
                <FaFileAlt className="mr-2 pl-2 text-2xl" />
                <span className="text-left"> Neraca Lajur </span>
              </button>
            )}
            content={() => componentRef1.current} // Pastikan ini mengembalikan referensi yang benar
            // pageStyle={`@page { size: A4 landscape; }
            //           table { width: 100%; background-color: white; border: 1px solid gray; text-align: center; }
            //           th, td { border: 1px solid gray; padding: 0.25rem; text-align: center; }`}
          />
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
                <FaFileAlt className="mr-2 pl-2 text-2xl" />
                <span className="text-left"> Neraca Saldo </span>
              </button>
            )}
            content={() => componentRef2.current} // Pastikan ini mengembalikan referensi yang benar
          />
          <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
            <FaFileAlt className="mr-2 pl-2 text-2xl" />
            <span className="text-left"> Laba Rugi </span>
          </button>
          <button className="flex items-center justify-start bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
            <FaFileAlt className="mr-2 pl-2 text-2xl" />
            <span className="text-left"> Laporan Posisi Keuangan </span>
          </button>
          <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
            <FaFileAlt className="mr-2 pl-2 text-2xl" />
            <span className="text-left"> Laporan Perubahan Modal </span>
          </button>
        </div>

        {/* Komponen yang ingin dicetak */}
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef}>
            <JurnalUmum />
          </div>
        </div>
        <div className="w-2 h-2 overflow">
          <div ref={componentRef1}>
            <NeracaLajur />
          </div>
        </div>
        <div className="w-2 h-2 overflow-hidden">
          <div ref={componentRef2}>
            <NeracaSaldo />
          </div>
        </div>
      </main>
    </div>
  );
}
