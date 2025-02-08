import React, { useState } from 'react';
import { Contract, BrowserProvider } from 'ethers';
import toast from 'react-hot-toast';

interface VoterRegistrationProps {
  contract: Contract | null;
  account: string;
}

export function VoterRegistration({ contract, account }: VoterRegistrationProps) {
  const [voterAddress, setVoterAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract || !window.ethereum) return;

    setIsSubmitting(true);
    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contractWithSigner = contract.connect(signer);
      
      const tx = await contractWithSigner.registerVoter(voterAddress);
      toast.loading('Registering voter...', { id: tx.hash });
      await tx.wait();
      toast.success('Voter registered successfully!', { id: tx.hash });
      setVoterAddress('');
    } catch (error: any) {
      toast.error(error.message || 'Error registering voter');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Voter Address
        </label>
        <input
          type="text"
          id="address"
          value={voterAddress}
          onChange={(e) => setVoterAddress(e.target.value)}
          placeholder="0x..."
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          required
          pattern="^0x[a-fA-F0-9]{40}$"
          title="Please enter a valid Ethereum address"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isSubmitting ? 'Registering...' : 'Register Voter'}
      </button>
    </form>
  );
}