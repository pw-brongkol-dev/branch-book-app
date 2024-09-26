'use client';

// import { v4 as uuidv4 } from 'uuid';
// import { useFirestore } from '../../hooks/useFirestore';
import { Group, User, Tree, Fertilization, Account, Transaction } from '../../db/interfaces';

export const group_all: Omit<Group, 'id'>[] = [
  {
    name: `Ajuning Tani`,
  },
  {
    name: `Karya Bakti 1`,
  },
];

// export const user_all: Omit<User, 'id'>[] = [
//   {
//     name: `Nabil Finansial`,
//     group_id: '', // This will be set later
//   },
// ];

export const user_all: Omit<User, 'id'>[] = generateUsers(24);

function generateUsers(count: number): Omit<User, 'id'>[] {
  return Array.from({ length: count }, (_, index) => ({
    name: `User ${index + 1}`, // Generate user names dynamically
    group_id: 'zMeAxIZm2r7ZwAx5fQ89', // This will be set later
  }));
}

export const tree_type = {
  durian: `Durian`,
  kopi: `Kopi`,
};

export const tree_all: Omit<Tree, 'id'>[] = generateTrees(50); // Generate 50 trees

function generateTrees(count: number): Omit<Tree, 'id'>[] {
  return Array.from({ length: count }, (_, index) => ({
    code: `DURIAN-${index + 1}`, // Generate unique tree codes
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: '', // This will be set later
  }));
}

export const fertilization_all: Omit<Fertilization, 'id'>[] = [
  {
    date: new Date(),
    title: `Setelah Panen`,
    description: `Tabur: Organik 5 karung, NPK Mutiara 16-16-16 4kg, Karate Plus Boroni 1kg`,
  },
  {
    date: new Date(),
    title: `Setelah Mata Ketam Keluar`,
    description: `Tabur: NPK Grower 15-09-20+TE 4kg, Karate Plus Boroni 1kg`,
  },
  {
    date: new Date(),
    title: `Umur 30-40 Hari Setelah Bunga Mekar`,
    description: `Tabur: NPK Grower 15-09-20+TE 4kg, Karate Plus Boroni 1kg`,
  },
  {
    date: new Date(),
    title: `Umur 60 Hari Setelah Bunga Mekar`,
    description: `Tabur: Suburkali Butir 5kg`,
  },
  // SEMPROT
  {
    date: new Date(),
    title: `Umur 10 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeMAG-S 500gram, MerokeMKP 500gram`,
  },
  {
    date: new Date(),
    title: `Umur 20 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeMAG-S 500gram, MerokeMKP 500gram`,
  },
  {
    date: new Date(),
    title: `Umur 30 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeMAG-S 500gram, MerokeMKP 500gram`,
  },
  {
    date: new Date(),
    title: `Umur 40 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeCu 20gram, MerokeMAG-S 500gram, MerokeSOP 500gram`,
  },
  {
    date: new Date(),
    title: `Umur 50 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeCu 20gram, MerokeMAG-S 500gram, MerokeSOP 500gram`,
  },
  {
    date: new Date(),
    title: `Umur 60 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeCu 20gram, MerokeMAG-S 500gram, MerokeSOP 500gram`,
  },
  {
    date: new Date(),
    title: `Umur 70 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeCu 20gram, MerokeMAG-S 500gram, MerokeSOP 500gram`,
  },
  {
    date: new Date(),
    title: `Umur 80 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeCu 20gram, MerokeMAG-S 500gram, MerokeSOP 500gram`,
  },
];

