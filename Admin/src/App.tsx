import React, { useState, useEffect } from 'react';
import { BrowserProvider, Contract } from 'ethers';
import { Toaster } from 'react-hot-toast';
import { Shield, Users, Vote } from 'lucide-react';
import { Header } from './components/Header';
import { ProposalForm } from './components/ProposalForm';
import { VoterRegistration } from './components/VoterRegistration';
import { contractABI } from './contract/abi';
import { ConnectWallet } from './components/ConnectWallet';
import { ConnectContract } from './components/DeployContract';

function App() {
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [contract, setContract] = useState<Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isOwner, setIsOwner] = useState(false);
  const [contractAddress, setContractAddress] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      if (window.ethereum) {
        const provider = new BrowserProvider(window.ethereum);
        setProvider(provider);
        
        try {
          const accounts = await provider.listAccounts();
          if (accounts[0]) {
            setAccount(accounts[0].address);
          }
        } catch (error) {
          console.error('Error getting accounts:', error);
        }
      }
    };

    init();
  }, []);

  useEffect(() => {
    const checkOwner = async () => {
      if (provider && contractAddress && account) {
        try {
          const contract = new Contract(contractAddress, contractABI, provider);
          setContract(contract);
          const owner = await contract.owner();
          setIsOwner(owner.toLowerCase() === account.toLowerCase());
        } catch (error) {
          console.error('Error checking owner:', error);
          setIsOwner(false);
        }
      }
    };

    checkOwner();
  }, [provider, contractAddress, account]);

  if (!provider) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Please install MetaMask to use this application
            </h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      <Header account={account} isOwner={isOwner} contractAddress={contractAddress} />
      
      {!account ? (
        <ConnectWallet provider={provider} setAccount={setAccount} />
      ) : !contractAddress ? (
        <ConnectContract 
          provider={provider} 
          account={account}
          setContractAddress={setContractAddress}
        />
      ) : !isOwner ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">
              Admin Access Required
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Only the contract owner can access this interface.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Vote className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">
                  Create Proposal
                </h2>
              </div>
              <ProposalForm contract={contract} account={account} />
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center mb-4">
                <Users className="h-6 w-6 text-indigo-600 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">
                  Register Voters
                </h2>
              </div>
              <VoterRegistration contract={contract} account={account} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;