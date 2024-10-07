"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function BackButton({color="gray"}) {
  const router = useRouter();

  function getTheme (colorTheme) {
    if (colorTheme === "green") {
      return "bg-[#F2F7EE] active:bg-[#d9ebca] active:ring-2 active:ring-[#F2F7EE]"
    } else if (colorTheme === "violet") {
      return "bg-violet-50 active:bg-violet-200 active:ring-2 active:ring-violet-50"
    } else {
      return "bg-gray-50 active:bg-gray-100 active:ring-2 active:ring-gray-50"
    }

  }

  return (
    <button
      onClick={() => router.back()}
      className={`flex items-center h-12 pl-3 pr-5 rounded-3xl sticky top-2 w-fit my-2 ml-2 z-50 ${getTheme(color)}`}
    >
      <div className="grid place-items-center">
        <ArrowLeft size={24} /> {/* Use the Lucide React icon here */}
      </div>
      <p className="text-base font-medium">Kembali</p>
    </button>
  );
}
