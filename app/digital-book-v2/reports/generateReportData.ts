export function generateReportData({ month, year, transactions = [], accounts = [] }) {
  const localMonth = new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  const date = `${localMonth.toUpperCase()} ${year}`;

  transactions.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());

  const pemasukan = [];
  const pengeluaran = [];

  transactions.forEach((transaction) => {
    const account = accounts.find((acc) => acc.id === transaction.account_id); // Find the account by account_id

    const data = {
      id: transaction.id,
      date: transaction.date.toDate().toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      description: transaction.description,
      account_name: account ? account.name : '', // Get account name from the found account
      account_code: account ? account.code : '', // Get account code from the found account
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

  // console.log(pemasukan, pengeluaran)
  // console.log(totalPemasukan, totalPengeluaran)

  function getMergedAcc(account = '') {
    return (
      pemasukan
        .filter((item) => item.account_name === account) // Filter for "Penjualan"
        .reduce((sum, item) => sum + item.total, 0) -
      pengeluaran
        .filter((item) => item.account_name === account) // Filter for "Penjualan"
        .reduce((sum, item) => sum + item.total, 0)
    );
  }

  console.log("wkwkwkw")
  console.log(getMergedAcc('Beban Perlengkapan'))

  const dataLaporanLabaRugi = {
    institution: 'UD XXX XXX',
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
                .filter((item) => item.account_name === 'Penjualan') // Filter for "Penjualan"
                .reduce((sum, item) => sum + item.total, 0), // get from "pemasukan kas" where account name is "penjualan"
            },
          ],
          total: {
            name: 'Total Pendapatan dari Penjualan',
            amount: 0,
          },
        },
        {
          name: 'Beban-beban Usaha',
          items: [
            {
              name: 'Beban Perlengkapan',
              amount: getMergedAcc('Beban Perlengkapan'), //
            },
            {
              name: 'Beban Obat Hama',
              amount: getMergedAcc('Beban Obat Hama'),
            },
            {
              name: 'Beban Pembelian Bahan Bakar',
              amount: getMergedAcc('Beban Pembelian Bahan Bakar'),
            },
            {
              name: 'Beban Pembelian Bibit',
              amount: getMergedAcc('Beban Pembelian Bibit'),
            },
            {
              name: 'Beban Gaji dan Upah',
              amount: getMergedAcc('Beban Gaji dan Upah'),
            },
            {
              name: 'Beban Pupuk',
              amount: getMergedAcc('Beban Pupuk'),
            },
            {
              name: 'Beban Listrik dan Air',
              amount: getMergedAcc('Beban Listrik dan Air'),
            },
            {
              name: 'Beban Pajak Tanah (PBB)',
              amount: getMergedAcc('Beban Pajak Tanah (PBB)'),
            },
            {
              name: 'Beban Bunga Bank',
              amount: getMergedAcc('Beban Bunga Bank'),
            },
          ],
          total: {
            name: 'Total Beban-Beban Usaha',
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

  dataLaporanLabaRugi.data.items[0].total.amount = dataLaporanLabaRugi.data.items[0].items.reduce((sum, item) => sum + item.amount, 0);
  dataLaporanLabaRugi.data.items[1].total.amount = dataLaporanLabaRugi.data.items[1].items.reduce((sum, item) => sum + item.amount, 0);
  dataLaporanLabaRugi.data.total.amount = dataLaporanLabaRugi.data.items[0].total.amount + dataLaporanLabaRugi.data.items[1].total.amount;

  const dataLaporanPosisiKeuangan = {
    institution: 'UD XXX XXX',
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
                  name: 'Lahan Pertanian',
                  amount: getMergedAcc('Lahan Pertanian'),
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

  console.log(dataLaporanPosisiKeuangan)

  return {
    pemasukan,
    pengeluaran,
    totalPemasukan,
    totalPengeluaran,
    dataLaporanLabaRugi,
    dataLaporanPosisiKeuangan
  };
}
