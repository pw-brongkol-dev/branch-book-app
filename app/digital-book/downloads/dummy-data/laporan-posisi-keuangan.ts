export const report = {
  name: 'LAPORAN POSISI KEUANGAN',
  date: 'Januari 2024',
  children: [
    {
      type: 'AKTIVA',
      children: [
        {
          type: 'Aktiva Lancar',
          children: [
            { accountName: 'Kas', amount: 24800000 },
            { accountName: 'Piutang', amount: 0 },
            { accountName: 'Perlengkapan', amount: 150000 },
            { accountName: 'Persediaan Aset Biologis', amount: 0 },
          ],
          total: { name: 'Total Aktiva Lancar', amount: 24950000 },
        },
        {
          type: 'Aktiva Tetap',
          children: [
            { accountName: 'Lahan Pertanian', amount: 50000000 },
            { accountName: 'Peralatan', amount: 0 },
            { accountName: 'Akumulasi Penyusutan Peralatan', amount: 0 },
          ],
          total: { name: 'Total Aktiva Tetap', amount: 50000000 },
        },
      ],
      total: { name: 'Total Aktiva', amount: 74950000 },
    },
    {
      type: 'KEWAJIBAN DAN EKUITAS',
      children: [
        {
          type: 'Kewajiban Lancar',
          children: [
						{ accountName: 'Utang Usaha', amount: 0 }
					],
          total: { name: 'Total Kewajiban Lancar', amount: 0 },
        },
        {
          type: 'Kewajiban Jangka Panjang',
          children: [
						{ accountName: 'Utang Jangka Panjang', amount: 0 }
					],
          total: { name: 'Total Kewajiban Jangka Panjang', amount: 0 },
        },
        {
          type: 'Ekuitas',
          children: [
						{ accountName: 'Modal', amount: 74950000 }
					],
          total: { name: 'Total Ekuitas', amount: 74950000 },
        },
      ],
      total: { name: 'Total Kewajiban dan Ekuitas', amount: 74950000 },
    },
  ],
};
