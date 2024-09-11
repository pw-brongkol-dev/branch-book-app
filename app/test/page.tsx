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
      
          const groupId = await addGroup(dummyData.group);
          console.log('Group added with ID:', groupId);
      
          const userId = await addUser(dummyData.user);
          console.log('User added with ID:', userId);
      
          const accountId = await addAccount(dummyData.account);
          console.log('Account added with ID:', accountId);
      
          const treeId = await addTree(dummyData.tree);
          console.log('Tree added with ID:', treeId);
      
          const fertilizationId = await addFertilization(dummyData.fertilization);
          console.log('Fertilization added with ID:', fertilizationId);
      
          const transactionId = await addTransaction(dummyData.transaction);
          console.log('Transaction added with ID:', transactionId);
      
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