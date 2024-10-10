import React, { forwardRef } from 'react';
import LogoRow from './LogoRow';

interface QrCodeProps {
  qrCodeData: string | null;
  treeDetail:
    | {
        owner: string;
        type: string;
        age: string;
        location: string;
      }
    | undefined;
}

const QrCode = forwardRef<HTMLDivElement, QrCodeProps>(({ qrCodeData, treeDetail }, ref) => {
  return (
    <>
      <div ref={ref} className="pt-6">
        <LogoRow />
        <h1 className="text-4xl font-bold text-center mt-7 mb-2">PW DRTPM 2024</h1>
        <h2 className="text-3xl font-semibold text-center mb-4">Universitas Negeri Semarang</h2>

        <div className="flex justify-center mt-4">
          {qrCodeData && (
            <img
              src={qrCodeData}
              alt="QR Code"
              className="w-[620px] h-[620px] my-5 border border-gray-300 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          )}
        </div>

        {treeDetail && (
          <div className="mt-3">
            {/* Nama petani dan Aksesi dengan border */}
            <div className="rounded-lg p-4 text-center">
              <h3 className="text-3xl font-medium">
                <span className="font-semibold">Nama Petani:</span> {treeDetail.owner}
              </h3>
              <h3 className="text-3xl font-medium mt-3">
                <span className="font-semibold">Aksesi/Jenis:</span> {treeDetail.type}
              </h3>
            </div>
          </div>
        )}
      </div>
    </>
  );
});

export default QrCode;
