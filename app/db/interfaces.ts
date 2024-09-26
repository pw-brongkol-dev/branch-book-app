import { Timestamp } from 'firebase/firestore';

export interface Group {
  // id: string;
  name: string;
}

export interface User {
  // id: string;
  name: string;
  group_id: string;
}

export interface Tree {
  // id: string;
  code: string;
  type: string;
  accession: string;
  location: string;
  planting_date: Timestamp;
  user_id: string; // Foreign key to User
}

export interface RelTreeFertilization {
  // id: string;
  tree_id: string;
  fertilization_id: string;
  is_completed: boolean;
}

export interface Fertilization {
  // id: string;
  date: Timestamp;
  title: string;
  description: string;
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  db_cr: string; // Assuming this is for debit/credit
}

export interface Transaction {
  // id: string;
  account_id: string; // Foreign key to Account
  user_id: string; // Foreign key to User
  date: Timestamp;
  description: string;
  total_amount: number;
  ref: string; // Assuming this is a reference number or code
}

export type GroupWithId = Group & { id: string };
export type UserWithId = User & { id: string };
export type TreeWithId = Tree & { id: string };
export type FertilizationWithId = Fertilization & { id: string };
export type RelTreeFertilizationWithId = RelTreeFertilization & { id: string };
export type AccountWithId = Account & { id: string };
export type TransactionWithId = Transaction & { id: string };
