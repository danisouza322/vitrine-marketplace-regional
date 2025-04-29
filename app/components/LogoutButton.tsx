'use client';

import { signOut } from 'next-auth/react';
import { BsDoorOpen } from 'react-icons/bs';

export default function LogoutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/login' })}
      className="flex items-center text-sm text-red-600 hover:text-red-800"
    >
      <BsDoorOpen className="mr-1 h-4 w-4" />
      <span>Sair</span>
    </button>
  );
} 