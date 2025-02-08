import React, { useState } from 'react';
import { BrowserProvider } from 'ethers';
import { LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ConnectContractProps {
  provider: BrowserProvider;
  account: string;
  setContractAddress: (address: string) => void;
}

export function ConnectContract({ provider, account, setContractAddress }: ConnectContractProps) {
  const [address, setAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  const connectToContract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.match(/^0x[a-fA-F0-9]{40}$/)) {
      toast.error('Please enter a valid Ethereum address');
      return;
    }

    setIsConnecting(true);
    try {
      setContractAddress(address);
    } catch (error: any) {
      toast.error(error.message || 'Error connecting to contract');
      setContractAddress('');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8">
          <LinkIcon className="mx-auto h-12 w-12 text-indigo-600" />
          <h2 className="mt-2 text-lg font-medium text-gray-900">
            Connect to Voting Contract
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Enter the address of the existing voting contract
          </p>
        </div>
        
        <form onSubmit={connectToContract} className="space-y-4">
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">
              Contract Address
            </label>
            <input
              type="text"
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="0x..."
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              pattern="^0x[a-fA-F0-9]{40}$"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={isConnecting}
            className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {isConnecting ? 'Connecting...' : 'Connect to Contract'}
          </button>
        </form>
      </div>
    </div>
  );
}