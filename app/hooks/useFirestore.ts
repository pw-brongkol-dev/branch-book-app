'use client';

import { useState } from 'react';
import { db } from '../db/firebase'; // Ensure this path is correct
import { collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc, query, where, limit, DocumentData, DocumentReference, UpdateData, Query } from 'firebase/firestore';

// Import your interfaces here
import { Group, User, Account, Tree, Fertilization, Transaction, RelTreeFertilization } from '../db/interfaces';

type CollectionName = 'groups' | 'users' | 'accounts' | 'trees' | 'fertilizations' | 'transactions' | 'rel_tree_fertilizations';

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async <T>(collectionName: CollectionName, filterField?: string, filterValue?: string | number | boolean): Promise<T[]> => {
    setLoading(true);
    try {
      let q: Query<DocumentData> = collection(db, collectionName);
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

  const update = async <T extends { id: string }>(collectionName: CollectionName, id: string, data: Partial<T>): Promise<void> => {
    setLoading(true);
    try {
      const docRef = doc(db, collectionName, id) as DocumentReference<T>;
      await updateDoc(docRef, data as UpdateData<T>);
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

  const getTreesByOwnerId = async (ownerId: string): Promise<Tree[]> => {
    setLoading(true);
    try {
      const trees = await getDocs(query(collection(db, 'trees'), where('user_id', '==', ownerId)));
      const treesWithOwners = trees.docs.map((doc) => ({
        ...doc.data(),
      }));
      setLoading(false);
      return treesWithOwners as unknown as Tree[];
    } catch (err) {
      setError('Failed to fetch trees by owner ID');
      setLoading(false);
      throw err;
    }
  };

  // Specific methods for each interface
  const groupMethods = {
    getAllGroups: () => getAll<Group>('groups'),
    getGroupById: (id: string) => getById<Group>('groups', id),
    getGroupByDocumentId: (id: string) => getByDocumentId<Group>('groups', id),
    addGroup: (group: Omit<Group, 'id'>) => add<Group>('groups', group),
    updateGroup: (id: string, group: Partial<Group>) => update<Group>('groups', id, group),
    deleteGroup: (id: string) => remove('groups', id),
  };

  const userMethods = {
    getAllUsers: () => getAll<User>('users'),
    getUserById: (id: string) => getById<User>('users', id),
    getUserByDocumentId: (id: string) => getByDocumentId<User>('users', id),
    addUser: (user: User) => add<User>('users', user),
    updateUser: (id: string, user: Partial<User>) => update<User>('users', id, user),
    deleteUser: (id: string) => remove('users', id),
  };

  const accountMethods = {
    getAllAccounts: () => getAll<Account>('accounts'),
    getAccountById: (id: string) => getById<Account>('accounts', id),
    getAccountByDocumentId: (id: string) => getByDocumentId<Account>('accounts', id),
    addAccount: (account: Omit<Account, 'id'>) => add<Account>('accounts', account),
    updateAccount: (id: string, account: Partial<Account>) => update<Account>('accounts', id, account),
    deleteAccount: (id: string) => remove('accounts', id),
  };

  const treeMethods = {
    getAllTrees: () => getAll<Tree>('trees'),
    getTreeById: (id: string) => getById<Tree>('trees', id),
    getTreeByDocumentId: (id: string) => getByDocumentId<Tree>('trees', id),
    getTreeByCode, // Add this line
    addTree: (tree: Omit<Tree, 'id'>) => add<Tree>('trees', tree),
    updateTree: (id: string, tree: Partial<Tree>) => update<Tree>('trees', id, tree),
    deleteTree: (id: string) => remove('trees', id),
    getTreesWithOwners,
    getTreesByOwnerId,
  };

  const fertilizationMethods = {
    getAllFertilizations: () => getAll<Fertilization>('fertilizations'),
    getFertilizationById: (id: string) => getById<Fertilization>('fertilizations', id),
    getFertilizationByDocumentId: (id: string) => getByDocumentId<Fertilization>('fertilizations', id),
    addFertilization: (fertilization: Omit<Fertilization, 'id'>) => add<Fertilization>('fertilizations', fertilization),
    updateFertilization: (id: string, fertilization: Partial<Fertilization>) => update<Fertilization>('fertilizations', id, fertilization),
    deleteFertilization: (id: string) => remove('fertilizations', id),
  };

  const transactionMethods = {
    getAllTransactions: () => getAll<Transaction>('transactions'),
    getTransactionById: (id: string) => getById<Transaction>('transactions', id),
    getTransactionByDocumentId: (id: string) => getByDocumentId<Transaction>('transactions', id),
    addTransaction: (transaction: Omit<Transaction, 'id'>) => add<Transaction>('transactions', transaction),
    updateTransaction: (id: string, transaction: Partial<Transaction>) => update<Transaction>('transactions', id, transaction),
    deleteTransaction: (id: string) => remove('transactions', id),
  };

  const relTreeFertilizationMethods = {
    getAllRelTreeFertilizations: () => getAll<RelTreeFertilization>('rel_tree_fertilizations'),
    getRelTreeFertilizationById: (id: string) => getById<RelTreeFertilization>('rel_tree_fertilizations', id),
    getRelTreeFertilizationByDocumentId: (id: string) => getByDocumentId<RelTreeFertilization>('rel_tree_fertilizations', id),
    addRelTreeFertilization: (rel: Omit<RelTreeFertilization, 'id'>) => add<RelTreeFertilization>('rel_tree_fertilizations', rel),
    updateRelTreeFertilization: (id: string, rel: Partial<RelTreeFertilization>) => update<RelTreeFertilization>('rel_tree_fertilizations', id, rel),
    deleteRelTreeFertilization: (id: string) => remove('rel_tree_fertilizations', id),

    // Additional methods specific to this relationship
    getRelTreeFertilizationsByTreeId: (treeId: string) => getAll<RelTreeFertilization>('rel_tree_fertilizations', 'tree_id', treeId),
    getRelTreeFertilizationsByFertilizationId: (fertilizationId: string) => getAll<RelTreeFertilization>('rel_tree_fertilizations', 'fertilization_id', fertilizationId),
    toggleFertilizationCompletion: async (id: string) => {
      const rel = await getById<RelTreeFertilization>('rel_tree_fertilizations', id);
      if (rel) {
        return update<RelTreeFertilization>('rel_tree_fertilizations', id, { is_completed: !rel.is_completed });
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