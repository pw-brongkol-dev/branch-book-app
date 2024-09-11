"use client";

// utils/generateDummyData.ts

import { v4 as uuidv4 } from 'uuid';
// import { useFirestore } from '../../hooks/useFirestore';

export const generateDummyData = () => {
  const groupId = uuidv4();
  const userId = uuidv4();
  const accountId = uuidv4();
  const treeId = uuidv4();

  return {
    group: {
      id: groupId,
      name: `Ajuning Tani`,
    },
    user: {
      id: userId,
      name: `Haryadi`,
      group_id: groupId,
    },
    account: {
      id: accountId,
      code: `1-1100`,
      name: `Kas`,
      type: `Asset`,
      db_cr: ['Db'][Math.floor(Math.random() * 1)],
      user_id: userId,
    },
    tree: {
      code: `PD-1`,
      type: ['Durian'][Math.floor(Math.random() * 1)],
      accession: `Vera`,
      location: `Depan Rumah`,
      planting_date: new Date(),
      user_id: userId,
    },
    fertilization: {
      id: uuidv4(),
      tree_id: treeId,
      date: new Date(),
      description: `Setelah Panen`,
      is_completed: false,
    },
    transaction: {
      id: uuidv4(),
      account_id: accountId,
      date: new Date(),
      description: `Beli Pupuk`,
      total_amount: 100000,
      ref: "",
    },
  };
};


// scripts/insertDummyData.ts

// export const insertDummyData = async () => {
//   const {
//     addGroup,
//     addUser,
//     addAccount,
//     addTree,
//     addFertilization,
//     addTransaction,
//   } = useFirestore();

//   try {
//     const dummyData = generateDummyData();

//     console.log('Inserting dummy data...');

//     const groupId = await addGroup(dummyData.group);
//     console.log('Group added with ID:', groupId);

//     const userId = await addUser(dummyData.user);
//     console.log('User added with ID:', userId);

//     const accountId = await addAccount(dummyData.account);
//     console.log('Account added with ID:', accountId);

//     const treeId = await addTree(dummyData.tree);
//     console.log('Tree added with ID:', treeId);

//     const fertilizationId = await addFertilization(dummyData.fertilization);
//     console.log('Fertilization added with ID:', fertilizationId);

//     const transactionId = await addTransaction(dummyData.transaction);
//     console.log('Transaction added with ID:', transactionId);

//     console.log('All dummy data inserted successfully!');
//   } catch (error) {
//     console.error('Error inserting dummy data:', error);
//   }
// };

// // // Run the function
// // insertDummyData();