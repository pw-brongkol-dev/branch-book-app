import Link from 'next/link';
import { History, BookOpen, Sprout, Trees } from 'lucide-react';
import RippleButton from './components/RippleButton';

import { LucideIcon } from 'lucide-react';

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
  return (
    <main className="min-h-screen bg-background text-foreground p-6">
      <div className="flex flex-col h-full max-w-md mx-auto">
        <div className="flex items-center mb-20">
          <Sprout className="h-8 w-8 mr-3 text-green-600" />
          <h1 className="text-3xl font-bold">Halo Haryadi</h1>
        </div>
        <div className="flex flex-col gap-4">
          <Link href="/tree/tree-datatable" className="w-full">
            <RippleButton className="w-full bg-neutral-50 active:bg-green-50 active:border-green-500 text-card-foreground border-2 border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col items-center transition-colors">
              <PastelIcon Icon={Trees} bgColor="bg-green-100" iconColor="text-green-600" />
              <span className="text-lg font-medium">Data Pohon</span>
            </RippleButton>
          </Link>
          <Link href="/tree/scan-qr" className="w-full">
            <RippleButton className="w-full bg-neutral-50 active:bg-green-50 active:border-green-500 text-card-foreground border-2 border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col items-center transition-colors">
              <PastelIcon Icon={History} bgColor="bg-green-100" iconColor="text-green-600" />
              <span className="text-lg font-medium">Riwayat Pemeliharaan</span>
            </RippleButton>
          </Link>
          <Link href="/digital-book" className="w-full">
            <RippleButton className="w-full bg-neutral-50 active:bg-blue-50 active:border-blue-500 text-card-foreground border-2 border-slate-200 shadow-sm rounded-3xl p-6 flex flex-col items-center transition-colors">
              <PastelIcon Icon={BookOpen} bgColor="bg-blue-100" iconColor="text-blue-600" />
              <span className="text-lg font-medium">Pembukuan Digital</span>
            </RippleButton>
          </Link>
        </div>
      </div>
    </main>
  );
}
