import React from 'react';

const NFTCard = ({ nft, view }) => {
  return (
    <div className={`nft-card ${view === 'list' ? 'flex' : ''}`}>
      <img src={nft.image} alt={nft.name} className={`${view === 'list' ? 'w-32' : ''}`} />
      <div className={`nft-card-content ${view === 'list' ? 'ml-4' : ''}`}>
        <h3>{nft.name}</h3>
        <p>Price: {nft.price}</p>
        <p>Duration: {nft.duration} days</p>
      </div>
    </div>
  );
};

export default NFTCard;
