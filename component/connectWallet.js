import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

function ConnectWallet() {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          setWeb3(web3Instance);
        } catch (error) {
          console.error(error);
        }
      } else if (window.web3) {
        setWeb3(new Web3(window.web3.currentProvider));
      } else {
        console.error('No web3 instance found');
      }
    };
    initWeb3();
  }, []);

  useEffect(() => {
    const getAccount = async () => {
      if (web3) {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
      }
    };
    getAccount();
  }, [web3]);

  const handleConnect = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.enable();
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div>
      {account ? (
        <p>Connected Account: {account}</p>
      ) : (
        <button onClick={handleConnect}>Connect Wallet</button>
      )}
    </div>
  );
}

export default ConnectWallet;
