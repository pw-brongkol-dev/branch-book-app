export const report = {
  name: 'LAPORAN PERUBAHAN MODAL',
  date: 'Januari 2024',
  children: [
    {
      total: { name: 'Saldo Awal', amount: 69000000 },
    },
    {
      children: [
        {
          type: 'Perubahan Modal',
          children: [
            {
              accountName: 'Laba (Rugi)',
              amount: 5950000,
            },
            {
              accountName: 'Prive',
              amount: 0,
            },
          ],
        },
      ],
      total: { name: 'Penambahan Modal (Laba - Prive)', amount: 5950000 },
    },
  ],
  total: { name: 'Modal Akhir (a+f)', amount: 74950000 },
};
