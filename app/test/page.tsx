'use client';

import {
  group_all,
  user_all,
  tree_all,
  fertilization_all,
  account_all,
  transaction_all,
} from './input_db/insertDummyData3';
import { useFirestore } from '../hooks/useFirestore';

export default function Test() {
  const {
    getAllTrees,
    getAllFertilizations,
    getAllUsers,
    addGroup,
    addUser,
    addAccount,
    addTree,
    addFertilization,
    addTransaction,
    addRelTreeFertilization,
  } = useFirestore();

  async function handleInsertDummyData() {
    try {
      console.log('Inserting dummy data...');

      // // Insert groups
      // const groupIds = await Promise.all(
      //   group_all.map(async (group) => {
      //     const id = await addGroup(group);
      //     return { ...group, id };
      //   }),
      // );
      // console.log(groupIds);

      // // Insert users with group_id
      // const userIds = await Promise.all(
      //   user_all.map(async (user, index) => {
      //     // const id = await addUser({ ...user, group_id: groupIds[index].id });
      //     const id = await addUser({
      //       ...user,
      //       group_id: 'zMeAxIZm2r7ZwAx5fQ89',
      //     });
      //     return { ...user, id };
      //   }),
      // );
      // console.log(userIds);

      // // Insert trees with user_id
      // const users = await getAllUsers()
      // const sortedUsers = users.sort((a, b) => parseInt(a.name.split(' ')[1]) - parseInt(b.name.split(' ')[1]));
      // console.log(sortedUsers)
      // const treeIds = await Promise.all(
      //   tree_all.map(async (tree, index) => {
      //     // const id = await addTree({ ...tree, user_id: userIds[index].id });
      //     const id = await addTree({
      //       ...tree,
      //       user_id: sortedUsers[Math.ceil((index+1)/2)-1].id,
      //     });
      //     return { ...tree, id };
      //   }),
      // );
      // console.log(treeIds);

      // // Insert fertilizations
      // const fertilizationIds = await Promise.all(
      //   fertilization_all.map(async (fertilization) => {
      //     const id = await addFertilization(fertilization);
      //     return { ...fertilization, id };
      //   }),
      // );
      // console.log(fertilizationIds);

      // // Insert rel_tree_fertilizations with tree_id and fertilization_id (wrong logic)
      // const relTreeFertilizationIds = await Promise.all(
      //   rel_tree_fertilization_all.map(async (rel, index) => {
      //     const id = await addRelTreeFertilization({ ...rel, tree_id: treeIds[index].id, fertilization_id: fertilizationIds[index].id });
      //     return { ...rel, id };
      //   }),
      // );
      // console.log(relTreeFertilizationIds);

      // // Insert accounts
      // const accountIds = await Promise.all(
      //   account_all.map(async (account) => {
      //     const id = await addAccount(account);
      //     return { ...account, id };
      //   }),
      // );
      // console.log(accountIds);

      // // Insert transactions with account_id
      // const transactionIds = await Promise.all(
      //   transaction_all.map(async (transaction) => {
      //     const id = await addTransaction({ ...transaction });
      //     return { ...transaction, id };
      //   }),
      // );
      // console.log(transactionIds);

      console.log('All dummy data inserted successfully!');
    } catch (error) {
      console.error('Error inserting dummy data:', error);
    }
  }

  async function insertRelTreeFertilizationPair() {
    try {
      console.log('Generating relationships between trees and fertilizations...');

      // Fetch all trees and fertilizations using useFirestore
      const trees = await getAllTrees(); // Fetch all trees
      const fertilizations = await getAllFertilizations(); // Fetch all fertilizations

      // Create pairs and save to the database
      const relTreeFertilizationIds = await Promise.all(
        trees.map(async (tree) => {
          fertilizations.map(async (fertilization) => {
            // Randomly select a fertilization for each tree
            const rel = {
              tree_id: tree.id, // Assuming tree has an 'id' property
              fertilization_id: fertilization.id, // Assuming fertilization has an 'id' property
              is_completed: false, // Set default value
            };

            // DANGER! THIS WILL BE INSERT TO DB
            // const id = await addRelTreeFertilization(rel);
            const id = null

            console.log(rel)
            return { ...rel, id };
          })
        })
      );

      console.log('Generated relationships:', relTreeFertilizationIds);
    } catch (error) {
      console.error('Error generating relationships:', error);
    }
  }

  return (
    <>
      <button className="border border-black" onClick={handleInsertDummyData}>
        Insert Dummy Data
      </button>
      <br />
      <br />
      {/* <button className="border border-black" onClick={handleDeleteDummyData}>
        Delete Dummy Data
      </button> */}
      <br />
      <br />
      <button className="border border-black" onClick={insertRelTreeFertilizationPair}>
        [Danger!] Generate Pair Tree-Fertilization
      </button>
    </>
  );
}
