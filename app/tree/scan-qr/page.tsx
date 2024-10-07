// "use client";

'use client';

import { useState, useEffect } from 'react';
import { useZxing } from 'react-zxing';

import Image from 'next/image';
import QRPictogram from '@/app/images/qr-pictogram.svg';
import { useRouter } from 'next/navigation';
import BackButton from '@/app/components/BackButton';
import geometricPattern from '@/app/images/geometric-pattern-scan-qr.svg';
import Link from 'next/link';

const ScanQRPage = () => {
  const router = useRouter();

  const [result, setResult] = useState('');
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
    },
  });

  useEffect(() => {
    if (result.trim() !== '') {
      console.log(result);
      // alert(result);
      router.push(`/tree/${result}`);
    }
  }, [result, router]);

  return (
    <div className="flex flex-col h-full relative">
      <div className='flex items-center justify-between'>
      <BackButton color="green" />
      <Link
        href={'/tree/tree-datatable'}
        className={`flex items-center h-12 p-4 rounded-3xl sticky top-2 w-fit my-2 mr-2 z-50 bg-[#F2F7EE] active:bg-[#d9ebca] active:ring-2 active:ring-[#F2F7EE]`}
      >
        <p className="text-base font-medium">Data Pohon</p>
      </Link>
      </div>
      <div className="flex-none relative h-3/5 w-full mb-8 rounded-3xl overflow-hidden">
        <div className="relative bg-gray-200 h-full w-full ">
          <video ref={ref} className="h-full w-full object-cover" />
        </div>
        <div className="absolute w-full h-full p-5 inset-0 grid place-items-center pointer-events-none">
          <div className="aspect-square w-full max-h-96 max-w-96 border-4 border-white rounded-3xl"></div>
        </div>
      </div>
      <div className="relative flex-1 overflow-hidden grid place-items-center">
        <div className="relative  flex flex-col justify-center items-center gap-4 z-20">
          <p className="text-lg leading-6 font-medium text-center text-gray-700">
            Scan QR Code
            <br />
            pada Pohon
          </p>
          <div className="rounded-3xl p-2 bg-[#99BE74] border-8 border-[#CCDFB9]">
            <Image src={QRPictogram} alt="QR Code Icon" width={64} height={64} />
          </div>
          <span className="text-sm text-gray-600 overflow-hidden mt-4">{result}</span>
        </div>
        <Image src={geometricPattern} alt="geometric pattern" className="absolute w-full top-0" />
      </div>
    </div>
  );
};

export default ScanQRPage;
