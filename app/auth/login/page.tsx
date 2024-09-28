'use client';

import React, { useEffect, useState } from 'react';
import { useFirestore } from '@/app/hooks/useFirestore'; // Adjust the import path as necessary
import { Input } from '@/components/ui/input'; // Import Input from shadcn
import { Button } from '@/components/ui/button'; // Import Button from shadcn
import { useRouter } from 'next/navigation';

const LoginPage = () => {
	const router = useRouter()
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
			router.push("/")
    }
  };

  const handleUserSelect = (user: { id: string; name: string }) => {
    setUsername(user.name);
    setSelectedUserId(user.id);
    setFilteredUsers([]); // Clear filtered users after selection
    setIsFocused(false); // Hide the list after selection
  };

  return (
    <div className="p-5 h-dvh flex flex-col justify-between">
			<div>
				<h2>Halo</h2>
			</div>
      <div className='w-full'>
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
        <Button className='w-full' onClick={handleNext} disabled={!selectedUserId}>
          Lanjut
        </Button>
      </div>
			<div></div>
    </div>
  );
};

export default LoginPage;
