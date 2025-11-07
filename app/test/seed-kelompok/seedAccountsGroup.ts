import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import { db } from '@/app/db/firebase';

/**
 * Seed Accounts Group ke Firestore
 * Chart of Accounts untuk Kelompok Tani
 */

const accountsGroupData = [
  // ASET LANCAR
  { code: '101', name: 'Kas' },
  { code: '102', name: 'Piutang Usaha' },
  { code: '103', name: 'Persediaan' },
  
  // ASET TETAP
  { code: '111', name: 'Bangunan' },
  { code: '112', name: 'Mesin' },
  { code: '113', name: 'Peralatan' },
  
  // KEWAJIBAN
  { code: '201', name: 'Utang Usaha' },
  { code: '210', name: 'Utang Bank' },
  
  // MODAL
  { code: '301', name: 'Modal Pemilik' },
  { code: '302', name: 'Modal Sumbangan' },
  
  // PENDAPATAN
  { code: '401', name: 'Penjualan' },
  
  // BEBAN/BIAYA
  { code: '501', name: 'Biaya Bahan Baku' },
  { code: '502', name: 'Biaya Listrik dan Air' },
  { code: '503', name: 'Biaya Transportasi' },
  { code: '504', name: 'Gaji Karyawan' },
];

export async function seedAccountsGroup() {
  try {
    console.log('🌱 Starting seeding accounts_group...');

    // Check if collection already has data
    const existingAccounts = await getDocs(query(collection(db, 'accounts_group')));
    
    if (existingAccounts.size > 0) {
      console.log(`⚠️  Warning: accounts_group already has ${existingAccounts.size} documents.`);
      console.log('   Proceeding will add more accounts. Continue? (Y/n)');
      // For auto-run, we'll skip if exists. Remove this check if you want to add anyway.
      console.log('   Skipping seed to prevent duplicates.');
      return {
        success: false,
        message: 'Collection already has data',
        existingCount: existingAccounts.size,
      };
    }

    console.log(`📝 Adding ${accountsGroupData.length} accounts...`);

    const addedAccounts = [];
    for (const account of accountsGroupData) {
      const docRef = await addDoc(collection(db, 'accounts_group'), account);
      addedAccounts.push({ id: docRef.id, ...account });
      console.log(`   ✓ ${account.code} - ${account.name}`);
    }

    console.log('\n✨ Seeding accounts_group completed successfully!');
    console.log(`📊 Total accounts seeded: ${addedAccounts.length}`);

    return {
      success: true,
      message: 'Accounts seeded successfully',
      accounts: addedAccounts,
      count: addedAccounts.length,
    };
  } catch (error) {
    console.error('❌ Error seeding accounts_group:', error);
    throw error;
  }
}

// For direct execution (optional)
if (typeof window === 'undefined' && require.main === module) {
  seedAccountsGroup()
    .then((result) => {
      console.log('Result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
