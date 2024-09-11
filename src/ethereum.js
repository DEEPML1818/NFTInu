import { Web3Provider } from '@ethersproject/providers'; // Updated import
import { Contract } from 'ethers';
import { formatEther, parseEther } from 'ethers'; // Updated import

// Replace with your contract's ABI and address
const CONTRACT_ABI = [
  [
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        }
      ],
      "name": "borrow",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        },
        {
          "internalType": "uint16",
          "name": "extraDays",
          "type": "uint16"
        }
      ],
      "name": "extendRental",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "LateFeePaid",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "tokenId",
          "type": "uint256"
        },
        {
          "internalType": "address",
          "name": "tokenAddress",
          "type": "address"
        },
        {
          "internalType": "uint16",
          "name": "duration",
          "type": "uint16"
        },
        {
          "internalType": "uint16",
          "name": "dailyInterestRate",
          "type": "uint16"
        },
        {
          "internalType": "uint256",
          "name": "collateralRequired",
          "type": "uint256"
        }
      ],
      "name": "listNFT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        }
      ],
      "name": "ListNFT",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        }
      ],
      "name": "NFTReturned",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        }
      ],
      "name": "payLateFee",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint16",
          "name": "newDuration",
          "type": "uint16"
        }
      ],
      "name": "RentalExtended",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        }
      ],
      "name": "returnNFT",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        }
      ],
      "name": "terminateRental",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "listingId",
          "type": "uint256"
        }
      ],
      "name": "TerminateRental",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "getListingCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "viewAllListings",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "lenderAddress",
              "type": "address"
            },
            {
              "internalType": "uint16",
              "name": "duration",
              "type": "uint16"
            },
            {
              "internalType": "uint16",
              "name": "dailyInterestRate",
              "type": "uint16"
            },
            {
              "internalType": "uint256",
              "name": "collateralRequired",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "address payable",
                  "name": "borrowerAddress",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "rentedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "lateFee",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "renewalCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct NFTInuStorage.Rental",
              "name": "rental",
              "type": "tuple"
            }
          ],
          "internalType": "struct NFTInuStorage.Listing[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "viewOwnedOngoingListingsAndRentals",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "lenderAddress",
              "type": "address"
            },
            {
              "internalType": "uint16",
              "name": "duration",
              "type": "uint16"
            },
            {
              "internalType": "uint16",
              "name": "dailyInterestRate",
              "type": "uint16"
            },
            {
              "internalType": "uint256",
              "name": "collateralRequired",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "address payable",
                  "name": "borrowerAddress",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "rentedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "lateFee",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "renewalCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct NFTInuStorage.Rental",
              "name": "rental",
              "type": "tuple"
            }
          ],
          "internalType": "struct NFTInuStorage.Listing[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "viewRentedListings",
      "outputs": [
        {
          "components": [
            {
              "internalType": "uint256",
              "name": "id",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "tokenId",
              "type": "uint256"
            },
            {
              "internalType": "address",
              "name": "tokenAddress",
              "type": "address"
            },
            {
              "internalType": "address payable",
              "name": "lenderAddress",
              "type": "address"
            },
            {
              "internalType": "uint16",
              "name": "duration",
              "type": "uint16"
            },
            {
              "internalType": "uint16",
              "name": "dailyInterestRate",
              "type": "uint16"
            },
            {
              "internalType": "uint256",
              "name": "collateralRequired",
              "type": "uint256"
            },
            {
              "components": [
                {
                  "internalType": "address payable",
                  "name": "borrowerAddress",
                  "type": "address"
                },
                {
                  "internalType": "uint256",
                  "name": "rentedAt",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "lateFee",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "renewalCount",
                  "type": "uint256"
                }
              ],
              "internalType": "struct NFTInuStorage.Rental",
              "name": "rental",
              "type": "tuple"
            }
          ],
          "internalType": "struct NFTInuStorage.Listing[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]
];
const CONTRACT_ADDRESS = '0x25e615c20FfA82B22Fcf5F8075604118Be62a052';

let provider;
let contract;

// Initialize Ethereum provider and contract
export const initializeEthereum = async () => {
  if (window.ethereum) {
    provider = new Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    contract = new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
  } else {
    console.error('Ethereum provider not found');
  }
};

// Get contract instance
export const getContract = () => {
  return contract;
};

// Get provider instance
export const getProvider = () => {
  return provider;
};

// Load available NFTs
export const loadAvailableNFTs = async () => {
  const contract = getContract();
  if (contract) {
    const nftIds = await contract.getAvailableNFTs();
    return nftIds;
  } else {
    console.error('Contract not initialized');
    return [];
  }
};

// Rent NFT
export const rentNFT = async (nftId, rentPrice, rentDuration) => {
  const contract = getContract();
  if (contract) {
    const tx = await contract.rentNFT(nftId, parseEther(rentPrice.toString()), rentDuration);
    await tx.wait();
    console.log('NFT rented successfully');
  } else {
    console.error('Contract not initialized');
  }
};

// Get user-owned NFTs
export const getUserOwnedNFTs = async (ownerAddress) => {
  const contract = getContract();
  if (contract) {
    const nftIds = await contract.getUserOwnedNFTs(ownerAddress);
    return nftIds;
  } else {
    console.error('Contract not initialized');
    return [];
  }
};


// Get user-leased NFTs (add this function if needed)
export const getUserLeasedNFTs = async (ownerAddress) => {
  const contract = getContract();
  if (contract) {
    try {
      const nftIds = await contract.getUserLeasedNFTs(ownerAddress);
      return nftIds;
    } catch (error) {
      console.error('Error loading user-leased NFTs:', error);
      return [];
    }
  } else {
    console.error('Contract not initialized');
    return [];
  }
};

// Lease NFT
export const leaseNFT = async (nftId, leasePrice, leaseDuration) => {
  const contract = getContract();
  if (contract) {
    try {
      const tx = await contract.leaseNFT(nftId, parseEther(leasePrice.toString()), leaseDuration);
      await tx.wait();
      console.log('NFT leased successfully');
    } catch (error) {
      console.error('Error leasing NFT:', error);
    }
  } else {
    console.error('Contract not initialized');
  }
};

// List NFT
export const listNFT = async (tokenId, tokenAddress, duration, dailyInterestRate, collateralRequired) => {
  const contract = getContract();
  if (contract) {
    const tx = await contract.listNFT(tokenId, tokenAddress, duration, dailyInterestRate, parseEther(collateralRequired.toString()));
    await tx.wait();
    console.log('NFT listed successfully');
  } else {
    console.error('Contract not initialized');
  }
};

// Borrow NFT
export const borrowNFT = async (listingId, payment) => {
  const contract = getContract();
  if (contract) {
    const tx = await contract.borrow(listingId, { value: parseEther(payment.toString()) });
    await tx.wait();
    console.log('NFT borrowed successfully');
  } else {
    console.error('Contract not initialized');
  }
};

// Terminate Rental
export const terminateRental = async (listingId) => {
  const contract = getContract();
  if (contract) {
    const tx = await contract.terminateRental(listingId);
    await tx.wait();
    console.log('Rental terminated successfully');
  } else {
    console.error('Contract not initialized');
  }
};


// Return NFT
export const returnNFT = async (listingId) => {
  const contract = getContract();
  if (contract) {
    const tx = await contract.returnNFT(listingId);
    await tx.wait();
    console.log('NFT returned successfully');
  } else {
    console.error('Contract not initialized');
  }
};

// Pay Late Fee
export const payLateFee = async (listingId, lateFeeAmount) => {
  const contract = getContract();
  if (contract) {
    const tx = await contract.payLateFee(listingId, { value: parseEther(lateFeeAmount.toString()) });
    await tx.wait();
    console.log('Late fee paid successfully');
  } else {
    console.error('Contract not initialized');
  }
};

// Extend Rental
export const extendRental = async (listingId, extraDays, payment) => {
  const contract = getContract();
  if (contract) {
    const tx = await contract.extendRental(listingId, extraDays, { value: parseEther(payment.toString()) });
    await tx.wait();
    console.log('Rental extended successfully');
  } else {
    console.error('Contract not initialized');
  }
};

// View User Listings
export const viewUserListings = async () => {
  const contract = getContract();
  if (contract) {
    const listings = await contract.viewOwnedOngoingListingsAndRentals();
    return listings;
  } else {
    console.error('Contract not initialized');
    return [];
  }
};

// View Rented Listings
export const viewRentedListings = async () => {
  const contract = getContract();
  if (contract) {
    const listings = await contract.viewRentedListings();
    return listings;
  } else {
    console.error('Contract not initialized');
    return [];
  }
};