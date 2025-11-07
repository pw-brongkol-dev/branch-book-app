'use client';

import { useState } from 'react';
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
import { startOfMonth, endOfMonth } from 'date-fns'; // Import date-fns for date manipulation

// Import your interfaces here
import {
  Group,
  GroupWithId,
  User,
  UserWithId,
  Account,
  AccountWithId,
  Tree,
  TreeWithId,
  Fertilization,
  TransactionWithId,
  Transaction,
  FertilizationWithId,
  RelTreeFertilization,
  RelTreeFertilizationWithId,
  TransactionGroup,
  TransactionGroupWithId,
  AccountGroup,
  AccountGroupWithId,
  ProductGroup,
  ProductGroupWithId,
} from '../db/interfaces';

type CollectionName = 'groups' | 'users' | 'accounts' | 'trees' | 'fertilizations' | 'transactions' | 'rel_tree_fertilizations' | 'transactions_group' | 'accounts_group' | 'products_group';

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

  const getById = async <T extends { id: string }>(collectionName: CollectionName, id: string): Promise<T | null> => {
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
            const owner = await getById<UserWithId>('users', tree.user_id);
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

  const getTransactionsByUserId = async (userId: string, month?: number, year?: number): Promise<TransactionWithId[]> => {
    setLoading(true);
    try {
      let transactionsQuery = query(collection(db, 'transactions'), where('user_id', '==', userId));

      if (month && year) {
        const startDate = new Date(year, month - 1, 1); // Start of the month
        const endDate = new Date(year, month, 0, 23, 59, 59, 999); // End of the month
        transactionsQuery = query(
          transactionsQuery,
          where('date', '>=', startDate),
          where('date', '<=', endDate)
        );
      }

      const querySnapshot = await getDocs(transactionsQuery);
      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TransactionWithId[];
      setLoading(false);
      return transactions;
    } catch (err) {
      setError('Failed to fetch transactions by user ID');
      setLoading(false);
      throw err;
    }
  };

  const getRelTreeFertilizationsByTreeCode = async (treeCode: string): Promise<RelTreeFertilizationWithId[]> => {
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
        };
      });
      setLoading(false);
      return relData;
    } catch (err) {
      setError('Failed to fetch relationships by tree code');
      setLoading(false);
      throw err;
    }
  };
  
  const getTransactionsRangeByUserId = async (
    userId: string,
    endMonth: number,
    endYear: number
  ): Promise<TransactionWithId[]> => {
    setLoading(true);
    try {
      // Create an array to hold all the transactions
      const transactions: TransactionWithId[] = [];
  
      // Fetch all transactions for the user
      const allTransactionsQuery = query(
        collection(db, 'transactions'),
        where('user_id', '==', userId)
      );
  
      const allTransactionsSnapshot = await getDocs(allTransactionsQuery);
      const allTransactions = allTransactionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TransactionWithId[];
  
      // Determine the earliest transaction date
      const earliestTransactionDate = allTransactions.reduce((earliest, transaction) => {
        const transactionDate = transaction.date.toDate(); // Assuming date is a Firestore Timestamp
        return earliest ? (transactionDate < earliest ? transactionDate : earliest) : transactionDate;
      }, null as Date | null);
  
      if (!earliestTransactionDate) {
        setLoading(false);
        return []; // No transactions found
      }
  
      // Set the start date to the earliest transaction date
      const startDate = earliestTransactionDate;
  
      // Set the end date based on the provided month and year
      const endDate = endOfMonth(new Date(endYear, endMonth - 1)); // End of the selected month
  
      // Filter transactions based on the date range
      const filteredTransactions = allTransactions.filter((transaction) => {
        const transactionDate = transaction.date.toDate(); // Assuming date is a Firestore Timestamp
        return transactionDate >= startDate && transactionDate <= endDate;
      });
  
      setLoading(false);
      return filteredTransactions;
    } catch (err) {
      setError('Failed to fetch transactions by user ID and date range');
      setLoading(false);
      throw err;
    }
  };

  // Specific methods for each interface
  const groupMethods = {
    getAllGroups: () => getAll<GroupWithId>('groups'),
    getGroupById: (id: string) => getById<GroupWithId>('groups', id),
    addGroup: (group: Group) => add<Group>('groups', group),
    updateGroup: (id: string, group: Partial<Group>) => update<GroupWithId>('groups', id, group),
    deleteGroup: (id: string) => remove('groups', id),
  };

  const userMethods = {
    getAllUsers: () => getAll<UserWithId>('users'),
    getUserById: (id: string) => getById<UserWithId>('users', id),
    addUser: (user: User) => add<User>('users', user),
    updateUser: (id: string, user: Partial<User>) => update<UserWithId>('users', id, user),
    deleteUser: (id: string) => remove('users', id),
  };

  const accountMethods = {
    getAllAccounts: () => getAll<AccountWithId>('accounts'),
    getAccountById: (id: string) => getById<AccountWithId>('accounts', id),
    addAccount: (account: Account) => add<Account>('accounts', account),
    updateAccount: (id: string, account: Partial<Account>) => update<AccountWithId>('accounts', id, account),
    deleteAccount: (id: string) => remove('accounts', id),
  };

  const treeMethods = {
    getAllTrees: () => getAll<TreeWithId>('trees'),
    getTreeById: (id: string) => getById<TreeWithId>('trees', id),
    getTreeByCode, // Add this line
    addTree: (tree: Tree) => add<Tree>('trees', tree),
    updateTree: (id: string, tree: Partial<Tree>) => update<TreeWithId>('trees', id, tree),
    deleteTree: (id: string) => remove('trees', id),
    getTreesWithOwners,
    getTreesByOwnerId,
  };

  const fertilizationMethods = {
    getAllFertilizations: () => getAll<FertilizationWithId>('fertilizations'),
    getFertilizationById: (id: string) => getById<FertilizationWithId>('fertilizations', id),
    addFertilization: (fertilization: Fertilization) => add<Fertilization>('fertilizations', fertilization),
    updateFertilization: (id: string, fertilization: Partial<Fertilization>) => update<FertilizationWithId>('fertilizations', id, fertilization),
    deleteFertilization: (id: string) => remove('fertilizations', id),
  };

  const transactionMethods = {
    getAllTransactions: () => getAll<TransactionWithId>('transactions'),
    getTransactionById: (id: string) => getById<TransactionWithId>('transactions', id),
    addTransaction: (transaction: Transaction) => add<Transaction>('transactions', transaction),
    updateTransaction: (id: string, transaction: Partial<Transaction>) => update<TransactionWithId>('transactions', id, transaction),
    deleteTransaction: (id: string) => remove('transactions', id),
    getTransactionsByUserId, // Add this line
    getTransactionsRangeByUserId, // New method added here
  };

  const relTreeFertilizationMethods = {
    getAllRelTreeFertilizations: () => getAll<RelTreeFertilizationWithId>('rel_tree_fertilizations'),
    getRelTreeFertilizationById: (id: string) => getById<RelTreeFertilizationWithId>('rel_tree_fertilizations', id),
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
      const rel = await getById<RelTreeFertilizationWithId>('rel_tree_fertilizations', id);
      if (rel) {
        return update<RelTreeFertilizationWithId>('rel_tree_fertilizations', id, { is_completed: !rel.is_completed });
      }
    },
  };

  // ========== KELOMPOK METHODS ==========

  const getTransactionsGroupByUserId = async (userId: string, month?: number, year?: number): Promise<TransactionGroupWithId[]> => {
    setLoading(true);
    try {
      let transactionsQuery = query(collection(db, 'transactions_group'), where('user_id', '==', userId));

      if (month && year) {
        const startDate = new Date(year, month - 1, 1); // Start of the month
        const endDate = new Date(year, month, 0, 23, 59, 59, 999); // End of the month
        transactionsQuery = query(
          transactionsQuery,
          where('date', '>=', startDate),
          where('date', '<=', endDate)
        );
      }

      const querySnapshot = await getDocs(transactionsQuery);
      const transactions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TransactionGroupWithId[];
      setLoading(false);
      return transactions;
    } catch (err) {
      setError('Failed to fetch group transactions by user ID');
      setLoading(false);
      throw err;
    }
  };

  const getTransactionsGroupRangeByUserId = async (
    userId: string,
    endMonth: number,
    endYear: number
  ): Promise<TransactionGroupWithId[]> => {
    setLoading(true);
    try {
      // Fetch all transactions for the group (user)
      const allTransactionsQuery = query(
        collection(db, 'transactions_group'),
        where('user_id', '==', userId)
      );

      const allTransactionsSnapshot = await getDocs(allTransactionsQuery);
      const allTransactions = allTransactionsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as TransactionGroupWithId[];

      // Determine the earliest transaction date
      const earliestTransactionDate = allTransactions.reduce((earliest, transaction) => {
        const transactionDate = transaction.date.toDate();
        return earliest ? (transactionDate < earliest ? transactionDate : earliest) : transactionDate;
      }, null as Date | null);

      if (!earliestTransactionDate) {
        setLoading(false);
        return [];
      }

      // Set the start date to the earliest transaction date
      const startDate = earliestTransactionDate;

      // Set the end date based on the provided month and year
      const endDate = endOfMonth(new Date(endYear, endMonth - 1));

      // Filter transactions based on the date range
      const filteredTransactions = allTransactions.filter((transaction) => {
        const transactionDate = transaction.date.toDate();
        return transactionDate >= startDate && transactionDate <= endDate;
      });

      setLoading(false);
      return filteredTransactions;
    } catch (err) {
      setError('Failed to fetch group transactions by user ID and date range');
      setLoading(false);
      throw err;
    }
  };

  const transactionGroupMethods = {
    getAllTransactionsGroup: () => getAll<TransactionGroupWithId>('transactions_group'),
    getTransactionGroupById: (id: string) => getById<TransactionGroupWithId>('transactions_group', id),
    getTransactionsGroupByUserId,
    getTransactionsGroupRangeByUserId,
    addTransactionGroup: (transaction: TransactionGroup) => add<TransactionGroup>('transactions_group', transaction),
    updateTransactionGroup: (id: string, transaction: Partial<TransactionGroup>) => 
      update<TransactionGroupWithId>('transactions_group', id, transaction),
    deleteTransactionGroup: (id: string) => remove('transactions_group', id),
  };

  const accountGroupMethods = {
    getAllAccountsGroup: () => getAll<AccountGroupWithId>('accounts_group'),
    getAccountGroupById: (id: string) => getById<AccountGroupWithId>('accounts_group', id),
    getAccountsGroupByCategory: (category: string) => 
      getAll<AccountGroupWithId>('accounts_group', 'category', category),
    addAccountGroup: (account: AccountGroup) => add<AccountGroup>('accounts_group', account),
    updateAccountGroup: (id: string, account: Partial<AccountGroup>) => 
      update<AccountGroupWithId>('accounts_group', id, account),
    deleteAccountGroup: (id: string) => remove('accounts_group', id),
  };

  const productGroupMethods = {
    getAllProductsGroup: () => getAll<ProductGroupWithId>('products_group'),
    getProductGroupById: (id: string) => getById<ProductGroupWithId>('products_group', id),
    getProductsGroupByUserId: (userId: string) => 
      getAll<ProductGroupWithId>('products_group', 'user_id', userId),
    addProductGroup: (product: ProductGroup) => add<ProductGroup>('products_group', product),
    updateProductGroup: (id: string, product: Partial<ProductGroup>) => 
      update<ProductGroupWithId>('products_group', id, product),
    deleteProductGroup: (id: string) => remove('products_group', id),
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
    ...transactionGroupMethods,
    ...accountGroupMethods,
    ...productGroupMethods,
  };
};