const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const compiledFactory = require('./build/CampaignFactory.json');

const provider = new HDWalletProvider(
  'disorder torch napkin famous eight faint gravity jar run unusual assume bachelor',
  'https://sepolia.infura.io/v3/57907d2015214f31808056178b3d8201'
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);
  console.log('');
  console.log('Interface:', compiledFactory.abi);
  const contractInterface = compiledFactory.abi;

  const result = await new web3.eth.Contract(
    contractInterface
  )
    .deploy({
      data: '0x' + compiledFactory.evm.bytecode.object,
      arguments: [] // if the constructor has arguments, specify them here
    })
    .send({ gas: '4000000', from: accounts[0] });


  console.log('Contract deployed to', result.options.address);
  console.log('');
  console.log('Contract deployed successfully');

  console.log('view transaction at: https://sepolia.etherscan.io/address/',result.options.address);
};

deploy()
  .then(() => {
    console.log('Deployment completed successfully.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Deployment error:', error);
    process.exit(1);
  });
