import { ethers } from 'ethers';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Alert, Container } from 'react-bootstrap';
import LoginService from '../utils/LoginService';
import NFTCardGrid from '../components/NFTCardGrid';
import { isRentalAvailable } from "../utils/common";
import { NFTInuContract } from "../utils/abiManager"
import BorrowModal from '../components/BorrowModal';
import { FetchMetadata } from "../utils/opensea";

function mapKey(token) {
    // Normalize the address for case-sensitive map lookup.
    return `${ethers.utils.getAddress(token.address)}/${token.tokenID}`;
}

function BrowsePage() {
    const [listings, setListings] = useState([]); // array of NFTInu listings returned from contract
    const [metadata, setMetadata] = useState(new Map());   // Map of "address/id" => NFTMetadata
    const [nftList, setNFTList] = useState([]); // array of NFTDisplayable
    const [error, setError] = useState();
    const [borrowModalState, setBorrowModalState] = useState({ isShown: false });
    const [isLoggedIn, setIsLoggedIn] = useState(LoginService.getInstance().isLoggedIn);
    const borrowNFT = useCallback((listing) => {
        setBorrowModalState({ isShown: true, listing: listing });
    }, [setBorrowModalState]);

    const fetchListings = useCallback(() => {
        (async () => {
            const contract = NFTInuContract();
            let fetchedListings = [];
            try {
                fetchedListings = await contract.viewAllListings();
            } catch (e) {
                setError(e.toString());
                return;
            }
            setError(null);
            setListings(fetchedListings.filter(isRentalAvailable));
        })();
    }, [setListings]);

    // fetch metadata
    useEffect(() => {
        // Can't fetch metadata on local network.
        if (LoginService.getInstance().chainName === "Unknown") {
            return;
        }
        const partialMetadata = listings.map(listing => ({
            address: listing.tokenAddress,
            tokenID: listing.tokenId.toString(),
        }));

        FetchMetadata(partialMetadata)
            .then(response => {
                const kvPairs = response.map(metadata => [mapKey(metadata), metadata]);
                setMetadata(new Map(kvPairs));
            })
            .catch(error => console.log(error));
    }, [listings]);

    // render listings
    const renderListings = useCallback(() => {
        if (!LoginService.getInstance().isLoggedIn) {
            setNFTList([]);
            return;
        }
        const walletAddress = ethers.utils.getAddress(LoginService.getInstance().walletAddress);
        setNFTList(listings.map(listing => {
            const card = {
                address: listing.tokenAddress,
                tokenID: listing.tokenId.toString(),
                listingID: listing.id,
                collateral: ethers.utils.formatEther(listing.collateralRequired),
                rentalDuration: listing.duration,
                interestRate: listing.dailyInterestRate,
                actionButtonStyle: 'BORROW',
                // Normalize all addresses to checksummed addresses for comparison.
                actionButtonDisabled: ethers.utils.getAddress(listing.lenderAddress) === walletAddress,
                didClickActionButton: () => borrowNFT(listing),
            };

            if (LoginService.getInstance().chainName === "Unknown") {
                // Add placeholder metadata for local network tokens.
                card.name = `Katsu #${listing.tokenId.toString()}`;
                card.contractName = "Chicken Katsu";
                card.imageURI = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22232%22%20height%3D%22131%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20232%20131%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_17e704e3109%20text%20%7B%20fill%3A%2380b480%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A12pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_17e704e3109%22%3E%3Crect%20width%3D%22232%22%20height%3D%22131%22%20fill%3D%22%23a1e1a1%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2284.85546875%22%20y%3D%2270.9%22%3E232x131%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E';
            } else {
                const tokenMetadata = metadata.get(mapKey(card));
                if (tokenMetadata) {
                    card.name = tokenMetadata.name;
                    card.contractName = tokenMetadata.contractName;
                    card.imageURI = tokenMetadata.imageURI;
                }
            }
            return card;
        }));
    }, [listings, metadata, borrowNFT]);
    useEffect(renderListings, [renderListings]);

    const onLogin = useCallback(() => {
        setIsLoggedIn(true);
        fetchListings();
    }, [setIsLoggedIn, fetchListings]);
    // Listen to login service events. This will get run multiple times and can't be only run one-time.
    useEffect(() => {
        LoginService.getInstance().onLogin(onLogin);
        LoginService.getInstance().onAccountsChanged(renderListings);
        LoginService.getInstance().onChainChanged(fetchListings);
        return () => {
            LoginService.getInstance().detachLoginObserver(onLogin);
            LoginService.getInstance().detachAccountsChangedObserver(renderListings);
            LoginService.getInstance().detachChainChangedObserver(fetchListings);
        };
    }, [fetchListings, renderListings, onLogin]);

    // One-time Effects
    const didRunOneTimeEffectRef = useRef(false);
    useEffect(() => {
        if (didRunOneTimeEffectRef.current) { return; }
        didRunOneTimeEffectRef.current = true;
        LoginService.getInstance().maybeLogin()
            .then(didLoginSuccessfully => {
                setIsLoggedIn(didLoginSuccessfully);
                if (!didLoginSuccessfully) { return; }
                fetchListings();
            });
    });

    const closeBorrowModal = useCallback((didBorrow) => {
        setBorrowModalState({ isShown: false });
        if (didBorrow) {
            fetchListings();
        }
    }, [setBorrowModalState, fetchListings]);

    if (!isLoggedIn) {
        return (<Alert variant="warning">Connect Your Wallet</Alert>);
    }

    if (error) {
        return (<Alert variant="danger">{error}</Alert>);
    }

    if (nftList.length) {
        return (<Container>
            <NFTCardGrid data={nftList} />
            {borrowModalState.isShown &&
                <BorrowModal
                    isShown={borrowModalState.isShown}
                    listing={borrowModalState.listing}
                    onShouldClose={closeBorrowModal} />}
        </Container>)
    } else {
        return (<Alert variant="primary">No listings available</Alert>);
    }
}

export default BrowsePage;
