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
    <div ref={ref} className="p-6">
      <h1 className="text-3xl font-bold text-center mb-4">PW DRTPM 2024</h1>
      <h2 className="text-xl font-semibold text-center mb-4">Universitas Negeri Semarang</h2>
      {treeDetail && (
        <>
          <h3 className="text-lg font-medium mt-4">
            Nama petani: <span className="font-semibold">{treeDetail.owner}</span>
          </h3>
          <h3 className="text-lg font-medium">
            Aksesi: <span className="font-semibold">{treeDetail.type}</span>
          </h3>
        </>
      )}
      <div className="flex justify-center mt-6">
        {qrCodeData && <img src={qrCodeData} alt="QR Code" className="w-96 h-96 border border-gray-300 rounded shadow-lg" />}
      </div>
    </div>
  );
});

export default QrCode;
