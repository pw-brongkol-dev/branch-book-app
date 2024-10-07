'use client';

import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/app/hooks/useFirestore'; // Adjust the import path as necessary
import { Input } from '@/components/ui/input'; // Import Input from shadcn
import { Button } from '@/components/ui/button'; // Import Button from shadcn
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import pattern from '@/app/images/geometry-pattern-rgb.svg';
import Footer from '@/app/components/Footer';

const LoginPage = () => {
  const router = useRouter();
  const { getAllUsers } = useFirestore();
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<{ id: string; name: string }[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [username, setUsername] = useState(''); // Added state for username
  const [isFocused, setIsFocused] = useState(false); // State to track input focus

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const allUsers = await getAllUsers();
        setUsers(allUsers);
        setFilteredUsers(allUsers.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setUsername(inputValue); // Update username state
    setFilteredUsers(users.filter((user) => user.name.toLowerCase().includes(inputValue.toLowerCase())).slice(0, 5));
    setSelectedUserId(null); // Reset selected user ID on input change
  };

  const handleNext = () => {
    if (selectedUserId) {
      localStorage.setItem('user_id_branch_book_app', selectedUserId);
      // Redirect to the next page or perform the next action
      console.log('User ID saved:', selectedUserId);
      router.push('/');
    }
  };

  const handleUserSelect = (user: { id: string; name: string }) => {
    setUsername(user.name);
    setSelectedUserId(user.id);
    setFilteredUsers([]); // Clear filtered users after selection
    setIsFocused(false); // Hide the list after selection
  };

  return (
      <div className="h-full flex flex-col">
        {/* Top 50% section with background pattern and corner radius */}
        <div className="flex-1 flex items-center justify-center relative overflow-hidden min-h-48">
          {/* Background image using next/image */}
          <Image
            src={pattern}
            alt="Background Pattern"
            layout="fill" // Ensures the image covers the entire div
            objectFit="cover" // Makes sure the image fits within the div
            className="z-0"
          />
          <div className="absolute w-full h-8 rounded-t-3xl bg-white bottom-0" />
        </div>
        <div className="flex-none min-h-96 flex flex-col justify-between items-center">
          <div className="p-6 pb-16 w-full">
            {/* Content for the bottom half */}
            <div className="w-full flex flex-col gap-3">
              <h1 className="text-4xl font-inter text-left w-full text-gray-700 mb-8">Masuk</h1>
              <div className="flex flex-col gap-1">
                <label htmlFor="user" className="text-sm font-medium text-gray-700">
                  Nama
                </label>
                <div className="relative h-0 w-full z-50">
                  {isFocused &&
                    filteredUsers.length > 0 && ( // Show list when focused and has filtered users
                      <ul className="absolute bottom-2 w-full border-2 border-violet-700 bg-violet-100/90 backdrop-blur-lg rounded-2xl overflow-hidden">
                        {filteredUsers.map((user) => (
                          <li key={user.id} onClick={() => handleUserSelect(user)} className="cursor-pointer p-2 hover:bg-violet-200 transition-colors">
                            {user.name}
                          </li>
                        ))}
                      </ul>
                    )}
                </div>
                <Input
                  id="user"
                  type="text"
                  placeholder="Masukkan Nama"
                  value={username} // Bind input value to username state
                  onChange={handleInputChange} // Use onChange directly
                  onFocus={() => setIsFocused(true)} // Set focus state to true
                  onBlur={() => {
                    setTimeout(() => {
                      setIsFocused(false);
                    }, 400);
                  }} // Set focus state to false
                  autoComplete="on"
                  className="w-full rounded-2xl border-2 border-gray-500 py-5 text-base"
                />
                
              </div>
              <button
                className="py-1.5 w-full bg-violet-500 hover:bg-violet-700 text-white font-bold rounded-xl disabled:bg-gray-300"
                onClick={handleNext}
                disabled={!selectedUserId}
              >
                Lanjut
              </button>
            </div>
          </div>
          {/* Footer section moved to the bottom */}
          <Footer />
        </div>
      </div>
  );
};

export default LoginPage;
