'use client';

import React, { useState, useEffect } from 'react';
import BackButton from '@/app/components/BackButton';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/app/hooks/useFirestore';
import { differenceInYears, differenceInMonths, differenceInDays, set } from 'date-fns';
import * as qrcode from 'qrcode';
import { FiDownload, FiEdit, FiTrash } from 'react-icons/fi';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Change this import

import { RelTreeFertilization, Fertilization, Tree } from '@/app/db/interfaces';
import { useToast } from '@/hooks/use-toast';
import ReactToPrint from 'react-to-print';
import QrCode from '../tree-datatable/qrcode';
import Image from 'next/image';
import moreIcon from '@/app/icons/more_vert_20dp_black.svg';
import Footer from '@/app/components/Footer';

const TreeDetailsPage = ({ params }: { params: { tree_id: string } }) => {
  const tree_code = params.tree_id;
  const {
    getTreeByCode,
    getUserById,
    getRelTreeFertilizationsByTreeCode,
    getRelTreeFertilizationById,
    getFertilizationById,
    toggleFertilizationCompletion,
    deleteTree,
    deleteRelTreeFertilization,
  } = useFirestore();

  const { toast } = useToast();
  const router = useRouter(); // Initialize router

  interface TreeDetail {
    owner: string;
    type: string;
    age: string;
    location: string;
  }

  type FertilizationHistory = RelTreeFertilization &
    Fertilization & {
      id: string;
      date: string;
      originalDate: Date;
    };

  const [treeDetail, setTreeDetail] = useState<TreeDetail | undefined>();
  const [fertilizationHistory, setFertilizationHistory] = useState<FertilizationHistory[]>([]);
  const [fetchStatus, setFetchStatus] = useState('idle');
  const [treeFertilizations, setTreeFertilizations] = useState<RelTreeFertilization[]>([]);
  const [treeDataId, setTreeDataId] = useState('');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);
  const componentRef = React.useRef<React.ElementRef<typeof QrCode>>(null);

  const generateQRCode = async () => {
    try {
      const qrCode = await qrcode.toDataURL(tree_code, {
        width: 256,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      });
      setQrCodeData(qrCode);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchData = async () => {
    try {
      setFetchStatus('loading');
      console.log('Fetching tree with code:', tree_code);

      const tree = await getTreeByCode(tree_code);
      console.log('Fetched tree:', tree.id);
      setTreeDataId(tree.id);
      if (!tree) throw 'fetch error: tree not found';

      const user = await getUserById(tree.user_id);
      // console.log('Fetched user:', user);
      if (!user) throw 'fetch error: user not found';

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
      // console.log('Tree detail data:', data);

      // Fetch fertilizations related to the tree
      const treeFertilizationsData = await getRelTreeFertilizationsByTreeCode(tree_code);
      setTreeFertilizations(treeFertilizationsData); // Simpan data ke state
      console.log('Fetched tree fertilizations:', treeFertilizationsData);

      const fertilizations = await Promise.all(
        treeFertilizationsData.map(async (fertilization) => {
          // console.log('Processing fertilization:', fertilization);
          const fertilizationDetail = await getFertilizationById(fertilization.fertilization_id);
          // console.log('Fertilization detail:', fertilizationDetail);

          const convertedDate = fertilizationDetail?.date?.toDate();
          return {
            id: fertilization.id,
            title: fertilizationDetail?.title,
            description: fertilizationDetail?.description,
            date: convertedDate?.toLocaleDateString(),
            originalDate: convertedDate,
            is_completed: fertilization.is_completed,
            tree_id: fertilization.tree_id,
            fertilization_id: fertilization.fertilization_id,
          } as FertilizationHistory;
        }),
      );

      if (fertilizations.length === 0) {
        console.warn('No fertilizations found for tree:', tree_code);
      }

      const sortedFertilizations = fertilizations.sort((a, b) => {
        return (a.originalDate as Date).getTime() - (b.originalDate as Date).getTime(); // Sort by original Date object
      });
      console.log('Sorted fertilizations:', sortedFertilizations);

      setFertilizationHistory(sortedFertilizations);
      setTreeDetail(data);
      generateQRCode();
      setFetchStatus('success');
    } catch (err) {
      setFetchStatus('error');
      console.error('Error occurred:', err);
    }
  };

  const toggleCompleted = async (id: string) => {
    await toggleFertilizationCompletion(id);
    const updatedFertilization = await getRelTreeFertilizationById(id);
    if (updatedFertilization) {
      setFertilizationHistory((prevHistory) =>
        prevHistory.map((item) =>
          item.id === id
            ? { ...item, is_completed: updatedFertilization.is_completed } // Update the specific item
            : item,
        ),
      );
    }
  };

  const handleDelete = async () => {
    try {
      if (treeFertilizations.length > 0) {
        for (const fertilization of treeFertilizations) {
          await deleteRelTreeFertilization(fertilization.id);
          console.log(fertilization.id);
        }
      }

      console.log('tree id ini dihapus', treeDataId);
      await deleteTree(treeDataId);
      toast({ title: 'Pohon berhasil dihapus' });
      router.push('/tree/tree-datatable');
    } catch (error) {
      console.error('Error deleting tree or related fertilizations:', error);
      toast({ title: 'Pohon gagal dihapus', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchData();
  }, [tree_code]);

  useEffect(() => {
    console.log('hey');
    console.log(fertilizationHistory);
  }, [fertilizationHistory]);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  if (fetchStatus === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative">
      <BackButton color="green" />

      <div className="px-6 pt-4 pb-8 flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl text-gray-700">{treeDetail?.type}</h2>
            <div>
              <button onClick={toggleDropdown} className="  font-medium bg-[#D9E7CB] rounded-full h-8 w-8 grid place-items-center">
                <Image src={moreIcon} alt="more icon" />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded-xl shadow-2xl z-10 ">
                  <div className="flex flex-col gap-2 p-3">
                    <Link href={`/tree/${tree_code}/edit-tree`} passHref>
                      <button
                        onClick={closeDropdown}
                        className=" text-gray-700 flex items-center py-2 px-4 rounded-md active:bg-gray-100  w-full text-left"
                      >
                        <FiEdit className="mr-1" />
                        Edit
                      </button>
                    </Link>
                    {/* <button
                      onClick={() => {
                        handleDelete();
                        closeDropdown();
                      }}
                      className=" text-gray-700 flex items-center py-2 px-4 rounded-md active:bg-gray-100  w-full text-left"
                    >
                      <FiTrash className="mr-1" />
                      Delete
                    </button> */}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-2xl grid grid-cols-2 text-sm">
            <p className="">Pemilik</p>
            <span className="">{treeDetail?.owner}</span>
            <p className="">Jenis/Aksesi</p>
            <span className="">{treeDetail?.type}</span>
            <p className="">Usia</p>
            <span className="">{treeDetail?.age}</span>
            <p className="">Lokasi</p>
            <span className="">{treeDetail?.location}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xl text-gray-700 font-medium">Riwayat Pemupukan</h3>
          <div className="space-y-2">
            {fertilizationHistory.map((item) => (
              <button
                key={item.id}
                className="text-left flex gap-3 items-start p-2 rounded-2xl active:bg-[#F2F7EE]"
                onClick={() => toggleCompleted(item.id)}
              >
                <input
                  type="checkbox"
                  checked={item.is_completed}
                  // onChange={() => toggleCompleted(item.id)}
                  className="h-5 w-5 flex-none mt-2 cursor-pointer"
                  style={{ accentColor: '#668B41' }}
                />
                <div className="flex flex-col gap-0.5">
                  <p className="font-semibold text-[#668B41]">{item.title}</p>
                  <p className="text-xs text-gray-600">{item.date}</p>
                  <p className="text-xs text-gray-700">{item.description}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-xl text-gray-700 font-medium">QR Code</h3>
          <div className="">
            {qrCodeData && (
              <>
                <div className="flex flex-col items-center bg-gray-200 rounded-2xl py-4">
                  <img src={qrCodeData} alt="QR Code" className="w-48 h-48 rounded-xl" />
                </div>
                <div className="flex justify-center mt-2">
                  {' '}
                  {/* Centering the button */}
                  <ReactToPrint
                    trigger={() => (
                      <button className="flex justify-center items-center gap-2 py-1.5 w-full bg-[#668B41] active:bg-[#547434] text-white font-bold rounded-xl disabled:bg-gray-300">
                        <FiDownload />
                        Download QR Code
                      </button>
                    )}
                    content={() => componentRef.current} // Komponen yang akan dicetak
                  />
                </div>
                {/* Komponen QR Code yang tidak terlihat, akan digunakan oleh ReactToPrint */}
                <div style={{ display: 'none' }}>
                  <QrCode ref={componentRef} qrCodeData={qrCodeData} treeDetail={treeDetail} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );

  // return (
  //   <div className="min-h-dvh w-full">
  //     <div className="flex flex-col w-full max-w-md mx-auto p-4">
  //       <BackButton />
  //       <div className="bg-white pt-8">
  //         <h2 className="text-lg font-semibold text-center">Pohon Durian</h2>
  //         <div className="p-4">
  //           <div className="flex justify-between items-center mb-4">
  //             <div>
  //               <p className="text-sm">
  //                 Pemilik: <span className="font-semibold">{treeDetail?.owner}</span>
  //               </p>
  //               <p className="text-sm">
  //                 Jenis/Aksesi: <span className="font-semibold">{treeDetail?.type}</span>
  //               </p>
  //               <p className="text-sm">
  //                 Usia: <span className="font-semibold">{treeDetail?.age}</span>
  //               </p>
  //               <p className="text-sm">
  //                 Lokasi: <span className="font-semibold">{treeDetail?.location}</span>
  //               </p>
  //             </div>
  //             <div className="relative">
  //               <button onClick={toggleDropdown} className="bg-gray-600 text-white rounded-md p-2">
  //                 More
  //               </button>
  //               {isDropdownOpen && (
  //                 <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-10 ">
  //                   <div className="flex flex-col gap-2 p-3">
  //                     <Link href={`/tree/${tree_code}/edit-tree`} passHref>
  //                       <button
  //                         onClick={closeDropdown}
  //                         className="bg-green-600 text-white flex items-center py-2 px-4 rounded-md hover:bg-green-700 w-full text-left"
  //                       >
  //                         <FiEdit className="mr-1" />
  //                         Edit
  //                       </button>
  //                     </Link>
  //                     <button
  //                       onClick={() => {
  //                         handleDelete();
  //                         closeDropdown();
  //                       }}
  //                       className="bg-red-600 text-white flex items-center py-2 px-4 rounded-md hover:bg-red-700 w-full text-left"
  //                     >
  //                       <FiTrash className="mr-1" />
  //                       Delete
  //                     </button>
  //                   </div>
  //                 </div>
  //               )}
  //             </div>
  //           </div>

  //           {/* Accordion for Riwayat */}
  //           <Accordion type="single" collapsible defaultValue="riwayat" className="w-full">
  //             <AccordionItem value="riwayat">
  //               <AccordionTrigger>Riwayat</AccordionTrigger>
  //               <AccordionContent>
  //                 <div className="space-y-2">
  //                   {fertilizationHistory.map((item) => (
  //                     <div key={item.id} className="flex items-start p-2 rounded-md">
  //                       <input
  //                         type="checkbox"
  //                         checked={item.is_completed}
  //                         onChange={() => toggleCompleted(item.id)}
  //                         className="h-6 w-6 flex-none"
  //                         style={{ accentColor: '#38693C', width: '24px', height: '24px', marginRight: '10px' }}
  //                       />
  //                       <div>
  //                         <p className="font-semibold text-[#38693C]">{item.title}</p>
  //                         <p className="text-xs text-gray-600">{item.date}</p>
  //                         <p className="text-sm">{item.description}</p>
  //                       </div>
  //                     </div>
  //                   ))}
  //                 </div>
  //               </AccordionContent>
  //             </AccordionItem>
  //           </Accordion>

  //           {/* Accordion for QR Code */}
  //           <Accordion type="single" collapsible className="w-full mt-4">
  //             <AccordionItem value="qr-code">
  //               <AccordionTrigger>Buat QR Code</AccordionTrigger>
  //               <AccordionContent>
  //                 <Button onClick={generateQRCode} className="mt-2">
  //                   Generate QR Code
  //                 </Button>
  //                 {qrCodeData && (
  //                   <>
  //                     <div className="flex flex-col items-center mt-4">
  //                       <img src={qrCodeData} alt="QR Code" className="w-64 h-64" />
  //                     </div>
  //                     <div className="flex justify-center mt-2">
  //                       {' '}
  //                       {/* Centering the button */}
  //                       <ReactToPrint
  //                         trigger={() => (
  //                           <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
  //                             <FiDownload />
  //                             Download QR Code
  //                           </Button>
  //                         )}
  //                         content={() => componentRef.current} // Komponen yang akan dicetak
  //                       />
  //                     </div>
  //                     {/* Komponen QR Code yang tidak terlihat, akan digunakan oleh ReactToPrint */}
  //                     <div style={{ display: 'none' }}>
  //                       <QrCode ref={componentRef} qrCodeData={qrCodeData} treeDetail={treeDetail} />
  //                     </div>
  //                   </>
  //                 )}
  //               </AccordionContent>
  //             </AccordionItem>
  //           </Accordion>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );
};

export default TreeDetailsPage;
