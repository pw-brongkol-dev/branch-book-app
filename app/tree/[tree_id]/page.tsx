'use client';

import React, { useState, useEffect } from 'react';
// import { useRouter } from "next/navigation";
// import { FiEdit, FiArrowLeft, FiMoreVertical } from "react-icons/fi";
import BackButton from '@/app/components/BackButton';

import { useFirestore } from '@/app/hooks/useFirestore';
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';

const TreeDetailsPage = ({ params }: { params: { tree_id: string } }) => {
  const tree_code = params.tree_id;
  // console.log(params.tree_id);
  // const router = useRouter();

  // const { tree_id } = router.query;
  const { getTreeByCode, getUserById } = useFirestore();
  interface TreeDetail {
    owner: string;
    type: string;
    age: string;
    location: string;
  }
  const [treeDetail, setTreeDetail] = useState<TreeDetail | undefined>();
  const [fetchStatus, setFetchStatus] = useState('idle');

  const fetchData = async () => {
    try {
      setFetchStatus('loading');

      const tree = await getTreeByCode(tree_code);
      if (!tree) {
        throw 'fetch error: tree not found';
      }
      console.log(tree);

      const user = await getUserById(tree.user_id);
      // console.log(user);
      if (!user) {
        throw 'fetch error: user not found';
      }

      // console.log(user);

      const plantingDate = tree.planting_date.toDate();
      const now = new Date();

      const years = differenceInYears(now, plantingDate);
      const months = differenceInMonths(now, plantingDate) % 12;
      const days = differenceInDays(now, plantingDate) % 30;

      const ageString = `${years} tahun ${months} bulan ${days} hari`;

      const data = {
        owner: user.name,
        type: `${tree.type} ${tree.accession}`,
        age: ageString,
        location: tree.location,
      };

      setTreeDetail(data);
      // console.log(data);
      setFetchStatus('success');
    } catch (err) {
      setFetchStatus('error');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [tree_code]);

  const [history, setHistory] = useState([
    {
      id: 1,
      while: 'Setelah Panen',
      description: 'pemupukan atas menggunakan NPK, top woking',
      completed: true,
    },
    {
      id: 2,
      while: 'Setelah Mata Ketam Keluar',
      description: 'penyiraman, pemangkasan dahan, kondisi pohon sehat',
      completed: true,
    },
    {
      id: 3,
      while: 'Setelah 30-40 Hari',
      description: 'penyiraman, pemangkasan dahan, top woking',
      completed: true,
    },
  ]);

  if (fetchStatus === 'loading') {
    return <div>Loading...</div>;
  }

  const toggleCompleted = (id: number) => {
    setHistory(history.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  return (
    <div className="min-h-screen p-4">
      <BackButton />
      <div className="bg-white max-w-md mx-auto pt-16">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold pl-2">Detail Pohon</h2>

          <div className="bg-gray-100 p-4 rounded-2xl">
            <div className="flex justify-between items-center mb-2">
              <div>
                <p className="text-xs text-gray-600">Pemilik</p>
                <p className="text-sm font-semibold">{treeDetail?.owner}</p>
              </div>
              {/* <button className="text-green-600 flex items-center">
                  <FiEdit className="mr-1" />
                  Edit
                </button> */}
            </div>
            <div className="mb-2">
              <p className="text-xs text-gray-600">Jenis/Aksesi</p>
              <p className="text-sm font-semibold">{treeDetail?.type}</p>
            </div>
            <div className="mb-2">
              <p className="text-xs text-gray-600">Usia</p>
              <p className="text-sm font-semibold">{treeDetail?.age}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Lokasi</p>
              <p className="text-sm font-semibold">{treeDetail?.location}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <h2 className="text-lg font-semibold pl-2">Riwayat Pemupukan</h2>
        </div>
        {/* <div className="space-y-4 px-4">
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
        </div> */}
      </div>
    </div>
  );
};

export default TreeDetailsPage;