export const account_all: Omit<Account, 'id'>[] = [
  {
    code: `1-1100`,
    name: `Kas`,
    type: `Asset`,
    db_cr: `Db`,
  },
  {
    code: `1-1200`,
    name: `Piutang`,
    type: `Asset`,
    db_cr: `Db`,
  },
  {
    code: `1-1300`,
    name: `Perlangkapan`,
    type: `Asset`,
    db_cr: `Db`,
  },
  {
    code: `1-1400`,
    name: `Persediaan Aset Biologis`,
    type: `Asset`,
    db_cr: `Db`,
  },
  {
    code: `1-2100`,
    name: `Lahan Pertanian`,
    type: `Asset`,
    db_cr: `Db`,
  },
  {
    code: `1-2200`,
    name: `Peralatan`,
    type: `Asset`,
    db_cr: `Db`,
  },
  {
    code: `1-2210`,
    name: `Akumulasi Penyusutan Perlatan`,
    type: `Asset`,
    db_cr: `Cr`,
  },
  // kewajiban
  {
    code: `2-1100`,
    name: `Utang Usaha`,
    type: `Liabilitas`,
    db_cr: `Cr`,
  },
  {
    code: `2-2100`,
    name: `Utang Jangka Panjang`,
    type: `Liabilitas`,
    db_cr: `Cr`,
  },
  // ekuitas
  {
    code: `3-1100`,
    name: `Modal`,
    type: `Equity`,
    db_cr: `Cr`,
  },
  {
    code: `3-1200`,
    name: `Laba`,
    type: `Equity`,
    db_cr: `Db`,
  },
  // Pendapatan
  {
    code: `4-1100`,
    name: `Pendapatan Usaha`,
    type: `Income`,
    db_cr: `Cr`,
  },
  {
    code: `4-1200`,
    name: `Retur Penjualan`,
    type: `Income`,
    db_cr: `Db`,
  },
  // Beban-beban usaha
  {
    code: `6-1100`,
    name: `Beban Pupuk`,
    type: `Expense`,
    db_cr: `Db`,
  },
  {
    code: `6-1200`,
    name: `Beban Benih`,
    type: `Expense`,
    db_cr: `Db`,
  },
  {
    code: `6-1300`,
    name: `Beban Obat Hama`,
    type: `Expense`,
    db_cr: `Db`,
  },
  {
    code: `6-1400`,
    name: `Beban Gaji dan Upah`,
    type: `Expense`,
    db_cr: `Db`,
  },
  {
    code: `6-1500`,
    name: `Beban Transportasi`,
    type: `Expense`,
    db_cr: `Db`,
  },
  {
    code: `6-1600`,
    name: `Beban Telp, Listrik, Air`,
    type: `Expense`,
    db_cr: `Db`,
  },
];

export const transaction_all: Omit<Transaction, 'id'>[] = [
  {
    account_id: 'v49eglIeChtqFA4QiBEQ',
    user_id: 'YPSU116MaRDOYTQQmScT',
    date: new Date(),
    description: `Pembelian Perlengkapan`,
    total_amount: 100000,
    ref: ``,
  },
  {
    account_id: 'yrTOrBvpzSwba5Wo8xfQ',
    user_id: 'YPSU116MaRDOYTQQmScT',
    date: new Date(),
    description: `Pembayaran Transportasi`,
    total_amount: 100000,
    ref: ``,
  },
  {
    account_id: 'o5U4UYb3onBg33hTxpfu',
    user_id: 'YPSU116MaRDOYTQQmScT',
    date: new Date(),
    description: `Setoran Awal Modal`,
    total_amount: 100000,
    ref: ``,
  },
];

// export const generateDummyData = async () => {

//   // // Insert trees with user_id
//   // const treeIds = await Promise.all(tree_all.map(async (tree, index) => {
//   //   const id = await addTree({ ...tree, user_id: userIds[index].id });
//   //   return { ...tree, id };
//   // }));

//   // // Insert fertilizations
//   // const fertilizationIds = await Promise.all(fertilization_all.map(async (fertilization) => {
//   //   const id = await addFertilization(fertilization);
//   //   return { ...fertilization, id };
//   // }));

// 	// // Insert rel_tree_fertilizations with tree_id and fertilization_id
// 	// const relTreeFertilizationIds = await Promise.all(rel_tree_fertilization_all.map(async (rel, index) => {
// 	// 	const id = await addRelTreeFertilization({ ...rel, tree_id: treeIds[index].id, fertilization_id: fertilizationIds[index].id });
// 	// 	return { ...rel, id };
// 	// }));

//   // // Insert accounts
//   // const accountIds = await Promise.all(account_all.map(async (account) => {
//   //   const id = await addAccount(account);
//   //   return { ...account, id };
//   // }));

//   // // Insert transactions with account_id
//   // const transactionIds = await Promise.all(transaction_all.map(async (transaction, index) => {
//   //   const id = await addTransaction({ ...transaction, account_id: accountIds[index].id });
//   //   return { ...transaction, id };
//   // }));

//   return {
//     group_all: group_all,
//     user_all: [],
//     tree_all: [],
//     fertilization_all: [],
//     rel_tree_fertilization_all: [],
//     account_all: [],
//     transaction_all: [],
//   };
// };
