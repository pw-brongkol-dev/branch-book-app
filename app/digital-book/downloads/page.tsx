'use client'; // Menandakan bahwa ini adalah komponen klien

import jsPDF from 'jspdf'; // Tambahkan import jsPDF (Jika diperlukan)
import Link from 'next/link'; // Tambahkan import Link
import { useRef } from 'react';
import { FaFileAlt } from 'react-icons/fa';
import React from 'react';
import ReactToPrint from 'react-to-print';
import JurnalUmum from './dummy-data/jurnalumum';

export default function Home() {
  const componentRef = useRef<React.ElementRef<typeof JurnalUmum>>(null); // Referensi ke komponen JurnalUmum

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Download Laporan</h1>

        <div className="grid grid-cols-2 gap-6">
          <ReactToPrint
            trigger={() => (
              <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
                <FaFileAlt className="mr-2 pl-2 text-2xl" /> Jurnal Umum
              </button>
            )}
            content={() => componentRef.current} // Pastikan ini mengembalikan referensi yang benar
          />
          {/* Tombol lainnya */}
          <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
            <FaFileAlt className="mr-2 pl-2 text-2xl" /> Neraca Saldo
          </button>
          <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
            <FaFileAlt className="mr-2 pl-2 text-2xl" /> Laba Rugi
          </button>
          <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
            <FaFileAlt className="mr-2 pl-2 text-2xl" /> Laporan Posisi Keuangan
          </button>
          <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
            <FaFileAlt className="mr-2 pl-2 text-2xl" /> Laporan Perubahan Modal
          </button>
        </div>

        {/* Komponen yang ingin dicetak */}
        <div ref={componentRef}>
          <JurnalUmum />
        </div>

        <Link href="/digital-book">
          <button className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-blue-600 text-white hover:bg-blue-700 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5">
            Kembali ke Daftar Transaksi
          </button>
        </Link>
      </main>
    </div>
  );
}
