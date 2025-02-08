import React from 'react';
import { Vote } from 'lucide-react';

interface HeaderProps {
  account: string;
  isOwner: boolean;
  contractAddress: string;
}

export function Header({ account, isOwner, contractAddress }: HeaderProps) {
  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Vote className="h-8 w-8 text-indigo-600" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">
              Voting System Admin
            </h1>
          </div>
          
          <div className="flex flex-col items-end space-y-2">
            {contractAddress && (
              <span className="text-sm text-gray-500">
                Contract: {`${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`}
              </span>
            )}
            {account && (
              <span className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg">
                {isOwner && <span className="mr-2 text-indigo-600">Admin</span>}
                {`${account.slice(0, 6)}...${account.slice(-4)}`}
              </span>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}