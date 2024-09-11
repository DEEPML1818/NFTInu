import React, { useState } from 'react';

const Header = () => {
  const [walletAddress, setWalletAddress] = useState(null);

  // Function to connect to the wallet
  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        // Request account access
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setWalletAddress(accounts[0]);
      } else {
        alert('MetaMask is not installed. Please install it to use this feature.');
      }
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    setWalletAddress(null);
  };

  // Function to handle dark mode toggle
  const toggleDarkMode = () => {
    document.body.classList.toggle('dark-mode');
  };

  return (
    <header className="flex justify-between items-center py-4 border-b border-gray-700 bg-gray-900 text-white">
      <div className="text-xl font-bold">NFTInu</div>
      <nav className="space-x-4 flex items-center">
        <a href="/rent" className="hover:text-blue-300">Rent</a>
        <a href="/lease" className="hover:text-blue-300">Lease</a>
        <a href="/dashboard" className="hover:text-blue-300">Dashboard</a>
        {walletAddress ? (
          <div className="flex items-center space-x-4">
            <span className="bg-gray-700 text-white px-4 py-2 rounded">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
            <button
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
        <button
          className="bg-gray-800 text-white p-2 border border-gray-700 rounded hover:bg-gray-700"
          onClick={toggleDarkMode}
        >
          🌙
        </button> {/* Dark Mode Toggle */}
      </nav>
    </header>
  );
};

export default Header;
