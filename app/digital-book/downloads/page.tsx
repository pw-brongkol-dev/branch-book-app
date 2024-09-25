"use client"; // Menandakan bahwa ini adalah komponen klien

import jsPDF from "jspdf"; // Tambahkan import jsPDF
import Link from 'next/link'; // Tambahkan import Link
import { FaFileAlt } from 'react-icons/fa'; // Tambahkan import untuk ikon
import BackButton from '../../components/BackButton'; // Pastikan import BackButton ada

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <BackButton /> {/* Tambahkan BackButton di sini */}
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Download Laporan</h1>

        <div className="grid grid-cols-2 gap-6">
          <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
            <FaFileAlt className="mr-2 pl-2 text-2xl" />
            <span className="text-left"> Jurnal Umum </span>
          </button>
          <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
            <FaFileAlt className="mr-2 pl-2 text-2xl" />
            <span className="text-left"> Neraca Lajur </span>
          </button>
          <button className="flex items-center bg-[#16a34a] text-white hover:bg-[#128a3a] rounded-[14px] w-auto h-[60px] text-sm sm:text-base px-2 sm:px-4">
            <FaFileAlt className="mr-2 pl-2 text-2xl" />
            <span className="text-left"> Neraca Saldo </span>
          </button>
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
            <span className="text-left">Laporan Perubahan Modal</span>
          </button>
        </div>
      </main>
    </div>
  );
}
