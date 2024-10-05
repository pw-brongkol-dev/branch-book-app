'use client';

import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/app/hooks/useFirestore'; // Adjust the import path as necessary
import { Input } from '@/components/ui/input'; // Import Input from shadcn
import { Button } from '@/components/ui/button'; // Import Button from shadcn
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import pattern from '@/app/images/geometry-pattern-rgb.svg';

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
      router.push("/");
    }
  };

  const handleUserSelect = (user: { id: string; name: string }) => {
    setUsername(user.name);
    setSelectedUserId(user.id);
    setFilteredUsers([]); // Clear filtered users after selection
    setIsFocused(false); // Hide the list after selection
  };

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-200">
      <div className="w-[375px] h-[812px] bg-white rounded-lg">
        {/* Top 50% section with background pattern and corner radius */}
        <div className="h-1/2 flex items-center justify-center border-b border-gray-300 relative overflow-hidden">
          {/* Background image using next/image */}
          <Image
            src={pattern}
            alt="Background Pattern"
            layout="fill" // Ensures the image covers the entire div
            objectFit="cover" // Makes sure the image fits within the div
            className="z-0"
          />
        </div>
        <div className="h-1/2 flex flex-col justify-between items-center">
          <div className='p-4 w-full'>
            {/* Content for the bottom half */}
            <div className="w-full">
              <h1 className="text-[40px] font-inter mb-10 text-left w-full">Masuk</h1>
              <label htmlFor="user" className="text-sm">
                Nama
              </label>
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
                  }, 100);
                }} // Set focus state to false
                autoComplete="on"
                className="w-full rounded-[16px] py-2.5 mt-2"
              />
              <div className="relative h-2 w-full z-50">
                {isFocused &&
                  filteredUsers.length > 0 && ( // Show list when focused and has filtered users
                    <ul className="absolute w-full mt-2 border border-gray-300 bg-white rounded-md shadow-lg">
                      {filteredUsers.map((user) => (
                        <li key={user.id} onClick={() => handleUserSelect(user)} className="cursor-pointer p-2 hover:bg-gray-200 transition-colors">
                          {user.name}
                        </li>
                      ))}
                    </ul>
                  )}
              </div>
              <button
                className="py-2.5 w-full mt-4 bg-[#9465FF] text-white rounded-[28px]"
                onClick={handleNext}
                disabled={!selectedUserId}
              >
                Lanjut
              </button>
            </div>
          </div>
          {/* Footer section moved to the bottom */}
          <div className="h-20 w-full text-center bg-[#EAEAEA] flex flex-col align-items-center justify-center">
            <p className="text-gray-600 text-xs">Aplikasi PW Brongkol DRTPM v1.0.0</p>
            <p className="text-gray-600 text-xs">
              Developed by{' '}
              <a href="#" className="text-blue-600 underline text-xs">
                Embun Dev Team
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
