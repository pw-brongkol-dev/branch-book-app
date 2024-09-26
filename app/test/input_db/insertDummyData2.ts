'use client';

// utils/generateDummyData.ts

import { v4 as uuidv4 } from 'uuid';
// import { useFirestore } from '../../hooks/useFirestore';

const group_all = [
  {
    id: uuidv4(),
    name: `Ajuning Tani`,
  },
];

const user_all = [
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
];

const tree_type = {
  durian: `Durian`,
  kopi: `Kopi`,
};

const tree_all = [
  {
    id: uuidv4(),
    code: `DURIAN-1`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[0].id,
  },
];

const fertilization_all = [
  {
    id: uuidv4(),
    date: new Date(),
    title: `Setelah Panen`,
    description: `Tabur: Organik 5 karung, NPK Mutiara 16-16-16 4kg, Karate Plus Boroni 1kg`,
  },
  {
    id: uuidv4(),
    date: new Date(),
    title: `Setelah Mata Ketam Keluar`,
    description: `Tabur: NPK Grower 15-09-20+TE 4kg, Karate Plus Boroni 1kg`,
  },
  {
    id: uuidv4(),
    date: new Date(),
    title: `Umur 30-40 Hari Setelah Bunga Mekar`,
    description: `Tabur: NPK Grower 15-09-20+TE 4kg, Karate Plus Boroni 1kg`,
  },
  {
    id: uuidv4(),
    date: new Date(),
    title: `Umur 60 Hari Setelah Bunga Mekar`,
    description: `Tabur: Suburkali Butir 5kg`,
  },
  // SEMPROT
  {
    id: uuidv4(),
    date: new Date(),
    title: `Umur 10 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeMAG-S 500gram, MerokeMKP 500gram`,
  },
  {
    id: uuidv4(),
    date: new Date(),
    title: `Umur 20 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeMAG-S 500gram, MerokeMKP 500gram`,
  },
  {
    id: uuidv4(),
    date: new Date(),
    title: `Umur 30 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeMAG-S 500gram, MerokeMKP 500gram`,
  },
  {
    id: uuidv4(),
    date: new Date(),
    title: `Umur 40 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeCu 20gram, MerokeMAG-S 500gram, MerokeSOP 500gram`,
  },
  {
    id: uuidv4(),
    date: new Date(),
    title: `Umur 50 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeCu 20gram, MerokeMAG-S 500gram, MerokeSOP 500gram`,
  },
  {
    id: uuidv4(),
    date: new Date(),
    title: `Umur 60 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeCu 20gram, MerokeMAG-S 500gram, MerokeSOP 500gram`,
  },
  {
    id: uuidv4(),
    date: new Date(),
    title: `Umur 70 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeCu 20gram, MerokeMAG-S 500gram, MerokeSOP 500gram`,
  },
  {
    id: uuidv4(),
    date: new Date(),
    title: `Umur 80 Hari Setelah Bunga Mekar`,
    description: `Semprot: MerokeVITAFLEX 50gram, MerokeZINC 20gram, MerokeMn 20gram, MerokeCu 20gram, MerokeMAG-S 500gram, MerokeSOP 500gram`,
  },
];

const account_all = [
  {
    id: `1-1100`,
    name: `Kas`,
    type: `Asset`,
    db_cr: `Db`,
  },
  {
    id: `1-1200`,
    name: `Piutang`,
    type: `Asset`,
    db_cr: `Db`,
  },
  {
    id: `1-1300`,
    name: `Perlangkapan`,
    type: `Asset`,
    db_cr: `Db`,
  },
  {
    id: `1-1400`,
    name: `Persediaan Aset Biologis`,
    type: `Asset`,
    db_cr: `Db`,
  },
  {
    id: `1-2100`,
    name: `Lahan Pertanian`,
    type: `Asset`,
    db_cr: `Db`,
  },
  {
    id: `1-2200`,
    name: `Peralatan`,
    type: `Asset`,
    db_cr: `Db`,
  },
  {
    id: `1-2210`,
    name: `Akumulasi Penyusutan Perlatan`,
    type: `Asset`,
    db_cr: `Cr`,
  },
  // kewajiban
  {
    id: `2-1100`,
    name: `Utang Usaha`,
    type: `Liabilitas`,
    db_cr: `Cr`,
  },
  {
    id: `2-2100`,
    name: `Utang Jangka Panjang`,
    type: `Liabilitas`,
    db_cr: `Cr`,
  },
  // ekuitas
  {
    id: `3-1100`,
    name: `Modal`,
    type: `Equity`,
    db_cr: `Cr`,
  },
  {
    id: `3-1200`,
    name: `Laba`,
    type: `Equity`,
    db_cr: `Db`,
  },
  // Pendapatan
  {
    id: `4-1100`,
    name: `Pendapatan Usaha`,
    type: `Income`,
    db_cr: `Cr`,
  },
  {
    id: `4-1200`,
    name: `Retur Penjualan`,
    type: `Income`,
    db_cr: `Db`,
  },
  // Beban-beban usaha
  {
    id: `6-1100`,
    name: `Beban Pupuk`,
    type: `Expense`,
    db_cr: `Db`,
  },
  {
    id: `6-1200`,
    name: `Beban Benih`,
    type: `Expense`,
    db_cr: `Db`,
  },
  {
    id: `6-1300`,
    name: `Beban Obat Hama`,
    type: `Expense`,
    db_cr: `Db`,
  },
  {
    id: `6-1400`,
    name: `Beban Gaji dan Upah`,
    type: `Expense`,
    db_cr: `Db`,
  },
  {
    id: `6-1500`,
    name: `Beban Transportasi`,
    type: `Expense`,
    db_cr: `Db`,
  },
  {
    id: `6-1600`,
    name: `Beban Telp, Listrik, Air`,
    type: `Expense`,
    db_cr: `Db`,
  },
];

const transaction_all = [
  {
    id: uuidv4(),
    account_id: account_all[0].id,
    user_id: '8db57e37-2fc5-4411-9dad-cb272b952b6c',
    date: new Date(),
    description: `Beli Pupuk`,
    total_amount: 100000,
    ref: ``,
  },
];

const rel_tree_fertilization_all = [
    {
        id: uuidv4(),
        tree_id: "fbe8f591-56a7-4b73-aef1-2f9639437014",
        fertilization_id: fertilization_all[0].id,
        is_completed: false,
    },
    {
        id: uuidv4(),
        tree_id: "fbe8f591-56a7-4b73-aef1-2f9639437014",
        fertilization_id: fertilization_all[1].id,
        is_completed: false,
    },
    {
        id: uuidv4(),
        tree_id: "fbe8f591-56a7-4b73-aef1-2f9639437014",
        fertilization_id: fertilization_all[2].id,
        is_completed: false,
    },
    {
        id: uuidv4(),
        tree_id: "fbe8f591-56a7-4b73-aef1-2f9639437014",
        fertilization_id: fertilization_all[3].id,
        is_completed: false,
    },
]

export const generateDummyData = () => {
  return {
    group: [],
    user: [],
    account: [],
    tree: [],
    fertilization: fertilization_all,
    transaction: transaction_all,
    rel_tree_fertilization: rel_tree_fertilization_all,
  };
};
