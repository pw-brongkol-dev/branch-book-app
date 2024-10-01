export function generateReportData({ month, year, transactions = [], accounts = [] }) {
  const localMonth = new Date(0, month).toLocaleString('default', { month: 'long' });
  const date = `${localMonth.toUpperCase()} ${year}`;

  transactions.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());

  /**
   * JURNAL UMUM
   */

  const reportJurnalUmum = {
    code: 'UD XXX XXX',
    name: 'JURNAL UMUM',
    date: date,
    children: [],
  };

  transactions.map((transaction) => {
    // Find the account based on transaction.account_id
    const account = accounts.find((acc) => acc.id === transaction.account_id);

    // Convert Firebase Timestamp to Date
    const transactionDate = transaction.date.toDate();

    // Manually format the date to "10 September 2024"
    const day = transactionDate.getDate();
    const monthName = transactionDate.toLocaleString('default', { month: 'long' });
    const year = transactionDate.getFullYear();
    const formattedDate = `${day} ${monthName} ${year}`;

    reportJurnalUmum.children.push({
      Tanggal: formattedDate,
      Keterangan: transaction.description,
      KodeAkun: account ? account.code : '-', // Return account.code or "Unknown" if not found
      NamaAkun: account ? account.name : '-', // Return account.name or "Unknown" if not found
      REF: '',
      Debit: account.db_cr === 'Db' ? transaction.total_amount : 0,
      Kredit: account.db_cr === 'Cr' ? transaction.total_amount : 0,
      _transactionDate: transactionDate,
    });
  });

  /**
   * NERACA LAJUR
   */

  const reportNeracaLajur = {
    code: 'UD XXX XXX',
    name: 'NERACA LAJUR',
    date: date,
    children: [],
    sum: {
      neracaSaldoDebit: 0,
      neracaSaldoKredit: 0,
      labaRugiDebit: 0,
      labaRugiKredit: 0,
      neracaDebit: 0,
      neracaKredit: 0,
    },
    profitLoss: {
      labaRugi: 0,
      neraca: 0,
    },
    total: {
      labaRugiDebit: 0,
      labaRugiKredit: 0,
      neracaDebit: 0,
      neracaKredit: 0,
    },
  };

  // Group transactions by account_id
  const transactionsGroupedByAccount = accounts
    .map((account) => {
      const accountTransactions = transactions.filter((transaction) => transaction.account_id === account.id);
      const totalAmount = accountTransactions.reduce((sum, transaction) => sum + transaction.total_amount, 0);
      const neraca_saldo_debit = account.db_cr === 'Db' ? totalAmount : 0;
      const neraca_saldo_kredit = account.db_cr === 'Cr' ? totalAmount : 0;

      return {
        accountName: account.name,
        account_code: account.code,
        db_cr: account.db_cr,
        pos: account.pos,
        total_amount: totalAmount,
        neraca_saldo_debit,
        neraca_saldo_kredit,
        laba_rugi_debit: account.pos === 'LR' ? neraca_saldo_debit : 0,
        laba_rugi_kredit: account.pos === 'LR' ? neraca_saldo_kredit : 0,
        neraca_debit: account.pos === 'NRC' ? neraca_saldo_debit : 0,
        neraca_kredit: account.pos === 'NRC' ? neraca_saldo_kredit : 0,
      };
    })
    .sort((a, b) => a.account_code.localeCompare(b.account_code)); // Sort by account code

  // Add grouped transactions to reportNeracaLajur
  transactionsGroupedByAccount.forEach((group) => {
    reportNeracaLajur.children.push({
      NomorAkun: group.account_code,
      NamaAkun: group.accountName,
      PosSaldo: group.db_cr,
      NeracaSaldoDebit: group.neraca_saldo_debit,
      NeracaSaldoKredit: group.neraca_saldo_kredit,
      PosLaporan: group.pos,
      LabaRugiDebit: group.laba_rugi_debit,
      LabaRugiKredit: group.laba_rugi_kredit,
      NeracaDebit: group.neraca_debit,
      NeracaKredit: group.neraca_kredit,
    });
  });

  // Initialize sums
  reportNeracaLajur.sum.neracaSaldoDebit = 0;
  reportNeracaLajur.sum.neracaSaldoKredit = 0;
  reportNeracaLajur.sum.labaRugiDebit = 0;
  reportNeracaLajur.sum.labaRugiKredit = 0;
  reportNeracaLajur.sum.neracaDebit = 0;
  reportNeracaLajur.sum.neracaKredit = 0;

  // Calculate sums
  transactionsGroupedByAccount.forEach((group) => {
    reportNeracaLajur.sum.neracaSaldoDebit += group.neraca_saldo_debit;
    reportNeracaLajur.sum.neracaSaldoKredit += group.neraca_saldo_kredit;
    reportNeracaLajur.sum.labaRugiDebit += group.laba_rugi_debit;
    reportNeracaLajur.sum.labaRugiKredit += group.laba_rugi_kredit;
    reportNeracaLajur.sum.neracaDebit += group.neraca_debit;
    reportNeracaLajur.sum.neracaKredit += group.neraca_kredit;
  });

	// calculate profitLoss
  reportNeracaLajur.profitLoss.labaRugi = reportNeracaLajur.sum.labaRugiKredit - reportNeracaLajur.sum.labaRugiDebit;
  reportNeracaLajur.profitLoss.neraca = reportNeracaLajur.sum.neracaKredit - reportNeracaLajur.sum.neracaDebit;

	// calculate total
  reportNeracaLajur.total.labaRugiDebit = reportNeracaLajur.sum.labaRugiDebit + reportNeracaLajur.profitLoss.labaRugi;
  reportNeracaLajur.total.labaRugiKredit = reportNeracaLajur.sum.labaRugiKredit;
  reportNeracaLajur.total.neracaDebit = reportNeracaLajur.sum.neracaDebit;
  reportNeracaLajur.total.neracaKredit = reportNeracaLajur.sum.neracaKredit + reportNeracaLajur.profitLoss.neraca;


  /**
   * NERACA SALDO
   */

  const reportNeracaSaldo = {
    code: 'UD XXX XXX',
    name: 'NERACA SALDO',
    date: date,
    children: [],
		total: {
			kredit: 0,
			debit: 0
		}
  };

  reportNeracaLajur.children.map((account) => {
    reportNeracaSaldo.children.push({
      NomorAkun: account.NomorAkun,
      NamaAkun: account.NamaAkun,
      Debit: account.NeracaSaldoDebit,
      Kredit: account.NeracaSaldoKredit,
    });
  });

	// sum total
	reportNeracaSaldo.children.forEach((account) => {
		reportNeracaSaldo.total.debit += account.Debit;
		reportNeracaSaldo.total.kredit += account.Kredit;
	});

  /**
   * LABA RUGI
   */

  const reportLabaRugi = {
    code: 'UD XXX XXX',
    name: 'LABA RUGI',
    date: date,
    children: [
      {
        type: 'Pendapatan dari Penjualan',
        children: [
          { label: 'Penjualan Biji Kopi', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '4-1100').LabaRugiKredit },
          { label: 'Retur Penjualan', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '4-1200').LabaRugiKredit },
        ],
        total: {
          label: 'Total Pendapatan dari Penjualan (2-3)',
          amount: 0,
        },
      },
      {
        type: 'Beban-Beban Usaha',
        children: [
          { label: 'Beban Pupuk', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '6-1100').LabaRugiDebit },
          { label: 'Beban Benih', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '6-1200').LabaRugiDebit },
          { label: 'Beban obat hama', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '6-1300').LabaRugiDebit },
          { label: 'Beban Gaji dan Upah', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '6-1400').LabaRugiDebit },
          { label: 'Beban Transportasi', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '6-1500').LabaRugiDebit },
          { label: 'Beban Telp, listrik, dan air', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '6-1600').LabaRugiDebit },
        ],
        total: {
          label: 'Total Beban-Beban Usaha',
          amount: 0,
        },
      },
    ],
    total: {
      label: 'Laba Bersih',
      amount: 0,
    },
  };

  // Calculate totals for Pendapatan dari Penjualan
  reportLabaRugi.children[0].total.amount = reportLabaRugi.children[0].children.reduce((sum, child) => sum + child.amount, 0);
  // Calculate totals for Beban-Beban Usaha
  reportLabaRugi.children[1].total.amount = reportLabaRugi.children[1].children.reduce((sum, child) => sum + child.amount, 0);
  // Calculate overall total (Pendapatan - Beban)
  reportLabaRugi.total.amount = reportLabaRugi.children[0].total.amount - reportLabaRugi.children[1].total.amount;

	/**
   * LAPORAN POSISI KEUANGAN
   */


  const reportLaporanPosisiKeuangan = {
    code: 'UD XXX XXX',
    name: 'LAPORAN POSISI KEUANGAN',
    date: date,
    children: [
      {
        type: 'AKTIVA',
        children: [
          {
            type: 'Aktiva Lancar',
            children: [
              { accountName: 'Kas', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '1-1100').NeracaDebit },
              { accountName: 'Piutang', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '1-1200').NeracaDebit },
              { accountName: 'Perlengkapan', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '1-1300').NeracaDebit },
              { accountName: 'Persediaan Aset Biologis', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '1-1400').NeracaDebit },
            ],
            total: { name: 'Total Aktiva Lancar', amount: 0 },
          },
          {
            type: 'Aktiva Tetap',
            children: [
              { accountName: 'Lahan Pertanian', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '1-2100').NeracaDebit },
              { accountName: 'Peralatan', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '1-2200').NeracaDebit },
              {
                accountName: 'Akumulasi Penyusutan Peralatan',
                amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '1-2210').NeracaDebit,
              },
            ],
            total: { name: 'Total Aktiva Tetap', amount: 0 },
          },
        ],
        total: { name: 'Total Aktiva', amount: 0 },
      },
      {
        type: 'KEWAJIBAN DAN EKUITAS',
        children: [
          {
            type: 'Kewajiban Lancar',
            children: [{ accountName: 'Utang Usaha', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '2-1100').NeracaKredit }],
            total: { name: 'Total Kewajiban Lancar', amount: 0 },
          },
          {
            type: 'Kewajiban Jangka Panjang',
            children: [
              { accountName: 'Utang Jangka Panjang', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '2-2100').NeracaKredit },
            ],
            total: { name: 'Total Kewajiban Jangka Panjang', amount: 0 },
          },
          {
            type: 'Ekuitas',
            children: [
              { accountName: 'Modal', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '3-1100').NeracaKredit }, // tambah total laba rugi jurnal umum
            ],
            total: { name: 'Total Ekuitas', amount: 0 },
          },
        ],
        total: { name: 'Total Kewajiban dan Ekuitas', amount: 0 },
      },
    ],
  };

  // Calculate totals for Aktiva
  const totalAktivaLancar = reportLaporanPosisiKeuangan.children[0].children[0].children.reduce((sum, child) => sum + child.amount, 0);
  const totalAktivaTetap = reportLaporanPosisiKeuangan.children[0].children[1].children.reduce((sum, child) => sum + child.amount, 0);
  reportLaporanPosisiKeuangan.children[0].total.amount = totalAktivaLancar + totalAktivaTetap; // Total Aktiva

  // Calculate totals for Kewajiban dan Ekuitas
  const totalKewajibanLancar = reportLaporanPosisiKeuangan.children[1].children[0].children.reduce((sum, child) => sum + child.amount, 0);
  const totalKewajibanJangkaPanjang = reportLaporanPosisiKeuangan.children[1].children[1].children.reduce((sum, child) => sum + child.amount, 0);
  const totalEkuitas = reportLaporanPosisiKeuangan.children[1].children[2].children.reduce((sum, child) => sum + child.amount, 0);
  reportLaporanPosisiKeuangan.children[1].total.amount = totalKewajibanLancar + totalKewajibanJangkaPanjang + totalEkuitas; // Total Kewajiban dan Ekuitas

  /**
   * LAPORAN PERUBAHAN MODAL
   */

  const reportLaporanPerubahanModal = {
    code: 'UD XXX XXX',
    name: 'LAPORAN PERUBAHAN MODAL',
    date: 'Januari 2024',
    children: [
      {
        total: { name: 'Saldo Awal', amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '3-1100').NeracaKredit },
      },
      {
        children: [
          {
            type: 'Perubahan Modal',
            children: [
              {
                accountName: 'Laba (Rugi)',
                amount: reportLabaRugi.total.amount,
              },
              {
                accountName: 'Prive',
                amount: reportNeracaLajur.children.find((data) => data.NomorAkun === '3-1200').NeracaDebit,
              },
            ],
          },
        ],
        total: { name: 'Penambahan Modal (Laba - Prive)', amount: 0 },
      },
    ],
    total: { name: 'Modal Akhir (a+f)', amount: 0 },
  };

  // Calculate total for Penambahan Modal (Laba - Prive)
  reportLaporanPerubahanModal.children[1].total.amount = reportLaporanPerubahanModal.children[1].children[0].children.reduce(
    (sum, child) => sum + child.amount,
    0,
  );

  const saldoAwal = reportLaporanPerubahanModal.children[0].total.amount;
  const penambahanModal = reportLaporanPerubahanModal.children[1].total.amount;
  reportLaporanPerubahanModal.total.amount = saldoAwal + penambahanModal; // Total Modal Akhir

  return {
    reportJurnalUmum,
    reportNeracaLajur,
    reportNeracaSaldo,
    reportLabaRugi,
    reportLaporanPosisiKeuangan,
    reportLaporanPerubahanModal,
  };
}
