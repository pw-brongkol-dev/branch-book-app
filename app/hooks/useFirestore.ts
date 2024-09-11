"use client";

import { useState, useEffect } from "react";
import { db } from "../db/firebase"; // Ensure this path is correct
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
  DocumentData,
} from "firebase/firestore";

// Import your interfaces here
import {
  Group,
  User,
  Account,
  Tree,
  Fertilization,
  Transaction,
} from "../db/interfaces";

type CollectionName =
  | "groups"
  | "users"
  | "accounts"
  | "trees"
  | "fertilizations"
  | "transactions";

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async <T>(collectionName: CollectionName): Promise<T[]> => {
    setLoading(true);
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = querySnapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() } as T)
      );
      setLoading(false);
      return data;
    } catch (err) {
      setError("Failed to fetch data");
      setLoading(false);
      throw err;
    }
  };

  const getById = async <T>(
    collectionName: CollectionName,
    id: string
  ): Promise<T | null> => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      const docSnap = await getDoc(docRef);
      setLoading(false);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as T;
      } else {
        return null;
      }
    } catch (err) {
      setError("Failed to fetch document");
      setLoading(false);
      throw err;
    }
  };

  const add = async <T extends DocumentData>(
    collectionName: CollectionName,
    data: Omit<T, "id">
  ): Promise<string> => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      setLoading(false);
      return docRef.id;
    } catch (err) {
      setError("Failed to add document");
      setLoading(false);
      throw err;
    }
  };

  const update = async <T extends { id: string }>(
    collectionName: CollectionName,
    id: string,
    data: Partial<T>
  ): Promise<void> => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      setLoading(false);
    } catch (err) {
      setError("Failed to update document");
      setLoading(false);
      throw err;
    }
  };

  const remove = async (
    collectionName: CollectionName,
    id: string
  ): Promise<void> => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      setLoading(false);
    } catch (err) {
      setError("Failed to delete document");
      setLoading(false);
      throw err;
    }
  };

  // Specific methods for each interface
  const groupMethods = {
    getAllGroups: () => getAll<Group>("groups"),
    getGroupById: (id: string) => getById<Group>("groups", id),
    addGroup: (group: Omit<Group, "id">) => add<Group>("groups", group),
    updateGroup: (id: string, group: Partial<Group>) => update<Group>("groups", id, group),
    deleteGroup: (id: string) => remove("groups", id),
  };

  const userMethods = {
    getAllUsers: () => getAll<User>("users"),
    getUserById: (id: string) => getById<User>("users", id),
    addUser: (user: Omit<User, "id">) => add<User>("users", user),
    updateUser: (id: string, user: Partial<User>) => update<User>("users", id, user),
    deleteUser: (id: string) => remove("users", id),
  };

  const accountMethods = {
    getAllAccounts: () => getAll<Account>("accounts"),
    getAccountById: (id: string) => getById<Account>("accounts", id),
    addAccount: (account: Omit<Account, "id">) => add<Account>("accounts", account),
    updateAccount: (id: string, account: Partial<Account>) => update<Account>("accounts", id, account),
    deleteAccount: (id: string) => remove("accounts", id),
  };

  const treeMethods = {
    getAllTrees: () => getAll<Tree>("trees"),
    getTreeById: (id: string) => getById<Tree>("trees", id),
    addTree: (tree: Omit<Tree, "id">) => add<Tree>("trees", tree),
    updateTree: (id: string, tree: Partial<Tree>) => update<Tree>("trees", id, tree),
    deleteTree: (id: string) => remove("trees", id),
  };

  const fertilizationMethods = {
    getAllFertilizations: () => getAll<Fertilization>("fertilizations"),
    getFertilizationById: (id: string) => getById<Fertilization>("fertilizations", id),
    addFertilization: (fertilization: Omit<Fertilization, "id">) => add<Fertilization>("fertilizations", fertilization),
    updateFertilization: (id: string, fertilization: Partial<Fertilization>) => update<Fertilization>("fertilizations", id, fertilization),
    deleteFertilization: (id: string) => remove("fertilizations", id),
  };

  const transactionMethods = {
    getAllTransactions: () => getAll<Transaction>("transactions"),
    getTransactionById: (id: string) => getById<Transaction>("transactions", id),
    addTransaction: (transaction: Omit<Transaction, "id">) => add<Transaction>("transactions", transaction),
    updateTransaction: (id: string, transaction: Partial<Transaction>) => update<Transaction>("transactions", id, transaction),
    deleteTransaction: (id: string) => remove("transactions", id),
  };

  return {
    loading,
    error,
    ...groupMethods,
    ...userMethods,
    ...accountMethods,
    ...treeMethods,
    ...fertilizationMethods,
    ...transactionMethods,
  };
};

// import { useState, useEffect } from 'react';
// import { db } from '../db/firebase';
// import { collection, query, where, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';

// interface TreeHistory {
//   id: string;
//   while: string;
//   description: string;
//   completed: boolean;
// }

// interface Tree {
//   id: string;
//   name: string;
//   owner: string;
//   type: string;
//   age: {
//     years: number;
//     months: number;
//   };
//   location: {
//     description: string;
//     coordinates: {
//       latitude: number;
//       longitude: number;
//     };
//   };
//   history: TreeHistory[];
// }

// const useFirestore = (treeId: string) => {
//   const [tree, setTree] = useState<Tree | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const treeRef = doc(db, 'trees', treeId);
//     const unsubscribe = onSnapshot(treeRef,
//       (doc) => {
//         if (doc.exists()) {
//           setTree({ id: doc.id, ...doc.data() } as Tree);
//         } else {
//           setError('Tree not found');
//         }
//         setLoading(false);
//       },
//       (error) => {
//         setError(error.message);
//         setLoading(false);
//       }
//     );

//     return () => unsubscribe();
//   }, [treeId]);

//   const addHistoryItem = async (historyItem: Omit<TreeHistory, 'id'>) => {
//     if (!tree) return;
//     const historyRef = collection(db, 'trees', treeId, 'history');
//     await addDoc(historyRef, historyItem);
//   };

//   const updateHistoryItem = async (historyId: string, updates: Partial<TreeHistory>) => {
//     const historyRef = doc(db, 'trees', treeId, 'history', historyId);
//     await updateDoc(historyRef, updates);
//   };

//   const deleteHistoryItem = async (historyId: string) => {
//     const historyRef = doc(db, 'trees', treeId, 'history', historyId);
//     await deleteDoc(historyRef);
//   };

//   return { tree, loading, error, addHistoryItem, updateHistoryItem, deleteHistoryItem };
// };

// export default useFirestore;
