import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import NFTCard from '../../components/NFTCard/NFTCard';
import { loadAvailableNFTs, rentNFT } from '../../ethereum';

const RentPage = () => {
  const [view, setView] = useState('grid');
  const [nfts, setNfts] = useState([]);

  useEffect(() => {
    const fetchNFTs = async () => {
      try {
        const availableNFTs = await loadAvailableNFTs();
        setNfts(availableNFTs);
      } catch (error) {
        console.error('Failed to load NFTs:', error);
      }
    };

    fetchNFTs();
  }, []);

  const handleRent = async (nftId, rentPrice, rentDuration) => {
    try {
      await rentNFT(nftId, rentPrice, rentDuration);
      // Refresh the NFT list after successful rental
      const availableNFTs = await loadAvailableNFTs();
      setNfts(availableNFTs);
    } catch (error) {
      console.error('Error renting NFT:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* Filters & Sorting */}
        <section className="flex justify-between items-center py-4">
          <div className="flex space-x-4">
            <select className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white">
              <option>Filter by Contract</option>
            </select>
            <select className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white">
              <option>Filter by Currency</option>
            </select>
            <select className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white">
              <option>Sort by</option>
            </select>
          </div>

          <div className="flex space-x-2">
            <button onClick={() => setView('grid')} className={`p-2 ${view === 'grid' ? 'bg-blue-600' : 'bg-gray-700'}`}>
              Grid View
            </button>
            <button onClick={() => setView('list')} className={`p-2 ${view === 'list' ? 'bg-blue-600' : 'bg-gray-700'}`}>
              List View
            </button>
          </div>
        </section>

        {/* NFT Display */}
        <section>
          {nfts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p>0 items</p>
              <p>No NFTs available for rent</p>
            </div>
          ) : (
            <div className={`grid ${view === 'grid' ? 'grid-cols-3' : 'grid-cols-1'} gap-4`}>
              {nfts.map((nft) => (
                <NFTCard
                  key={nft.id}
                  nft={nft}
                  view={view}
                  onRent={() => handleRent(nft.id, nft.rentPrice, nft.rentDuration)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default RentPage;
