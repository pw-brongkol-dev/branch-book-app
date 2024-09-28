export const report = {
  name: 'LAPORAN LABA RUGI',
  date: "Januari 2024",
  children: [
    {
      type: 'Pendapatan dari Penjualan',
      children: [
        { label: 'Penjualan Biji Kopi', amount: 11500000 },
        { label: 'Retur Penjualan', amount: 0 },
      ],
      total: {
        label: 'Total Pendapatan dari Penjualan (2-3)',
        amount: 11500000,
      },
    },
    {
      type: 'Beban-Beban Usaha',
      children: [
        { label: 'Beban Pupuk', amount: 200000 },
        { label: 'Beban Benih', amount: 4000000 },
        { label: 'Beban obat hama', amount: 100000 },
        { label: 'Beban Gaji dan Upah', amount: 1000000 },
        { label: 'Beban Transportasi', amount: 100000 },
        { label: 'Beban Telp, listrik, dan air', amount: 150000 },
      ],
      total: {
        name: 'Total Beban-Beban Usaha',
        amount: 5550000,
      },
    },
  ],
  total: {
    name: 'Laba Bersih',
    amount: 5950000,
  },
};
