'use client';

import { useState } from 'react';
import { useFirestore } from '@/app/hooks/useFirestore';
import { accountsGroupSeedData, createKelompokUser, sampleKelompokData, sampleProductsData } from './seedKelompokData';
import { Timestamp } from 'firebase/firestore';
import BackButton from '@/app/components/BackButton';
import { seedAccountsGroup } from './seedAccountsGroup';
import { seedProductsGroup } from './seedProductsGroup';
import { seedTransactionsGroup } from './seedTransactionsGroup';

export default function SeedKelompokPage() {
  const [status, setStatus] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [kelompokId, setKelompokId] = useState<string>('');

  const { addUser, addAccountGroup, addProductGroup, getAllUsers } = useFirestore();

  // Step 1: Seed Accounts Group (Chart of Accounts)
  const handleSeedAccountsGroup = async () => {
    try {
      setLoading(true);
      setStatus('Seeding accounts group...');

      const result = await seedAccountsGroup();
      
      if (result.success) {
        setStatus(`✅ Successfully seeded ${result.count} accounts!`);
      } else {
        setStatus(`⚠️ ${result.message} (${result.existingCount} existing)`);
      }
      
      setLoading(false);
    } catch (error: any) {
      console.error('Error seeding accounts:', error);
      setStatus('❌ Error seeding accounts: ' + error.message);
      setLoading(false);
    }
  };

  // Step 2: Seed Products Group
  const handleSeedProductsGroup = async () => {
    try {
      setLoading(true);
      setStatus('Seeding products group...');

      const result = await seedProductsGroup();
      
      if (result.success) {
        setStatus(`✅ Successfully seeded ${result.count} products!\n\nBy Kelompok:\n${Object.entries(result.byKelompok || {}).map(([id, products]) => `- ${id}: ${(products as string[]).join(', ')}`).join('\n')}`);
      } else {
        setStatus(`⚠️ ${result.message} (${result.existingCount} existing)`);
      }
      
      setLoading(false);
    } catch (error: any) {
      console.error('Error seeding products:', error);
      setStatus('❌ Error seeding products: ' + error.message);
      setLoading(false);
    }
  };

  // Step 3: Seed Transactions Group
  const handleSeedTransactionsGroup = async () => {
    try {
      setLoading(true);
      setStatus('Seeding transactions group...');

      const result = await seedTransactionsGroup();
      
      if (result.success) {
        const summary = result.summary || { totalPemasukan: 0, totalPengeluaran: 0, saldo: 0 };
        setStatus(
          `✅ Successfully seeded ${result.count} transactions!\n\n` +
          `💰 Summary:\n` +
          `Total Pemasukan: Rp ${summary.totalPemasukan.toLocaleString('id-ID')}\n` +
          `Total Pengeluaran: Rp ${summary.totalPengeluaran.toLocaleString('id-ID')}\n` +
          `Saldo: Rp ${summary.saldo.toLocaleString('id-ID')}`
        );
      } else {
        setStatus(`⚠️ ${result.message}${result.existingCount ? ` (${result.existingCount} existing)` : ''}`);
      }
      
      setLoading(false);
    } catch (error: any) {
      console.error('Error seeding transactions:', error);
      setStatus('❌ Error seeding transactions: ' + error.message);
      setLoading(false);
    }
  };

  // Step 2: Create Kelompok User
  const handleCreateKelompok = async () => {
    try {
      setLoading(true);
      setStatus('Creating kelompok...');

      const kelompokData = createKelompokUser(sampleKelompokData[0].name);
      const id = await addUser(kelompokData);

      setKelompokId(id);
      setStatus(`✅ Kelompok created with ID: ${id}`);
      setLoading(false);
    } catch (error) {
      console.error('Error creating kelompok:', error);
      setStatus('❌ Error creating kelompok: ' + error.message);
      setLoading(false);
    }
  };

  // Step 3: Seed Sample Products
  const handleSeedProducts = async () => {
    if (!kelompokId) {
      setStatus('⚠️ Please create kelompok first!');
      return;
    }

    try {
      setLoading(true);
      setStatus('Seeding products...');

      const products = sampleProductsData(kelompokId);

      for (const product of products) {
        await addProductGroup({
          ...product,
          created_at: Timestamp.now(),
        });
      }

      setStatus(`✅ Successfully seeded ${products.length} products!`);
      setLoading(false);
    } catch (error) {
      console.error('Error seeding products:', error);
      setStatus('❌ Error seeding products: ' + error.message);
      setLoading(false);
    }
  };

  // Step 4: Assign User to Kelompok
  const handleAssignUserToKelompok = async () => {
    if (!kelompokId) {
      setStatus('⚠️ Please create kelompok first!');
      return;
    }

    try {
      setLoading(true);
      setStatus('Checking users...');

      const currentUserId = localStorage.getItem('user_id_branch_book_app');
      if (!currentUserId) {
        setStatus('❌ No user logged in!');
        setLoading(false);
        return;
      }

      // Note: You need to add updateUser method if not exists
      // For now, just show the instruction
      setStatus(
        `ℹ️ To assign current user to kelompok, run this in Firestore:\n` +
          `Update user ${currentUserId} with group_id: ${kelompokId}`
      );
      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setStatus('❌ Error: ' + error.message);
      setLoading(false);
    }
  };

  // List all kelompok users
  const handleListKelompok = async () => {
    try {
      setLoading(true);
      setStatus('Fetching kelompok...');

      const allUsers = await getAllUsers();
      const kelompokUsers = allUsers.filter((user) => user.is_group === true);

      if (kelompokUsers.length === 0) {
        setStatus('ℹ️ No kelompok found.');
      } else {
        const kelompokList = kelompokUsers.map((k) => `- ${k.name} (ID: ${k.id})`).join('\n');
        setStatus(`📋 Kelompok List:\n${kelompokList}`);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error:', error);
      setStatus('❌ Error: ' + error.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6">
      <BackButton color="violet" />

      <div className="max-w-2xl mx-auto mt-8">
        <h1 className="text-3xl font-bold mb-6">Seed Data Kelompok</h1>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <h2 className="font-semibold text-yellow-800 mb-2">⚠️ Instructions:</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm text-yellow-700">
            <li>Seed Accounts Group (Chart of Accounts) - Run once</li>
            <li>Seed Products Group - Adds products for existing kelompok</li>
            <li>Seed Transactions Group - Adds sample transactions (3 items)</li>
            <li>Create Kelompok User - Creates a kelompok (optional)</li>
            <li>Seed Sample Products - Creates sample products for the kelompok (optional)</li>
          </ol>
        </div>

        <div className="space-y-4">
          <div className="flex gap-2">
            <button
              onClick={handleSeedAccountsGroup}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 text-sm"
            >
              1. Seed Accounts
            </button>

            <button
              onClick={handleSeedProductsGroup}
              disabled={loading}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 disabled:bg-gray-300 text-sm"
            >
              2. Seed Products
            </button>

            <button
              onClick={handleSeedTransactionsGroup}
              disabled={loading}
              className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:bg-gray-300 text-sm"
            >
              3. Seed Transactions
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCreateKelompok}
              disabled={loading}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-300 text-sm"
            >
              4. Create Kelompok
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSeedProducts}
              disabled={loading || !kelompokId}
              className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:bg-gray-300 text-sm"
            >
              5. Seed Sample Products
            </button>

            <button
              onClick={handleListKelompok}
              disabled={loading}
              className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 disabled:bg-gray-300 text-sm"
            >
              List Kelompok
            </button>
          </div>

          {kelompokId && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-700">
                <strong>Created Kelompok ID:</strong> {kelompokId}
              </p>
              <p className="text-xs text-green-600 mt-2">
                Copy this ID to update your user's group_id in Firestore Console
              </p>
            </div>
          )}

          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
            <h3 className="font-semibold mb-2">Status:</h3>
            <pre className="text-sm whitespace-pre-wrap">{status || 'Ready to seed...'}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}
