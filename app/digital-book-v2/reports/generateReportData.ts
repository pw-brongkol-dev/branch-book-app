export function generateReportData({ month, year, transactions = [], accounts = [] }) {
  const localMonth = new Date(0, month - 1).toLocaleString('default', { month: 'long' });
  const date = `${localMonth.toUpperCase()} ${year}`;

  transactions.sort((a, b) => a.date.toDate().getTime() - b.date.toDate().getTime());

  const pemasukan = [];
  const pengeluaran = [];

  transactions.forEach((transaction) => {
    const account = accounts.find((acc) => acc.id === transaction.account_id); // Find the account by account_id

    const data = {
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
}
