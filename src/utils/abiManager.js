import { ethers } from 'ethers';
import Avalanche_abis from '../abis/avalanche'
import erc721_abi from '../abis/ERC721.json'
import LoginService from './LoginService';

function getABIDirectory() {
  const DirectoryByChainID = {

    "43113": Avalanche_abis,
  };
  const jsonFiles = DirectoryByChainID[LoginService.getInstance().chainId];
  if (jsonFiles !== undefined) {
    return jsonFiles
  }
  
}

function NFTInu() {
  return getABIDirectory().NFTInu;
}

function contractAddress() {
  return getABIDirectory().contractAddress;
}

function FakeNFT() {
  return getABIDirectory().FakeNFT;
}

function ERC721_ABI() {
  return erc721_abi;
}

function NFTInuContract() {
  return new ethers.Contract(contractAddress().NFTInu,
    NFTInu().abi,
    LoginService.getInstance().signer);
}

function FakeNFTContract() {
  return new ethers.Contract(contractAddress().FakeNFT,
    FakeNFT().abi,
    LoginService.getInstance().signer);
}

function ERC721Contract(address) {
  return new ethers.Contract(address,
    ERC721_ABI(),
    LoginService.getInstance().signer);
}

function getLoginServiceProvider() {
  return LoginService.getInstance().provider;
}

export { NFTInuContract, FakeNFTContract, getLoginServiceProvider, ERC721Contract };
