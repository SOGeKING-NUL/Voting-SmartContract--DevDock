import React from 'react';
import { BrowserProvider } from 'ethers';
import { Wallet } from 'lucide-react';

interface ConnectWalletProps {
  provider: BrowserProvider;
  setAccount: (account: string) => void;
}

export function ConnectWallet({ provider, setAccount }: ConnectWalletProps) {
  const connectWallet = async () => {
    try {
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
    } catch (error) {
      console.error('Error connecting wallet:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <Wallet className="mx-auto h-12 w-12 text-gray-400" />
        <h2 className="mt-2 text-lg font-medium text-gray-900">
          Connect Your Wallet
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Connect your wallet to access the admin interface
        </p>
        <div className="mt-6">
          <button
            onClick={connectWallet}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    </div>
  );
}