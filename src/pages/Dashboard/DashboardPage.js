import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { initializeEthereum, viewUserListings, getProvider } from '../../ethereum';
import NFTCard from '../../components/NFTCard/NFTCard';

const DashboardPage = () => {
  const [ownedListings, setOwnedListings] = useState([]);

  useEffect(() => {
    const fetchOwnedListings = async () => {
      try {
        await initializeEthereum(); // Initialize Ethereum connection
        const provider = getProvider();
        const signer = provider.getSigner();
        const ownerAddress = await signer.getAddress();
        const listings = await viewUserListings();
        setOwnedListings(listings);
      } catch (error) {
        console.error('Failed to load owned listings:', error);
      }
    };

    fetchOwnedListings();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4">Your Owned Listings</h2>
          {ownedListings.length === 0 ? (
            <div className="text-gray-400">You don't own any NFTs.</div>
          ) : (
            <div className="grid grid-cols-3 gap-4">
              {ownedListings.map((listing) => (
                <NFTCard key={listing.id} nft={{ id: listing.tokenId, name: `NFT ${listing.tokenId}` }} view="grid" />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default DashboardPage;
