'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiEdit, FiArrowLeft, FiMoreVertical } from 'react-icons/fi';
// import { useFirestore } from '@/app/hooks/useFirestore';

const TreeDetailsPage = () => {

  const router = useRouter();
  // const { tree_id } = router.query;
	// const { getTreeById } = useFirestore();

	// const fetchTreeById = async () => {
  //   try {
  //     const trees = await getTreeById();
  //     console.log(trees);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const [history, setHistory] = useState([
    { id: 1, while: 'Setelah Panen', description: 'pemupukan atas menggunakan NPK, top woking', completed: true },
    { id: 2, while: 'Setelah Mata Ketam Keluar', description: 'penyiraman, pemangkasan dahan, kondisi pohon sehat', completed: true },
    { id: 3, while: 'Setelah 30-40 Hari', description: 'penyiraman, pemangkasan dahan, top woking', completed: true },
  ]);

  const toggleCompleted = (id: number) => {
    setHistory(history.map(item => item.id === id ? { ...item, completed: !item.completed } : item));
  };

  return (
    <div className="min-h-screen p-4">
      <div className="bg-white">
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => router.back()} className="text-gray-600">
            <FiArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-semibold">Detail Pohon</h1>
          <button className="text-gray-600">
            <FiMoreVertical className="h-6 w-6" />
          </button>
        </div>
        <div className="bg-gray-50 p-4 rounded-2xl mb-6">
          <div className="flex justify-between items-center mb-2">
            <div>
              <p className="text-sm text-gray-600">Pemilik</p>
              <p className="text-md font-semibold">Pak Har</p>
            </div>
            <button className="text-green-600 flex items-center">
              <FiEdit className="mr-1" />
              Edit
            </button>
          </div>
          <div className="mb-2">
            <p className="text-sm text-gray-600">Jenis/Aksesi</p>
            <p className="text-md font-semibold">Vera</p>
          </div>
          <div className="mb-2">
            <p className="text-sm text-gray-600">Usia</p>
            <p className="text-md font-semibold">6 tahun 2 bulan</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Lokasi</p>
            <p className="text-md font-semibold">Sebelah utara rumah Pak Har (0,0234194, 4,340382)</p>
          </div>
        </div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-md font-bold px-4">Riwayat Pemupukan</h2>
        </div>
        <div className="space-y-4 px-4">
          {history.map(item => (
            <div key={item.id} className="flex items-start">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => toggleCompleted(item.id)}
                className="h-6 w-6 text-green-600 mr-4"
              />
              <div>
                <p className={`font-semibold ${item.completed ? 'text-green-600' : 'text-gray-600'}`}>{item.while}</p>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TreeDetailsPage;
