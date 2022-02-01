import { Button, Navbar, Badge } from 'react-bootstrap';
import { useEffect, useState, useRef } from 'react';

import LoginService from '../utils/LoginService';

function Login() {
    const [walletAddress, setWalletAddress] = useState(LoginService.getInstance().walletAddress);
    const [chainName, setChainName] = useState(LoginService.getInstance().chainName);
    const changeWalletAddress = () => {
        setWalletAddress(LoginService.getInstance().walletAddress);
        setChainName(LoginService.getInstance().chainName);
    };
    const onChainChange = () => {
        setChainName(LoginService.getInstance().chainName);
    };

    useEffect(() => {
        LoginService.getInstance().onLogin(changeWalletAddress);
        LoginService.getInstance().onAccountsChanged(changeWalletAddress);
        LoginService.getInstance().onChainChanged(onChainChange);
        return () => {
            LoginService.getInstance().detachLoginObserver(changeWalletAddress);
            LoginService.getInstance().detachAccountsChangedObserver(changeWalletAddress);
            LoginService.getInstance().detachChainChangedObserver(onChainChange);
        }
    }, []);

    // One-time Effects
    const didRunOneTimeEffectRef = useRef(false);
    useEffect(() => {
        if (didRunOneTimeEffectRef.current) { return; }
        didRunOneTimeEffectRef.current = true;
        LoginService.getInstance().maybeLogin()
            .then(didLoginSuccessfully => {
                if (!didLoginSuccessfully) { return; }
                setWalletAddress(LoginService.getInstance().walletAddress);
                setChainName(LoginService.getInstance().chainName);
            });
    }, [setWalletAddress]);

    if (LoginService.getInstance().isLoggedIn) {
        return (
            <>
                <Navbar.Text>
                    Wallet: {walletAddress}
                </Navbar.Text>
                <Badge style={styles.chainBadge} bg="primary">{chainName}</Badge>
            </>
        );
    }

    return (<Button variant="primary" onClick={LoginService.getInstance().linkAccount}>Connect Wallet</Button>);
}

const styles = {
    chainBadge: {
        marginLeft: "0.5rem",
    }
};

export default Login;
