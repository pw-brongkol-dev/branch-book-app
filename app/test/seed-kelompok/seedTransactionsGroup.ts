import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/app/db/firebase';

/**
 * Seed Transactions Group ke Firestore
 * Contoh transaksi untuk Kelompok Tani
 */

// Helper function to create date from string
const createDate = (dateString: string) => {
  return Timestamp.fromDate(new Date(dateString));
};

const transactionsGroupData = [
  // Transactions for user_id: YI1u3kHlhahImuJra4CU
  {
    user_id: 'YI1u3kHlhahImuJra4CU',
    account_id: 'zorV7dPvMXz7sraEhV7e', // Penjualan
    product_id: 'iExU7zxHleestuJgWDGY', // Permen product ID
    date: new Date('2024-11-01'),
    description: 'Penjualan Permen 50 bungkus @ Rp 2,000',
    ref: 'TRX-001',
    total_amount: 100000,
    type: 'pemasukan' as const,
  },
  {
    user_id: 'YI1u3kHlhahImuJra4CU',
    account_id: 'zorV7dPvMXz7sraEhV7e', // Penjualan
    product_id: 'iExU7zxHleestuJgWDGY', // Using same product ID
    date: new Date('2024-11-05'),
    description: 'Penjualan Gelato 30 cup @ Rp 5,000',
    ref: 'TRX-002',
    total_amount: 150000,
    type: 'pemasukan' as const,
  },
  {
    user_id: 'YI1u3kHlhahImuJra4CU',
    account_id: 'IhOjzFP9A7J7c9EHqWSW', // Biaya Bahan Baku
    // No product_id for this transaction
    product_id: 'iExU7zxHleestuJgWDGY', // Using same product ID
    date: new Date('2024-11-10'),
    description: 'Pembelian Bahan Baku',
    ref: 'TRX-003',
    total_amount: 75000,
    type: 'pengeluaran' as const,
  },
];

/**
 * Main function to seed transactions with auto-lookup for account_id and product_id
 */
export async function seedTransactionsGroup() {
  try {
    console.log('🌱 Starting seeding transactions_group...');

    // Check if collection already has data for this kelompok
    const existingTransactions = await getDocs(
      query(collection(db, 'transactions_group'), where('user_id', '==', 'YI1u3kHlhahImuJra4CU'))
    );
    
    if (existingTransactions.size > 0) {
      console.log(`⚠️  Warning: Kelompok YI1u3kHlhahImuJra4CU already has ${existingTransactions.size} transactions.`);
      console.log('   Skipping seed to prevent duplicates.');
      return {
        success: false,
        message: 'Kelompok already has transactions',
        existingCount: existingTransactions.size,
      };
    }

    // Get accounts from accounts_group
    console.log('📋 Fetching accounts...');
    const accountsSnapshot = await getDocs(collection(db, 'accounts_group'));
    const accounts = accountsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    if (accounts.length === 0) {
      throw new Error('No accounts found. Please seed accounts_group first.');
    }

    console.log(`📝 Adding ${transactionsGroupData.length} transactions...`);

    const addedTransactions = [];
    let totalPemasukan = 0;
    let totalPengeluaran = 0;

    for (const transaction of transactionsGroupData) {
      // Prepare transaction data - only include fields that exist
      const transactionData: any = {
        user_id: transaction.user_id,
        account_id: transaction.account_id,
        date: Timestamp.fromDate(transaction.date),
        description: transaction.description,
        ref: transaction.ref,
        total_amount: transaction.total_amount,
        type: transaction.type,
      };

      // Only add product_id if it exists
      if (transaction.product_id) {
        transactionData.product_id = transaction.product_id;
      }

      const docRef = await addDoc(collection(db, 'transactions_group'), transactionData);
      addedTransactions.push({ id: docRef.id, ...transactionData });
      
      // Calculate totals
      if (transaction.type === 'pemasukan') {
        totalPemasukan += transaction.total_amount;
      } else {
        totalPengeluaran += transaction.total_amount;
      }

      console.log(`   ✓ ${transaction.description} - Rp ${transaction.total_amount.toLocaleString('id-ID')}`);
    }

    const saldo = totalPemasukan - totalPengeluaran;

    console.log('\n✨ Seeding transactions_group completed successfully!');
    console.log(`📊 Total transactions seeded: ${addedTransactions.length}`);
    console.log('\n💰 Summary:');
    console.log(`   Total Pemasukan: Rp ${totalPemasukan.toLocaleString('id-ID')}`);
    console.log(`   Total Pengeluaran: Rp ${totalPengeluaran.toLocaleString('id-ID')}`);
    console.log(`   Saldo: Rp ${saldo.toLocaleString('id-ID')}`);

    return {
      success: true,
      message: 'Transactions seeded successfully',
      transactions: addedTransactions,
      count: addedTransactions.length,
      summary: {
        totalPemasukan,
        totalPengeluaran,
        saldo: totalPemasukan - totalPengeluaran,
      },
    };
  } catch (error) {
    console.error('❌ Error seeding transactions_group:', error);
    throw error;
  }
}

/**
 * Seed transactions for specific kelompok only
 */
export async function seedTransactionsForKelompok(kelompokId: string) {
  try {
    console.log(`🌱 Seeding transactions for kelompok: ${kelompokId}`);

    // Check if this kelompok already has transactions
    const existingTransactions = await getDocs(
      query(collection(db, 'transactions_group'), where('user_id', '==', kelompokId))
    );

    if (existingTransactions.size > 0) {
      console.log(`⚠️  Kelompok ${kelompokId} already has ${existingTransactions.size} transactions.`);
      return {
        success: false,
        message: 'Kelompok already has transactions',
        existingCount: existingTransactions.size,
      };
    }

    // Only YI1u3kHlhahImuJra4CU has predefined transactions
    if (kelompokId !== 'YI1u3kHlhahImuJra4CU') {
      return {
        success: false,
        message: 'No transactions defined for this kelompok',
        count: 0,
      };
    }

    // Call main seed function
    return await seedTransactionsGroup();
  } catch (error) {
    console.error('❌ Error seeding transactions for kelompok:', error);
    throw error;
  }
}

// For direct execution (optional)
if (typeof window === 'undefined' && require.main === module) {
  seedTransactionsGroup()
    .then((result) => {
      console.log('Result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
