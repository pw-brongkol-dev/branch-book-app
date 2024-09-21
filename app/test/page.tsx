"use client";

import { generateDummyData } from "./input_db/insertDummyData";
import { useFirestore } from "../hooks/useFirestore";

export default function Test() {

    const {
        addGroup,
        addUser,
        addAccount,
        addTree,
        addFertilization,
        addTransaction,
      } = useFirestore();

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

    function handleInsertDummyData() {
        insertDummyData();
    }
  return <button onClick={handleInsertDummyData}>Test</button>;
}   