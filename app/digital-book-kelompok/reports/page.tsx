'use client';

import { useRouter } from 'next/navigation';
import { useFirestore } from '@/app/hooks/useFirestore';
import { useRef, useState, useEffect } from 'react';
import ReactToPrint from 'react-to-print';
import BackButton from '../../components/BackButton';
import LaporanLabaRugi from './tables/LaporanLabaRugi';
import LaporanPosisiKeuangan from './tables/LaporanPosisiKeuangan';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import docIcon from '@/app/icons/description_40dp_1C1B1F.svg';
import { generateReportDataGroup } from './generateReportDataGroup';

export default function ProcessDataReportKelompok() {
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [inputYear, setInputYear] = useState(new Date().getFullYear());
  const [data, setData] = useState<any>(null)
  const [data2, setData2] = useState<any>(null)
  const [kelompokName, setKelompokName] = useState('KELOMPOK TANI')
  const {
    getUserById,
    getTransactionsGroupByUserId,
    getTransactionsGroupRangeByUserId,
    getAllAccountsGroup
  } = useFirestore()
  const [fetchStatus, setFetchStatus] = useState('idle')

  useEffect(() => {
    handleProcess()
  }, [router, selectedMonth, inputYear]);

  async function handleProcess() {
    const userId = localStorage.getItem('user_id_branch_book_app');
    if (!userId) {
      router.push('/auth/login');
      return;
    }

    try {
      setFetchStatus("loading")

      // Get current user
      const user = await getUserById(userId);
      const kelompokId = user?.id;

      if (!user || !kelompokId) {
        alert('Data kelompok tidak valid.');
        router.push('/');
        return;
      }

      setKelompokName(user.name.toUpperCase());

      // Fetch transactions and accounts
      const transactions = await getTransactionsGroupByUserId(kelompokId, selectedMonth, inputYear);
      const transactionsToNow = await getTransactionsGroupRangeByUserId(kelompokId, selectedMonth, inputYear)
      const accounts = await getAllAccountsGroup();

      const reportData = generateReportDataGroup({
        month: selectedMonth,
        year: inputYear,
        transactions: transactions,
        accounts: accounts,
        institution: user.name.toUpperCase()
      });

      const reportData2 = generateReportDataGroup({
        month: selectedMonth,
        year: inputYear,
        transactions: transactionsToNow,
        accounts: accounts,
        institution: user.name.toUpperCase()
      })

      setData(reportData);
      setData2(reportData2)
      
      console.log('Report Data:', reportData);
      setFetchStatus("success")

    } catch (err) {
      console.error('Error generating report:', err);
      setFetchStatus("error")
    }
  }

  return (
    <div className="relative">
      <BackButton color="blue" />
      <div className="flex flex-col px-6 pt-4 gap-6">
        <h2 className="text-3xl text-gray-700">Laporan Keuangan Kelompok</h2>
        <div className="flex gap-4">
          <div className="flex-1 flex flex-col gap-1">
            <label className="font-medium text-sm">Bulan</label>
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Bulan" />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, index) => (
                  <SelectItem key={index} value={(index + 1).toString()}>
                    {new Date(0, index).toLocaleString('default', { month: 'long' })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 flex flex-col gap-1">
            <label className="font-medium text-sm">Tahun</label>
            <Input type="number" value={inputYear} onChange={(e) => setInputYear(Number(e.target.value))} min="2000" />
          </div>
        </div>

        { fetchStatus === "idle" ? (
          <p>Silakan pilih bulan dan tahun...</p>
        ) : fetchStatus === "loading" ? (
          <p>Memuat laporan...</p>
        ) : fetchStatus === "success" && data && data2 ? (
        <>
        <div className="border-t border-gray-300">
          <div className="flex flex-col py-4">
            <LaporanLabaRugi dataLaporanLabaRugi={data.dataLaporanLabaRugi} />
          </div>
        </div>
        <div className="border-t border-gray-300">
          <div className="flex flex-col py-4">
            <LaporanPosisiKeuangan dataLaporanPosisiKeuangan={data2.dataLaporanPosisiKeuangan} />
          </div>
        </div>
        </>
        ) : (
          <p>Terjadi Kesalahan saat memuat laporan</p>
        )}

        <div className='h-20'></div>
      </div>
    </div>
  );
}
