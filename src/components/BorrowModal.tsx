import { ethers } from 'ethers';
import { Alert, Modal, Button } from 'react-bootstrap';
import { useState } from 'react';
import { Listing } from "../utils/common";
import { NFTInuContract } from "../utils/abiManager"

interface Props {
    listing: Listing,
    isShown: boolean,
    onShouldClose: (didBorrow: boolean) => void,
}

function calculatePayment(listing: Listing) {
    const interest = listing.collateralRequired.mul(listing.dailyInterestRate * listing.duration).div(100);
    return listing.collateralRequired.add(interest);
}

function BorrowModal(props: Props) {
    const [shouldDisableBorrowButton, setShouldDisableBorrowButton] = useState(false);
    const [error, setError] = useState(null);

    const paymentAmount = calculatePayment(props.listing);

    const didClickBorrowButton = () => {
        const contract = NFTInuContract();
        setShouldDisableBorrowButton(true);
        setError(null);

        contract.borrow(
            props.listing.id,
            { value: paymentAmount }
        ).then((response: any) => {
            console.log("response", response);
            // ... close the dialog and wait for transaction to be mined into a block ...
            props.onShouldClose(true);
        }).catch((error: any) => {
            console.log(error);
            setShouldDisableBorrowButton(false);
            setError(error.data.message);
        });
    };

    const didClickCloseButton = () => {
        props.onShouldClose(false);
    };

    let errorMessage;
    if (error) {
        errorMessage = (<Alert variant="danger">{error}</Alert>);
    }
    return (
        <Modal show={props.isShown}>
            <Modal.Dialog style={{ width: '100%', marginTop: 0, marginBottom: 0 }}>
                <Modal.Header>
                    <Modal.Title>List NFT for Lending</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Total payment is {ethers.utils.formatEther(paymentAmount)} ETH.
                    {errorMessage}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={didClickCloseButton}>Close</Button>
                    <Button variant="success" onClick={didClickBorrowButton} disabled={shouldDisableBorrowButton}>Borrow</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Modal>
    );
}

export default BorrowModal;
