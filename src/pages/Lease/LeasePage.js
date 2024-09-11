import React, { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import { getUserOwnedNFTs, getProvider, listNFT, borrowNFT, returnNFT, payLateFee, extendRental } from '../../ethereum';
import NFTCard from '../../components/NFTCard/NFTCard';

const LeasePage = () => {
  const [ownedNfts, setOwnedNfts] = useState([]);
  const [formValues, setFormValues] = useState({
    tokenId: '',
    tokenAddress: '',
    duration: '',
    dailyInterestRate: '',
    collateralRequired: '',
    listingId: '',
    paymentAmount: '',
    lateFeeAmount: '',
    extraDays: '',
  });

  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      try {
        const provider = getProvider();
        const signer = provider.getSigner();
        const ownerAddress = await signer.getAddress();
        const nftIds = await getUserOwnedNFTs(ownerAddress);
        setOwnedNfts(nftIds);
      } catch (error) {
        console.error('Failed to load owned NFTs:', error);
      }
    };

    fetchOwnedNFTs();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleListSubmit = async (e) => {
    e.preventDefault();
    try {
      await listNFT(
        formValues.tokenId,
        formValues.tokenAddress,
        parseInt(formValues.duration),
        parseInt(formValues.dailyInterestRate),
        parseFloat(formValues.collateralRequired)
      );
      alert('NFT listed successfully');
    } catch (error) {
      console.error('Failed to list NFT:', error);
    }
  };

  const handleBorrowSubmit = async (e) => {
    e.preventDefault();
    try {
      await borrowNFT(formValues.listingId, formValues.paymentAmount);
      alert('NFT borrowed successfully');
    } catch (error) {
      console.error('Failed to borrow NFT:', error);
    }
  };

  const handleReturnSubmit = async (e) => {
    e.preventDefault();
    try {
      await returnNFT(formValues.listingId);
      alert('NFT returned successfully');
    } catch (error) {
      console.error('Failed to return NFT:', error);
    }
  };

  const handlePayLateFeeSubmit = async (e) => {
    e.preventDefault();
    try {
      await payLateFee(formValues.listingId, formValues.lateFeeAmount);
      alert('Late fee paid successfully');
    } catch (error) {
      console.error('Failed to pay late fee:', error);
    }
  };

  const handleExtendRentalSubmit = async (e) => {
    e.preventDefault();
    try {
      await extendRental(formValues.listingId, parseInt(formValues.extraDays));
      alert('Rental extended successfully');
    } catch (error) {
      console.error('Failed to extend rental:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-800 text-white">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        {/* List NFT Form */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4">List Your NFT</h2>
          <form onSubmit={handleListSubmit} className="space-y-4">
            <div>
              <label htmlFor="tokenId" className="block text-gray-400">Token ID</label>
              <input
                type="number"
                id="tokenId"
                name="tokenId"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.tokenId}
              />
            </div>

            <div>
              <label htmlFor="tokenAddress" className="block text-gray-400">Token Address</label>
              <input
                type="text"
                id="tokenAddress"
                name="tokenAddress"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.tokenAddress}
              />
            </div>

            <div>
              <label htmlFor="duration" className="block text-gray-400">Duration (days)</label>
              <input
                type="number"
                id="duration"
                name="duration"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.duration}
              />
            </div>

            <div>
              <label htmlFor="dailyInterestRate" className="block text-gray-400">Daily Interest Rate</label>
              <input
                type="number"
                id="dailyInterestRate"
                name="dailyInterestRate"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.dailyInterestRate}
              />
            </div>

            <div>
              <label htmlFor="collateralRequired" className="block text-gray-400">Collateral Required</label>
              <input
                type="number"
                id="collateralRequired"
                name="collateralRequired"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.collateralRequired}
              />
            </div>

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              List NFT
            </button>
          </form>
        </section>

        {/* Borrow NFT Form */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4">Borrow an NFT</h2>
          <form onSubmit={handleBorrowSubmit} className="space-y-4">
            <div>
              <label htmlFor="listingId" className="block text-gray-400">Listing ID</label>
              <input
                type="number"
                id="listingId"
                name="listingId"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.listingId}
              />
            </div>

            <div>
              <label htmlFor="paymentAmount" className="block text-gray-400">Payment Amount</label>
              <input
                type="number"
                id="paymentAmount"
                name="paymentAmount"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.paymentAmount}
              />
            </div>

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Borrow NFT
            </button>
          </form>
        </section>

        {/* Return NFT Form */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4">Return an NFT</h2>
          <form onSubmit={handleReturnSubmit} className="space-y-4">
            <div>
              <label htmlFor="listingId" className="block text-gray-400">Listing ID</label>
              <input
                type="number"
                id="listingId"
                name="listingId"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.listingId}
              />
            </div>

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Return NFT
            </button>
          </form>
        </section>

        {/* Pay Late Fee Form */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4">Pay Late Fee</h2>
          <form onSubmit={handlePayLateFeeSubmit} className="space-y-4">
            <div>
              <label htmlFor="listingId" className="block text-gray-400">Listing ID</label>
              <input
                type="number"
                id="listingId"
                name="listingId"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.listingId}
              />
            </div>

            <div>
              <label htmlFor="lateFeeAmount" className="block text-gray-400">Late Fee Amount</label>
              <input
                type="number"
                id="lateFeeAmount"
                name="lateFeeAmount"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.lateFeeAmount}
              />
            </div>

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Pay Late Fee
            </button>
          </form>
        </section>

        {/* Extend Rental Form */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4">Extend Rental</h2>
          <form onSubmit={handleExtendRentalSubmit} className="space-y-4">
            <div>
              <label htmlFor="listingId" className="block text-gray-400">Listing ID</label>
              <input
                type="number"
                id="listingId"
                name="listingId"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.listingId}
              />
            </div>

            <div>
              <label htmlFor="extraDays" className="block text-gray-400">Extra Days</label>
              <input
                type="number"
                id="extraDays"
                name="extraDays"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.extraDays}
              />
            </div>

            <div>
              <label htmlFor="paymentAmount" className="block text-gray-400">Payment Amount</label>
              <input
                type="number"
                id="paymentAmount"
                name="paymentAmount"
                className="border border-gray-700 px-4 py-2 rounded bg-gray-900 text-white"
                onChange={handleInputChange}
                value={formValues.paymentAmount}
              />
            </div>

            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              Extend Rental
            </button>
          </form>
        </section>

        {/* Display Owned NFTs */}
        <section className="py-8">
          <h2 className="text-2xl font-bold mb-4">Your Owned NFTs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownedNfts.map((nft, index) => (
              <NFTCard key={index} nft={nft} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default LeasePage;
