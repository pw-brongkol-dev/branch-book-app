'use client';

import { useState, useEffect } from 'react';
import { db } from '../db/firebase'; // Ensure this path is correct
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, limit, Timestamp, DocumentData } from 'firebase/firestore';

// Import your interfaces here
import { Group, User, Account, Tree, Fertilization, Transaction, RelTreeFertilization } from '../db/interfaces';

type CollectionName = 'groups' | 'users' | 'accounts' | 'trees' | 'fertilizations' | 'transactions' | 'rel_tree_fertilizations';
type AllowedInterfaces = Group | User | Account | Tree | Fertilization | Transaction | RelTreeFertilization;

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async <T>(collectionName: CollectionName, filterField?: string, filterValue?: any): Promise<T[]> => {
    setLoading(true);
    try {
      let q = collection(db, collectionName);
      if (filterField && filterValue) {
        q = query(q, where(filterField, '==', filterValue));
      }
      const querySnapshot = await getDocs(q);
      const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T));
      setLoading(false);
      return data;
    } catch (err) {
      setError('Failed to fetch data');
      setLoading(false);
      throw err;
    }
  };

  const getByDocumentId = async <T>(collectionName: CollectionName, id: string): Promise<T | null> => {
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
      setError('Failed to fetch document');
      setLoading(false);
      throw err;
    }
  };

  const getById = async <T>(collectionName: CollectionName, id: string, idField: string = 'id'): Promise<T | null> => {
    setLoading(true);
    try {
      const q = query(collection(db, collectionName), where(idField, '==', id), limit(1));
      const querySnapshot = await getDocs(q);
      setLoading(false);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, ...doc.data() } as T;
      } else {
        return null;
      }
    } catch (err) {
      setError('Failed to fetch document');
      setLoading(false);
      throw err;
    }
  };

  const add = async <T extends DocumentData>(collectionName: CollectionName, data: Omit<T, 'id'>): Promise<string> => {
    setLoading(true);
    try {
      const docRef = await addDoc(collection(db, collectionName), data);
      setLoading(false);
      return docRef.id;
    } catch (err) {
      setError('Failed to add document');
      setLoading(false);
      throw err;
    }
  };

  const update = async (collectionName: CollectionName, id: string, data: Partial<AllowedInterfaces>): Promise<void> => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
      setLoading(false);
    } catch (err) {
      setError('Failed to update document');
      setLoading(false);
      throw err;
    }
  };

  const remove = async (collectionName: CollectionName, id: string): Promise<void> => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
      setLoading(false);
    } catch (err) {
      setError('Failed to delete document');
      setLoading(false);
      throw err;
    }
  };

  const getTreeByCode = async (code: string): Promise<Tree | null> => {
    setLoading(true);
    try {
      const treeQuery = query(collection(db, 'trees'), where('code', '==', code));
      const querySnapshot = await getDocs(treeQuery);

      if (querySnapshot.empty) {
        setLoading(false);
        return null;
      }

      const treeDoc = querySnapshot.docs[0];
      setLoading(false);
      return { id: treeDoc.id, ...treeDoc.data() } as Tree;
    } catch (err) {
      setError('Failed to fetch tree by code');
      setLoading(false);
      throw err;
    }
  };

  const getTreesWithOwners = async (): Promise<Tree[]> => {
    setLoading(true);
    try {
      const trees = await getAll<Tree>('trees');
      const treesWithOwners = await Promise.all(
        trees.map(async (tree) => {
          if (tree.user_id) {
            const owner = await getById<User>('users', tree.user_id);
            return { ...tree, ownerName: owner?.name || 'Unknown' };
          }
          return { ...tree, ownerName: 'Unknown' };
        })
      );
      setLoading(false);
      return treesWithOwners;
    } catch (err) {
      setError('Failed to fetch trees with owners');
      setLoading(false);
      throw err;
    }
  };

  const getTreesByOwnerName = async (ownerName: string): Promise<Tree[]> => {
    setLoading(true);
    try {
      const users = await getDocs(query(collection(db, 'users'), where('name', '==', ownerName)));
      const userIds = users.docs.map((doc) => doc.id);

      const trees = await getDocs(query(collection(db, 'trees'), where('user_id', 'in', userIds)));
      const treesWithOwners = trees.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        ownerName: ownerName,
      })) as Tree[];

      setLoading(false);
      return treesWithOwners;
    } catch (err) {
      setError('Failed to fetch trees by owner name');
      setLoading(false);
      throw err;
    }
  };

  // Specific methods for each interface
  const groupMethods = {
    getAllGroups: () => getAll<Group>('groups'),
    getGroupById: (id: string) => getById<Group>('groups', id),
    addGroup: (group: Omit<Group, 'id'>) => add<Group>('groups', group),
    updateGroup: (id: string, group: Partial<Group>) => update('groups', id, group),
    deleteGroup: (id: string) => remove('groups', id),
  };

  const userMethods = {
    getAllUsers: () => getAll<User>('users'),
    getUserById: (id: string) => getById<User>('users', id),
    addUser: (user: User) => add<User>('users', user),
    updateUser: (id: string, user: Partial<User>) => update('users', id, user),
    deleteUser: (id: string) => remove('users', id),
  };

  const accountMethods = {
    getAllAccounts: () => getAll<Account>('accounts'),
    getAccountById: (id: string) => getById<Account>('accounts', id),
    addAccount: (account: Omit<Account, 'id'>) => add<Account>('accounts', account),
    updateAccount: (id: string, account: Partial<Account>) => update('accounts', id, account),
    deleteAccount: (id: string) => remove('accounts', id),
  };

  const treeMethods = {
    getAllTrees: () => getAll<Tree>('trees'),
    getTreeById: (id: string) => getById<Tree>('trees', id),
    getTreeByCode, // Add this line
    addTree: (tree: Tree) => add<Tree>('trees', tree),
    updateTree: (id: string, tree: Partial<Tree>) => update('trees', id, tree),
    deleteTree: (id: string) => remove('trees', id),
    getTreesWithOwners,
    getTreesByOwnerName,
  };

  const fertilizationMethods = {
    getAllFertilizations: () => getAll<Fertilization>('fertilizations'),
    getFertilizationById: (id: string) => getById<Fertilization>('fertilizations', id),
    addFertilization: (fertilization: Omit<Fertilization, 'id'>) => add<Fertilization>('fertilizations', fertilization),
    updateFertilization: (id: string, fertilization: Partial<Fertilization>) => update('fertilizations', id, fertilization),
    deleteFertilization: (id: string) => remove('fertilizations', id),
  };

  const transactionMethods = {
    getAllTransactions: () => getAll<Transaction>('transactions'),
    getTransactionById: (id: string) => getById<Transaction>('transactions', id),
    addTransaction: (transaction: Omit<Transaction, 'id'>) => add<Transaction>('transactions', transaction),
    updateTransaction: (id: string, transaction: Partial<Transaction>) => update('transactions', id, transaction),
    deleteTransaction: (id: string) => remove('transactions', id),
  };

  const relTreeFertilizationMethods = {
    getAllRelTreeFertilizations: () => getAll<RelTreeFertilization>('rel_tree_fertilizations'),
    getRelTreeFertilizationById: (id: string) => getById<RelTreeFertilization>('rel_tree_fertilizations', id),
    addRelTreeFertilization: (rel: Omit<RelTreeFertilization, 'id'>) => add<RelTreeFertilization>('rel_tree_fertilizations', rel),
    updateRelTreeFertilization: (id: string, rel: Partial<RelTreeFertilization>) => update('rel_tree_fertilizations', id, rel),
    deleteRelTreeFertilization: (id: string) => remove('rel_tree_fertilizations', id),

    // Additional methods specific to this relationship
    getRelTreeFertilizationsByTreeId: (treeId: string) => getAll<RelTreeFertilization>('rel_tree_fertilizations', 'tree_id', treeId),
    getRelTreeFertilizationsByFertilizationId: (fertilizationId: string) => getAll<RelTreeFertilization>('rel_tree_fertilizations', 'fertilization_id', fertilizationId),
    toggleFertilizationCompletion: async (id: string) => {
      const rel = await getById<RelTreeFertilization>('rel_tree_fertilizations', id);
      if (rel) {
        return update('rel_tree_fertilizations', id, { is_completed: !rel.is_completed });
      }
    },
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
    ...relTreeFertilizationMethods,
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
