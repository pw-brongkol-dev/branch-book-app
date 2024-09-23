'use client';

import { generateDummyData } from './input_db/insertDummyData';
import { useFirestore } from '../hooks/useFirestore';

export default function Test() {
  const { addGroup, addUser, addAccount, addTree, addFertilization, addTransaction, deleteAccount, deleteFertilization, deleteGroup, deleteRelTreeFertilization, deleteTransaction, deleteTree, deleteUser } = useFirestore();

  const insertDummyData = async () => {
    try {
      const dummyData = generateDummyData();

      console.log('Inserting dummy data...');

      for (const group of dummyData.group) {
        await addGroup(group);
        console.log('Group added:', group.name);
      }

      for (const user of dummyData.user) {
        await addUser(user);
        console.log('User added:', user.name);
      }

      for (const account of dummyData.account) {
        await addAccount(account);
        console.log('Account added:', account.name);
      }

      for (const tree of dummyData.tree) {
        await addTree(tree);
        console.log('Tree added:', tree.code);
      }

      for (const fertilization of dummyData.fertilization) {
        await addFertilization(fertilization);
        console.log('Fertilization added:', fertilization.title);
      }

      for (const transaction of dummyData.transaction) {
        await addTransaction(transaction);
        console.log('Transaction added:', transaction.description);
      }

      console.log('All dummy data inserted successfully!');
    } catch (error) {
      console.error('Error inserting dummy data:', error);
    }
  };

  const deleteDummyData = async () => {
    try {
      const dummyData = generateDummyData();

      console.log('Deleting dummy data...');

      for (const group of dummyData.group) {
        await deleteGroup(group.id); // Assuming each group has an 'id'
        console.log('Group deleted:', group.name);
      }

      for (const user of dummyData.user) {
        await deleteUser(user.id); // Assuming each user has an 'id'
        console.log('User deleted:', user.name);
      }

      for (const account of dummyData.account) {
        await deleteAccount(account.id); // Assuming each account has an 'id'
        console.log('Account deleted:', account.name);
      }

      for (const tree of dummyData.tree) {
        await deleteTree(tree.id); // Assuming each tree has an 'id'
        console.log('Tree deleted:', tree.code);
      }

      for (const fertilization of dummyData.fertilization) {
        await deleteFertilization(fertilization.id); // Assuming each fertilization has an 'id'
        console.log('Fertilization deleted:', fertilization.title);
      }

      for (const transaction of dummyData.transaction) {
        await deleteTransaction(transaction.id); // Assuming each transaction has an 'id'
        console.log('Transaction deleted:', transaction.description);
      }

      console.log('All dummy data deleted successfully!');
    } catch (error) {
      console.error('Error deleting dummy data:', error);
    }
  };

  function handleInsertDummyData() {
    insertDummyData();
  }

  function handleDeleteDummyData() {
    deleteDummyData();
  }
  return (
    <>
      <button onClick={handleInsertDummyData}>Insert Dummy Data</button>
      <br />
      <br />
      <button onClick={handleDeleteDummyData}>Delete Dummy Data</button>
    </>
  );
}
