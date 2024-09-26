'use client';

import React, { useState, useEffect } from 'react';
import BackButton from '@/app/components/BackButton';
import { Button } from '@/components/ui/button';
import { useFirestore } from '@/app/hooks/useFirestore';
import { differenceInYears, differenceInMonths, differenceInDays } from 'date-fns';
import * as qrcode from 'qrcode';
import { FiDownload, FiEdit } from 'react-icons/fi';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

import { RelTreeFertilization, Fertilization } from '@/app/db/interfaces';

const TreeDetailsPage = ({ params }: { params: { tree_id: string } }) => {
  const tree_code = params.tree_id;
  const { getTreeByCode, getUserById, getRelTreeFertilizationsByTreeCode, getRelTreeFertilizationById, getFertilizationById, toggleFertilizationCompletion } = useFirestore();

  interface TreeDetail {
    owner: string;
    type: string;
    age: string;
    location: string;
  }

  type FertilizationHistory = RelTreeFertilization & Fertilization & {
    id: string,
    date: string,
    originalDate: Date
  }

  const [treeDetail, setTreeDetail] = useState<TreeDetail | undefined>();
  const [fertilizationHistory, setFertilizationHistory] = useState<FertilizationHistory[]>([])
  const [fetchStatus, setFetchStatus] = useState('idle');
  const [qrCodeData, setQrCodeData] = useState<string | null>(null);

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
      const tree = await getTreeByCode(tree_code);
      if (!tree) throw 'fetch error: tree not found';

      const user = await getUserById(tree.user_id);
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

      const treeFertilizations = await getRelTreeFertilizationsByTreeCode(tree_code);
      
      const fertilizations = await Promise.all(treeFertilizations.map(async (fertilization) => {
        const fertilizationDetail = await getFertilizationById(fertilization.fertilization_id);
        const convertedDate = fertilizationDetail?.date?.toDate();
        return {
          id: fertilization.id,
          title: fertilizationDetail?.title,
          description: fertilizationDetail?.description,
          date: convertedDate?.toLocaleDateString(), // Keep formatted date for output
          originalDate: convertedDate, // Store original Date object for sorting
          is_completed: fertilization.is_completed,
          tree_id: fertilization.tree_id,
          fertilization_id: fertilization.fertilization_id
        } as FertilizationHistory;
      }));

      const sortedFertilizations = fertilizations.sort((a, b) => {
        return (a.originalDate as Date).getTime() - (b.originalDate as Date).getTime(); // Sort by original Date object
      });
      setFertilizationHistory(sortedFertilizations);

      setTreeDetail(data);
      setFetchStatus('success');
    } catch (err) {
      setFetchStatus('error');
      console.error(err);
    }
  };


  const toggleCompleted = async (id: string) => {
    await toggleFertilizationCompletion(id)
    const updatedFertilization = await getRelTreeFertilizationById(id)
    if (updatedFertilization) {
      setFertilizationHistory(prevHistory => 
        prevHistory.map(item => 
          item.id === id 
            ? { ...item, is_completed: updatedFertilization.is_completed } // Update the specific item
            : item // Keep the rest unchanged
          )
        );
    }
  };


  useEffect(() => {
    fetchData();
  }, [tree_code]);

  useEffect(() => {
    console.log("hey")
    console.log(fertilizationHistory)
  }, [fertilizationHistory])

  if (fetchStatus === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen p-4 bg-gray-100" style={{ backgroundColor: '#f7fbf2' }}>
      <BackButton />
      <div className="bg-white max-w-md mx-auto mt-12 pt-4 pb-4 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold text-center">Pohon Durian</h2>
        <div className="p-4">
          <div className="mb-4">
            <p className="text-sm">
              Pemilik: <span className="font-semibold">{treeDetail?.owner}</span>
            </p>
            <p className="text-sm">
              Jenis/Aksesi: <span className="font-semibold">{treeDetail?.type}</span>
            </p>
            <p className="text-sm">
              Usia: <span className="font-semibold">{treeDetail?.age}</span>
            </p>
            <p className="text-sm">
              Lokasi: <span className="font-semibold">{treeDetail?.location}</span>
            </p>
            <Link href={`/tree/${tree_code}/edit-tree`}>
              <button className="text-green-600 flex items-center mt-2">
                <FiEdit className="mr-1" />
                Edit
              </button>
            </Link>
          </div>

          {/* Accordion for Riwayat */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="riwayat">
              <AccordionTrigger>Riwayat</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {fertilizationHistory.map((item) => (
                    <div key={item.id} className="flex items-start p-2 rounded-md">
                      <input type="checkbox" checked={item.is_completed} onChange={() => toggleCompleted(item.id)} className="h-6 w-6 flex-none" style={{ accentColor: '#38693C', width: '24px', height: '24px', marginRight: '10px' }} />
                      <div>
                        <p className="font-semibold text-[#38693C]">{item.title}</p>
                        <p className="text-xs text-gray-600">{item.date}</p>
                        <p className="text-sm">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Accordion for QR Code */}
          <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="qr-code">
              <AccordionTrigger>Buat QR Code</AccordionTrigger>
              <AccordionContent>
                <Button onClick={generateQRCode} className="mt-2">
                  Generate QR Code
                </Button>
                {qrCodeData && (
                  <div className="flex flex-col items-center mt-4">
                    <img src={qrCodeData} alt="QR Code" className="w-64 h-64" />
                    <Button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = qrCodeData as string;
                        link.download = `qrcode-${tree_code}.png`;
                        link.click();
                      }}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white mt-2"
                    >
                      <FiDownload />
                      Download QR Code
                    </Button>
                  </div>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
};

export default TreeDetailsPage;
