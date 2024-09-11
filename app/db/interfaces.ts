export interface Group {
  id: string;
  name: string;
}

export interface User {
  id: string;
  name: string;
  group_id: string; // Foreign key to Group
}

export interface Account {
  id: string;
  code: string;
  name: string;
  type: string;
  db_cr: string; // Assuming this is for debit/credit
  user_id: string; // Foreign key to User
}

export interface Tree {
  id: string;
  code: string;
  type: string;
  accession: string;
  location: string;
  planting_date: Date;
  user_id: string; // Foreign key to User
}

export interface Fertilization {
  id: string;
  tree_id: string; // Foreign key to Tree
  date: Date;
  description: string;
  is_completed: boolean;
}

export interface Transaction {
  id: string;
  account_id: string; // Foreign key to Account
  date: Date;
  description: string;
  total_amount: number;
  ref: string; // Assuming this is a reference number or code
}
