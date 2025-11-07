import { collection, addDoc, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '@/app/db/firebase';

/**
 * Seed Products Group ke Firestore
 * Produk-produk untuk Kelompok Tani
 */

const productsGroupData = [
  // Products for user_id: YI1u3kHlhahImuJra4CU
  { user_id: 'YI1u3kHlhahImuJra4CU', name: 'Permen' },
  { user_id: 'YI1u3kHlhahImuJra4CU', name: 'Gelato' },
  { user_id: 'YI1u3kHlhahImuJra4CU', name: 'Es Lilin' },
  
  // Products for user_id: n9f70T8INZro5HdmvfDx
  { user_id: 'n9f70T8INZro5HdmvfDx', name: 'Gantungan Kunci' },
];

export async function seedProductsGroup() {
  try {
    console.log('🌱 Starting seeding products_group...');

    // Check if collection already has data
    const existingProducts = await getDocs(query(collection(db, 'products_group')));
    
    if (existingProducts.size > 0) {
      console.log(`⚠️  Warning: products_group already has ${existingProducts.size} documents.`);
      console.log('   Proceeding will add more products. Continue? (Y/n)');
      // For auto-run, we'll skip if exists. Remove this check if you want to add anyway.
      console.log('   Skipping seed to prevent duplicates.');
      return {
        success: false,
        message: 'Collection already has data',
        existingCount: existingProducts.size,
      };
    }

    console.log(`📝 Adding ${productsGroupData.length} products...`);

    const addedProducts = [];
    for (const product of productsGroupData) {
      const docRef = await addDoc(collection(db, 'products_group'), {
        ...product,
        created_at: Timestamp.now(),
      });
      addedProducts.push({ id: docRef.id, ...product });
      console.log(`   ✓ ${product.name} (Kelompok: ${product.user_id})`);
    }

    console.log('\n✨ Seeding products_group completed successfully!');
    console.log(`📊 Total products seeded: ${addedProducts.length}`);

    // Group by user_id for summary
    const groupedByUser = addedProducts.reduce((acc, product) => {
      if (!acc[product.user_id]) {
        acc[product.user_id] = [];
      }
      acc[product.user_id].push(product.name);
      return acc;
    }, {} as Record<string, string[]>);

    console.log('\n📋 Summary by Kelompok:');
    Object.entries(groupedByUser).forEach(([userId, products]) => {
      console.log(`   Kelompok ${userId}:`);
      (products as string[]).forEach(name => console.log(`      - ${name}`));
    });

    return {
      success: true,
      message: 'Products seeded successfully',
      products: addedProducts,
      count: addedProducts.length,
      byKelompok: groupedByUser,
    };
  } catch (error) {
    console.error('❌ Error seeding products_group:', error);
    throw error;
  }
}

/**
 * Seed products for specific kelompok only
 */
export async function seedProductsForKelompok(kelompokId: string) {
  try {
    console.log(`🌱 Seeding products for kelompok: ${kelompokId}`);

    // Check if this kelompok already has products
    const existingProducts = await getDocs(
      query(collection(db, 'products_group'), where('user_id', '==', kelompokId))
    );

    if (existingProducts.size > 0) {
      console.log(`⚠️  Kelompok ${kelompokId} already has ${existingProducts.size} products.`);
      return {
        success: false,
        message: 'Kelompok already has products',
        existingCount: existingProducts.size,
      };
    }

    // Filter products for this kelompok
    const kelompokProducts = productsGroupData.filter(p => p.user_id === kelompokId);

    if (kelompokProducts.length === 0) {
      console.log(`ℹ️  No products defined for kelompok ${kelompokId}`);
      return {
        success: false,
        message: 'No products defined for this kelompok',
        count: 0,
      };
    }

    console.log(`📝 Adding ${kelompokProducts.length} products...`);

    const addedProducts = [];
    for (const product of kelompokProducts) {
      const docRef = await addDoc(collection(db, 'products_group'), {
        ...product,
        created_at: Timestamp.now(),
      });
      addedProducts.push({ id: docRef.id, ...product });
      console.log(`   ✓ ${product.name}`);
    }

    console.log(`✨ Seeded ${addedProducts.length} products for kelompok ${kelompokId}`);

    return {
      success: true,
      message: 'Products seeded successfully',
      products: addedProducts,
      count: addedProducts.length,
    };
  } catch (error) {
    console.error('❌ Error seeding products for kelompok:', error);
    throw error;
  }
}

// For direct execution (optional)
if (typeof window === 'undefined' && require.main === module) {
  seedProductsGroup()
    .then((result) => {
      console.log('Result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
