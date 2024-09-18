// "use client";

'use client';

import { useState, useEffect } from 'react';
import { useZxing } from 'react-zxing';

import Image from 'next/image';
import QRPictogram from '@/app/images/qr-pictogram.png';
import { useRouter } from 'next/navigation';
import BackButton from '@/app/components/BackButton';

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
    <div className="flex flex-col items-center justify-center h-dvh bg-gray-200">
      <BackButton />

      <div className="flex-1 bg-white w-full h-full">
        <div className="relative h-4/6 w-full mb-8">
          <div className="relative bg-gray-200 h-full w-full ">
            <video ref={ref} className="h-full w-full object-cover" />
          </div>
          <div className="absolute w-full h-full p-5 inset-0 grid place-items-center pointer-events-none">
            <div className="aspect-square w-full max-h-96 max-w-96 border-4 border-white rounded-3xl"></div>
          </div>
        </div>

        <div className="text-center flex flex-col items-center">
          <p className="text-lg font-semibold">Scan QR Code</p>
          <p className="text-sm text-gray-600 mb-4">pada Pohon</p>
          <div className="block rounded-xl">
            <Image src={QRPictogram} alt="QR Code Icon" width={64} height={64} />
          </div>
          <span className="text-sm text-gray-600 overflow-hidden mt-4">{result}</span>
        </div>
      </div>
    </div>
  );
};

export default ScanQRPage;
