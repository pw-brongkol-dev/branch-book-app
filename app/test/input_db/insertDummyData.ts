'use client';

// utils/generateDummyData.ts

import { v4 as uuidv4 } from 'uuid';
// import { useFirestore } from '../../hooks/useFirestore';

const group_all = [
  {
    id: uuidv4(),
    name: `Ajuning Tani`,
  },
  {
    id: uuidv4(),
    name: `Karya Bakti I`,
  },
];

const user_all = [
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
  {
    id: uuidv4(),
    name: `No Name`,
    group_id: group_all[0].id,
  },
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
  {
    id: uuidv4(),
    code: `DURIAN-2`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[0].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-3`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[1].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-4`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[1].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-5`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[2].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-6`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[2].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-7`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[3].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-8`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[3].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-9`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[4].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-10`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[4].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-11`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[5].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-12`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[5].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-13`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[6].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-14`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[6].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-15`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[7].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-16`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[7].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-17`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[8].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-18`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[8].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-19`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[9].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-20`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[9].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-21`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[10].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-22`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[10].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-23`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[11].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-24`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[11].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-25`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[12].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-26`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[12].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-27`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[13].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-28`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[13].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-29`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[14].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-30`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[14].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-31`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[15].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-32`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[15].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-33`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[16].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-34`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[16].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-35`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[17].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-36`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[17].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-37`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[18].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-38`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[18].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-39`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[19].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-40`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[19].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-41`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[20].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-42`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[20].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-43`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[21].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-44`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[21].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-45`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[22].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-46`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[22].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-47`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[23].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-48`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[23].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-49`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[24].id,
  },
  {
    id: uuidv4(),
    code: `DURIAN-50`,
    type: tree_type.durian,
    accession: `undefined`,
    location: `no_location`,
    planting_date: new Date(),
    user_id: user_all[24].id,
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
    user_id: user_all[0].id,
    date: new Date(),
    description: `Beli Pupuk`,
    total_amount: 100000,
    ref: ``,
  },
];

export const generateDummyData = () => {
  return {
    group: group_all,
    user: user_all,
    account: account_all,
    tree: tree_all,
    fertilization: fertilization_all,
    transaction: transaction_all,
  };
};
