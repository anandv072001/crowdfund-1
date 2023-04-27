import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  // We are in the browser and metamask is running.
  web3 = new Web3(window.ethereum);
  window.ethereum.enable(); // Request access to the user's MetaMask account.
} else {
  // We are on the server *OR* the user is not running metamask
  const provider = new Web3.providers.HttpProvider(
    'https://sepolia.infura.io/v3/57907d2015214f31808056178b3d8201'
  );
  web3 = new Web3(provider);
}

export default web3;

