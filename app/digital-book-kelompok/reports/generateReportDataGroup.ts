export function generateReportDataGroup({ month, year, transactions = [], accounts = [], institution = "KELOMPOK TANI" }) {
  const localMonth = new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  const date = `${localMonth.toUpperCase()} ${year}`;

  transactions.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());

  const pemasukan = [];
  const pengeluaran = [];

  transactions.forEach((transaction) => {
    const account = accounts.find((acc) => acc.id === transaction.account_id);

    const data = {
      id: transaction.id,
      date: transaction.date.toDate().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      description: transaction.description,
      account_name: account ? account.name : '',
      account_code: account ? account.code : '',
      ref: transaction.ref,
      total: transaction.total_amount,
    };

    if (transaction.type === 'pemasukan') {
      pemasukan.push(data);
    } else if (transaction.type === 'pengeluaran') {
      pengeluaran.push(data);
    }
  });

  const totalPemasukan = pemasukan.reduce((sum, item) => sum + item.total, 0);
  const totalPengeluaran = pengeluaran.reduce((sum, item) => sum + item.total, 0);

  function getMergedAcc(account = '') {
    return (
      pemasukan
        .filter((item) => item.account_name === account)
        .reduce((sum, item) => sum + item.total, 0) -
      pengeluaran
        .filter((item) => item.account_name === account)
        .reduce((sum, item) => sum + item.total, 0)
    );
  }

  const dataLaporanLabaRugi = {
    institution: institution,
    document_name: 'LAPORAN LABA RUGI',
    date: date,
    data: {
      items: [
        {
          name: 'Pendapatan dari Penjualan',
          items: [
            {
              name: 'Penjualan',
              amount: pemasukan
                .filter((item) => item.account_name === 'Penjualan')
                .reduce((sum, item) => sum + item.total, 0),
            },
          ],
          total: {
            name: 'Total Pendapatan dari Penjualan',
            amount: 0,
          },
        },
        {
          name: 'Harga Pokok Pembelian',
          items: [
            {
              name: 'Harga Pokok Pembelian',
              amount: getMergedAcc('Biaya Bahan Baku'),
            },
          ],
          total: {
            name: 'Laba Kotor',
            amount: 0,
          },
        },
        {
          name: 'Beban-Beban',
          items: [
            {
              name: 'Biaya Listrik dan Air',
              amount: getMergedAcc('Biaya Listrik dan Air'),
            },
            {
              name: 'Biaya Transportasi',
              amount: getMergedAcc('Biaya Transportasi'),
            },
            {
              name: 'Gaji Karyawan',
              amount: getMergedAcc('Gaji Karyawan'),
            },
          ],
          total: {
            name: 'Total Beban-Beban',
            amount: 0,
          },
        },
      ],
      total: {
        name: 'Laba Bersih',
        amount: 0,
      },
    },
  };

  // Calculate totals
  dataLaporanLabaRugi.data.items[0].total.amount = dataLaporanLabaRugi.data.items[0].items.reduce((sum, item) => sum + item.amount, 0);
  dataLaporanLabaRugi.data.items[1].total.amount = dataLaporanLabaRugi.data.items[0].total.amount - dataLaporanLabaRugi.data.items[1].items.reduce((sum, item) => sum + item.amount, 0);
  dataLaporanLabaRugi.data.items[2].total.amount = dataLaporanLabaRugi.data.items[2].items.reduce((sum, item) => sum + item.amount, 0);
  dataLaporanLabaRugi.data.total.amount = dataLaporanLabaRugi.data.items[1].total.amount - dataLaporanLabaRugi.data.items[2].total.amount;

  const dataLaporanPosisiKeuangan = {
    institution: institution,
    document_name: 'LAPORAN POSISI KEUANGAN',
    date: date,
    data: {
      items: [
        {
          name: 'ASET',
          items: [
            {
              name: 'ASET LANCAR',
              items: [
                {
                  name: 'Kas',
                  amount: totalPemasukan - totalPengeluaran,
                },
                {
                  name: 'Piutang Usaha',
                  amount: getMergedAcc('Piutang Usaha'),
                },
                {
                  name: 'Persediaan',
                  amount: getMergedAcc('Persediaan'),
                },
              ],
              total: {
                name: 'Total Aktiva Lancar',
                amount: 0,
              },
            },
            {
              name: 'ASET TETAP',
              items: [
                {
                  name: 'Bangunan',
                  amount: getMergedAcc('Bangunan'),
                },
                {
                  name: 'Mesin',
                  amount: getMergedAcc('Mesin'),
                },
                {
                  name: 'Peralatan',
                  amount: getMergedAcc('Peralatan'),
                },
              ],
              total: {
                name: 'Total Aktiva Tetap',
                amount: 0,
              },
            },
          ],
          total: {
            name: 'Total Aktiva',
            amount: 0,
          },
        },
        {
          name: 'KEWAJIBAN DAN MODAL',
          items: [
            {
              name: 'KEWAJIBAN',
              items: [
                {
                  name: 'Utang Usaha',
                  amount: getMergedAcc('Utang Usaha'),
                },
                {
                  name: 'Utang Bank',
                  amount: getMergedAcc('Utang Bank'),
                },
              ],
              total: {
                name: 'Total Kewajiban',
                amount: 0,
              },
            },
            {
              name: 'MODAL',
              items: [
                {
                  name: 'Modal Pemilik',
                  amount: getMergedAcc('Modal Pemilik'),
                },
                {
                  name: 'Modal Sumbangan',
                  amount: getMergedAcc('Modal Sumbangan'),
                },
                {
                  name: 'Saldo Laba',
                  amount: dataLaporanLabaRugi.data.total.amount,
                },
              ],
              total: {
                name: 'Total Modal',
                amount: 0,
              },
            },
          ],
          total: {
            name: 'Total Kewajiban dan Modal',
            amount: 0,
          },
        },
      ],
    },
  };

  dataLaporanPosisiKeuangan.data.items[0].items[0].total.amount = dataLaporanPosisiKeuangan.data.items[0].items[0].items.reduce((sum, item) => sum + item.amount, 0)
  dataLaporanPosisiKeuangan.data.items[0].items[1].total.amount = dataLaporanPosisiKeuangan.data.items[0].items[1].items.reduce((sum, item) => sum + item.amount, 0)
  dataLaporanPosisiKeuangan.data.items[0].total.amount = dataLaporanPosisiKeuangan.data.items[0].items.reduce((sum, item) => sum + item.total.amount, 0)

  dataLaporanPosisiKeuangan.data.items[1].items[0].total.amount = dataLaporanPosisiKeuangan.data.items[1].items[0].items.reduce((sum, item) => sum + item.amount, 0)
  dataLaporanPosisiKeuangan.data.items[1].items[1].total.amount = dataLaporanPosisiKeuangan.data.items[1].items[1].items.reduce((sum, item) => sum + item.amount, 0)
  dataLaporanPosisiKeuangan.data.items[1].total.amount = dataLaporanPosisiKeuangan.data.items[1].items.reduce((sum, item) => sum + item.total.amount, 0)

  return {
    pemasukan,
    pengeluaran,
    totalPemasukan,
    totalPengeluaran,
    dataLaporanLabaRugi,
    dataLaporanPosisiKeuangan
  };
}
