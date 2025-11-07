import { Timestamp } from 'firebase/firestore';

/**
 * Data untuk seed Accounts Group (Chart of Accounts untuk Kelompok)
 * Jalankan fungsi ini untuk populate accounts_group collection
 */
export const accountsGroupSeedData = [
  // ASET
  { code: '101', name: 'Kas', category: 'aset' as const, sub_category: 'aset lancar', is_active: true },
  { code: '102', name: 'Persediaan', category: 'aset' as const, sub_category: 'aset lancar', is_active: true },
  { code: '121', name: 'Lahan Pertanian', category: 'aset' as const, sub_category: 'aset tetap', is_active: true },
  { code: '122', name: 'Mesin', category: 'aset' as const, sub_category: 'aset tetap', is_active: true },
  { code: '123', name: 'Peralatan', category: 'aset' as const, sub_category: 'aset tetap', is_active: true },

  // KEWAJIBAN
  { code: '201', name: 'Utang Usaha', category: 'kewajiban' as const, sub_category: 'kewajiban lancar', is_active: true },
  { code: '202', name: 'Utang Bank', category: 'kewajiban' as const, sub_category: 'kewajiban jangka panjang', is_active: true },

  // MODAL
  { code: '301', name: 'Modal Pemilik', category: 'modal' as const, is_active: true },
  { code: '302', name: 'Modal Sumbangan', category: 'modal' as const, is_active: true },

  // PENDAPATAN
  { code: '401', name: 'Penjualan', category: 'pendapatan' as const, is_active: true },

  // BEBAN
  { code: '501', name: 'Beban Perlengkapan', category: 'beban' as const, is_active: true },
  { code: '502', name: 'Beban Obat Hama', category: 'beban' as const, is_active: true },
  { code: '503', name: 'Beban Pembelian Bahan Bakar', category: 'beban' as const, is_active: true },
  { code: '504', name: 'Beban Pembelian Bibit', category: 'beban' as const, is_active: true },
  { code: '505', name: 'Beban Gaji dan Upah', category: 'beban' as const, is_active: true },
  { code: '506', name: 'Beban Pupuk', category: 'beban' as const, is_active: true },
  { code: '507', name: 'Beban Listrik dan Air', category: 'beban' as const, is_active: true },
  { code: '508', name: 'Beban Pajak Tanah (PBB)', category: 'beban' as const, is_active: true },
  { code: '509', name: 'Beban Bunga Bank', category: 'beban' as const, is_active: true },
  { code: '510', name: 'Beban Lain-Lain', category: 'beban' as const, is_active: true },
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
