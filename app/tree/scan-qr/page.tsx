"use client";

import React, { useState } from "react";
import { QrReader } from "react-qr-reader";
import Image from "next/image";
import QRPictogram from "@/app/images/qr-pictogram.png";

const ScanQRPage = () => {
  const [data, setData] = useState("No result");

  return (
    <div className="flex flex-col items-center justify-center min-h-devh bg-gray-200">
      <div className="bg-white py-10 w-full h-full">
        <div className="relative aspect-square w-full mb-8">
          <div className="relative bg-gray-200">
            <QrReader
              onResult={(result, error) => {
                if (!!result) {
                  setData(result?.getText());
                }

                if (!!error) {
                  console.info(error);
                }
              }}
              constraints={{ facingMode: "environment" }}
              containerStyle={{ width: "100%", height: "100%" }}
              videoContainerStyle={{
                width: "100%",
                height: "100%",
                borderRadius: "1rem",
                overflow: "hidden",
              }}
            />
          </div>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-4/6 h-4/6 border-4 border-white rounded-3xl"></div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg font-semibold mb-2">Scan QR Code</p>
          <p className="text-sm text-gray-600 mb-4">pada Pohon</p>
          <div className="inline-block rounded-xl">
            <Image
              src={QRPictogram} // Replace with your actual QR code icon
              alt="QR Code Icon"
              width={64}
              height={64}
            />
          </div>
        </div>
        <div className="overflow-hidden">
          <p className="mt-4 text-center text-sm ">{data}</p>
        </div>
      </div>
    </div>
  );
};

export default ScanQRPage;
