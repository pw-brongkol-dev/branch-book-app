import React, { forwardRef } from 'react';

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
    <div ref={ref} className="p-6 mt-5 from-blue-50 to-white rounded-lg">
      <h1 className="text-4xl font-extrabold text-center mb-4 ">PW DRTPM 2024</h1>
      <h2 className="text-2xl font-semibold text-center mb-6 ">Universitas Negeri Semarang</h2>
      <div className="flex justify-center mt-6">
        {qrCodeData && (
          <img
            src={qrCodeData}
            alt="QR Code"
            className="w-[450px] h-[450px] border border-gray-300 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out my-4"
          />
        )}
      </div>
      {treeDetail && (
        <>
          <div className="flex justify-between mt-6">
            <h3 className="text-2xl font-medium">
              <span className="font-semibold">Nama petani:</span> {treeDetail.owner}
            </h3>
          </div>
          <div className="flex justify-between mt-2">
            <h3 className="text-2xl font-medium">
              <span className="font-semibold">Aksesi:</span> {treeDetail.type}
            </h3>
          </div>
        </>
      )}
    </div>
  );
});

export default QrCode;
