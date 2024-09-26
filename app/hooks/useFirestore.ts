'use client';

import { useState, useEffect } from 'react';
import { db } from '../db/firebase'; // Ensure this path is correct
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
  DocumentData,
  DocumentReference,
  UpdateData,
  Query,
} from 'firebase/firestore';

// Import your interfaces here
import { Group, User, Account, Tree, Fertilization, Transaction, RelTreeFertilization } from '../db/interfaces';

type CollectionName = 'groups' | 'users' | 'accounts' | 'trees' | 'fertilizations' | 'transactions' | 'rel_tree_fertilizations';
type GroupWithId = Group & { id: string };
type UserWithId = User & { id: string };
type TreeWithId = Tree & { id: string };
type FertilizationWithId = Fertilization & { id: string };
type RelTreeFertilizationWithId = RelTreeFertilization & { id: string };
type AccountWithId = Account & { id: string };
type TransactionWithId = Transaction & { id: string };

export const useFirestore = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAll = async <T extends { id: string }>(
    collectionName: CollectionName,
    filterField?: string,
    filterValue?: string | number | boolean,
  ): Promise<T[]> => {
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

  const getById = async <T>(collectionName: CollectionName, id: string): Promise<T | null> => {
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

  const add = async <T extends DocumentData>(collectionName: CollectionName, data: T): Promise<string> => {
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
      // const { id, ...treeData } = treeDoc.data() as Tree;
      const treeData = treeDoc.data() as Tree;
      return {
        id: treeDoc.id,
        ...treeData,
      } as Tree;
    } catch (err) {
      setError('Failed to fetch tree by code');
      setLoading(false);
      throw err;
    }
  };

  const getTreesWithOwners = async (): Promise<Tree[]> => {
    setLoading(true);
    try {
      const trees = await getAll<TreeWithId>('trees');
      const treesWithOwners = await Promise.all(
        trees.map(async (tree) => {
          if (tree.user_id) {
            const owner = await getById<User>('users', tree.user_id);
            return { ...tree, ownerName: owner?.name || 'Unknown' };
          }
          return { ...tree, ownerName: 'Unknown' };
        }),
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
      }));
      setLoading(false);
      return treesWithOwners as unknown as Tree[];
    } catch (err) {
      setError('Failed to fetch trees by owner ID');
      setLoading(false);
      throw err;
    }
  };

  const getRelTreeFertilizationsByTreeCode = async (treeCode: string): Promise<RelTreeFertilization[]> => {
    setLoading(true);
    try {
      const treeQuery = query(collection(db, 'trees'), where('code', '==', treeCode));
      const treeSnapshot = await getDocs(treeQuery);

      if (treeSnapshot.empty) {
        setLoading(false);
        return [];
      }

      const treeId = treeSnapshot.docs[0].id;

      const relQuery = query(collection(db, 'rel_tree_fertilizations'), where('tree_id', '==', treeId));
      const relSnapshot = await getDocs(relQuery);

      const relData = relSnapshot.docs.map((doc) => {
        // const { id, ...restData} = doc.data() as RelTreeFertilization;
        const restData = doc.data() as RelTreeFertilization;
        return {
          id: doc.id,
          ...restData,
        } as RelTreeFertilization;
      });
      setLoading(false);
      return relData;
    } catch (err) {
      setError('Failed to fetch relationships by tree code');
      setLoading(false);
      throw err;
    }
  };

  // Specific methods for each interface
  const groupMethods = {
    getAllGroups: () => getAll<GroupWithId>('groups'),
    getGroupById: (id: string) => getById<Group>('groups', id),
    addGroup: (group: Group) => add<Group>('groups', group),
    updateGroup: (id: string, group: Partial<Group>) => update<GroupWithId>('groups', id, group),
    deleteGroup: (id: string) => remove('groups', id),
  };

  const userMethods = {
    getAllUsers: () => getAll<UserWithId>('users'),
    getUserById: (id: string) => getById<User>('users', id),
    addUser: (user: User) => add<User>('users', user),
    updateUser: (id: string, user: Partial<User>) => update<UserWithId>('users', id, user),
    deleteUser: (id: string) => remove('users', id),
  };

  const accountMethods = {
    getAllAccounts: () => getAll<AccountWithId>('accounts'),
    getAccountById: (id: string) => getById<Account>('accounts', id),
    addAccount: (account: Account) => add<Account>('accounts', account),
    updateAccount: (id: string, account: Partial<Account>) => update<AccountWithId>('accounts', id, account),
    deleteAccount: (id: string) => remove('accounts', id),
  };

  const treeMethods = {
    getAllTrees: () => getAll<TreeWithId>('trees'),
    getTreeById: (id: string) => getById<Tree>('trees', id),
    getTreeByCode, // Add this line
    addTree: (tree: Tree) => add<Tree>('trees', tree),
    updateTree: (id: string, tree: Partial<Tree>) => update<TreeWithId>('trees', id, tree),
    deleteTree: (id: string) => remove('trees', id),
    getTreesWithOwners,
    getTreesByOwnerName,
  };

  const fertilizationMethods = {
    getAllFertilizations: () => getAll<FertilizationWithId>('fertilizations'),
    getFertilizationById: (id: string) => getById<Fertilization>('fertilizations', id),
    addFertilization: (fertilization: Fertilization) => add<Fertilization>('fertilizations', fertilization),
    updateFertilization: (id: string, fertilization: Partial<Fertilization>) => update<FertilizationWithId>('fertilizations', id, fertilization),
    deleteFertilization: (id: string) => remove('fertilizations', id),
  };

  const transactionMethods = {
    getAllTransactions: () => getAll<TransactionWithId>('transactions'),
    getTransactionById: (id: string) => getById<Transaction>('transactions', id),
    addTransaction: (transaction: Transaction) => add<Transaction>('transactions', transaction),
    updateTransaction: (id: string, transaction: Partial<Transaction>) => update<TransactionWithId>('transactions', id, transaction),
    deleteTransaction: (id: string) => remove('transactions', id),
  };

  const relTreeFertilizationMethods = {
    getAllRelTreeFertilizations: () => getAll<RelTreeFertilizationWithId>('rel_tree_fertilizations'),
    getRelTreeFertilizationById: (id: string) => getById<RelTreeFertilization>('rel_tree_fertilizations', id),
    addRelTreeFertilization: (rel: RelTreeFertilization) => add<RelTreeFertilization>('rel_tree_fertilizations', rel),
    updateRelTreeFertilization: (id: string, rel: Partial<RelTreeFertilization>) =>
      update<RelTreeFertilizationWithId>('rel_tree_fertilizations', id, rel),
    deleteRelTreeFertilization: (id: string) => remove('rel_tree_fertilizations', id),
    // Additional methods specific to this relationship
    getRelTreeFertilizationsByTreeId: (treeId: string) => getAll<RelTreeFertilizationWithId>('rel_tree_fertilizations', 'tree_id', treeId),
    getRelTreeFertilizationsByTreeCode,
    getRelTreeFertilizationsByFertilizationId: (fertilizationId: string) =>
      getAll<RelTreeFertilizationWithId>('rel_tree_fertilizations', 'fertilization_id', fertilizationId),
    toggleFertilizationCompletion: async (id: string) => {
      const rel = await getById<RelTreeFertilization>('rel_tree_fertilizations', id);
      if (rel) {
        return update<RelTreeFertilizationWithId>('rel_tree_fertilizations', id, { is_completed: !rel.is_completed });
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
