"use client"; // Menandakan bahwa ini adalah komponen klien

import jsPDF from "jspdf"; // Tambahkan import jsPDF

// Fungsi untuk membuat dan mengunduh PDF
const generatePDF = () => {
  const doc = new jsPDF();
  
  // Judul
  doc.text("Laporan Laba Rugi", 10, 10);
  
  // Header tabel
  doc.setFontSize(12);
  doc.text("Pendapatan", 10, 20);
  doc.text("Penjualan", 100, 20);
  
  // Garis header tabel
  doc.line(10, 21, 200, 21); // Garis horizontal

  // Data tabel
  const data = [
    { pendapatan: "Rp 10.000.000", penjualan: "Rp 8.000.000" },
    { pendapatan: "Rp 12.000.000", penjualan: "Rp 9.500.000" },
    { pendapatan: "Rp 15.000.000", penjualan: "Rp 11.000.000" },
  ];

  let y = 30; // Posisi Y untuk baris tabel
  data.forEach((item) => {
    doc.text(item.pendapatan, 10, y);
    doc.text(item.penjualan, 100, y);
    y += 10; // Jarak antar baris

    // Garis horizontal untuk setiap baris
    doc.line(10, y - 5, 200, y - 5); // Garis horizontal
  });

  // Simpan PDF
  doc.save("laporan_laba_rugi.pdf");
};

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Laporan Laba Rugi</h1>

        <button
          onClick={generatePDF} // Tambahkan tombol untuk mengunduh PDF
          className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
        >
          Unduh Laporan Laba Rugi
        </button>
      </main>
    </div>
  );
}
