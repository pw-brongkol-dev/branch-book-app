import { Timestamp } from 'firebase/firestore';

/**
 * Data untuk seed Accounts Group (Chart of Accounts untuk Kelompok)
 * Jalankan fungsi ini untuk populate accounts_group collection
 */
export const accountsGroupSeedData = [
  // ASET LANCAR
  { code: '101', name: 'Kas' },
  { code: '102', name: 'Piutang Usaha' },
  { code: '103', name: 'Persediaan' },
  
  // ASET TETAP
  { code: '111', name: 'Bangunan' },
  { code: '112', name: 'Mesin' },
  { code: '113', name: 'Peralatan' },
  
  // KEWAJIBAN
  { code: '201', name: 'Utang Usaha' },
  { code: '210', name: 'Utang Bank' },
  
  // MODAL
  { code: '301', name: 'Modal Pemilik' },
  { code: '302', name: 'Modal Sumbangan' },
  
  // PENDAPATAN
  { code: '401', name: 'Penjualan' },
  
  // BEBAN/BIAYA
  { code: '501', name: 'Biaya Bahan Baku' },
  { code: '502', name: 'Biaya Listrik dan Air' },
  { code: '503', name: 'Biaya Transportasi' },
  { code: '504', name: 'Gaji Karyawan' },
];

/**
 * Fungsi helper untuk create user kelompok
 * Kelompok diperlakukan sebagai user dengan flag is_group: true
 */
export const createKelompokUser = (name: string) => ({
  name,
  group_id: '', // Kosong untuk kelompok
  is_group: true,
});

/**
 * Contoh data kelompok untuk testing
 */
export const sampleKelompokData = [
  { name: 'Kelompok Tani Makmur' },
  { name: 'Kelompok Tani Sejahtera' },
  { name: 'Kelompok Tani Maju Bersama' },
];

/**
 * Contoh data produk untuk testing
 * Note: user_id harus diisi dengan ID kelompok setelah kelompok dibuat
 */
export const sampleProductsData = (kelompokId: string) => [
  { user_id: kelompokId, name: 'Durian Montong' },
  { user_id: kelompokId, name: 'Durian Musang King' },
  { user_id: kelompokId, name: 'Durian Petruk' },
  { user_id: kelompokId, name: 'Pupuk Organik' },
  { user_id: kelompokId, name: 'Pestisida Nabati' },
];
