"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton() {
  const router = useRouter();
  return (
    <button
      onClick={() => router.back()}
      className="flex items-center h-12 px-4 bg-white rounded-3xl shadow-sm fixed top-3 left-3 z-50 border-2 border-slate-200"
    >
      <div className="grid place-items-center">
        <ArrowLeft size={24} /> {/* Use the Lucide React icon here */}
      </div>
      <p className="text-base font-medium">Kembali</p>
    </button>
  );
}
