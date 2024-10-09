'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { History, BookOpen, Sprout, Trees } from 'lucide-react';
import RippleButton from './components/RippleButton';
import { LucideIcon } from 'lucide-react';
import { useFirestore } from './hooks/useFirestore';
import Footer from './components/Footer';
import Image from 'next/image';
import geometricPattern from '@/app/images/geometric-pattern-homepage.svg';
import treeIcon from '@/app/icons/nature_40dp_white.svg';
import bookIcon from '@/app/icons/auto_stories_40dp_white.svg';

interface PastelIconProps {
  Icon: LucideIcon;
  bgColor: string;
  iconColor: string;
}

const PastelIcon: React.FC<PastelIconProps> = ({ Icon, bgColor, iconColor }) => {
  return (
    <div className={`${bgColor} rounded-full p-3 mb-4`}>
      <Icon className={`h-8 w-8 ${iconColor}`} />
    </div>
  );
};

export default function Home() {
  const router = useRouter(); // Initialize the router
  const { getUserById } = useFirestore();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('user_id_branch_book_app');
    if (!userId) {
      router.push('/auth/login');
    } else {
      setIsLoggedIn(true);
      getUserById(userId).then((data) => {
        setUserName(data?.name || '');
      });
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('user_id_branch_book_app'); // Clear user ID from local storage
    router.push('/auth/login'); // Redirect to login page
  };

  if (!isLoggedIn) {
    return <div>loading...</div>;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 h-full flex flex-col">
        <header className="flex-none h-52 relative overflow-hidden">
          <div className="px-6 h-full flex flex-col justify-center relative z-10">
            <span className="text-4xl text-gray-700">Halo {userName}</span>
            <span className="text-base text-gray-700">Bagaimana kabarmu hari ini :D</span>
          </div>
          <Image src={geometricPattern} alt="pattern" className="w-full h-full object-cover absolute bottom-0" />
        </header>
        <div className="flex-1 flex flex-col h-full p-6 justify-center gap-4">
          <Link href={'/tree/scan-qr'}>
            <div className="p-4 rounded-3xl flex flex-col gap-4 bg-[#D9E7CB] active:bg-[#bed5a5] active:ring-4 ring-[#e0ecd5]">
              <div className="w-[76px] h-[76px] rounded-2xl grid place-items-center bg-[#80AE51] ">
                <Image src={treeIcon} alt="tree icon" width={40} height={40} />
              </div>
              <span className="text-2xl text-[#263518] leading-tight">
                Riwayat Pemeliharaan
                <br />
                Pohon
              </span>
            </div>
          </Link>
          <Link href={'/digital-book'}>
            <div className="p-4 rounded-3xl flex flex-col gap-4 bg-violet-200 active:bg-violet-300 active:ring-4 ring-violet-200">
              <div className="w-[76px] h-[76px] rounded-2xl grid place-items-center bg-violet-400 ">
                <Image src={bookIcon} alt="tree icon" width={40} height={40} />
              </div>
              <span className="text-2xl text-[#17004D] leading-tight">
                Buku Usaha
                <br />
                Digital
              </span>
            </div>
          </Link>
          <Link href={'/digital-book-v2'}>
            <div className="p-4 rounded-3xl flex flex-col gap-4 bg-violet-200 active:bg-violet-300 active:ring-4 ring-violet-200">
              <div className="w-[76px] h-[76px] rounded-2xl grid place-items-center bg-violet-400 ">
                <Image src={bookIcon} alt="tree icon" width={40} height={40} />
              </div>
              <span className="text-2xl text-[#17004D] leading-tight">
                Buku Usaha
                <br />
                Digital v2
              </span>
            </div>
          </Link>
          <button
            className="bg-red-200 text-red-900 active:bg-red-300 active:ring-2 active:ring-red-100 px-2 py-1 rounded-xl font-medium"
            onClick={handleLogout}
          >
            Keluar
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}
