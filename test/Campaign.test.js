const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const provider = ganache.provider();
const web3 = new Web3(provider);

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');

let accounts;
let factory;
let campaignAddress;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  // Deploy factory contract
factory = await new web3.eth.Contract(
  compiledFactory.abi
)
  .deploy({
    data: compiledFactory.evm.bytecode.object
  })
  .send({
    from: accounts[0],
    gas: '5000000'

});

// Create a new campaign contract
await factory.methods.createCampaign('100').send({
  from: accounts[0],
  gas: '5000000'

});

// Get the address of the newly created campaign contract
[campaignAddress] = await factory.methods.getDeployedCampaigns().call();
campaign = await new web3.eth.Contract(
  compiledCampaign.abi,
  campaignAddress
);
});

describe('Campaigns', () => {
  it('deploys a factory and a campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });

  it('allows an account to contribute money and marks them as a contributor', async () => {
    const contributor = accounts[1];

    // Contribute 200 wei to the campaign
    await campaign.methods.contribute().send({
      value: '200',
      from: contributor
    });

    // Check if the account is marked as a contributor
    const isContributor = await campaign.methods.approvers(contributor).call();
    assert(isContributor);
  });

  it('requires a minimum contribution of 100 wei', async () => {
    const contributor = accounts[1];

    // Try to contribute 50 wei to the campaign (should fail)
     try {
      await campaign.methods.contribute().send({
         value: '50',
         from: contributor
       });
       assert(false);
     } catch (err) {
       assert(err);
     }

    // Try to contribute 100 wei to the campaign (should succeed)
    await campaign.methods.contribute().send({
      value: '200',
      from: contributor
    });

    const isContributor = await campaign.methods.approvers(contributor).call();
    assert(isContributor);
  });

  it('allows the manager to create a payment request', async () => {
    const manager = accounts[0];
    const recipient = accounts[2];

    // Create a payment request to buy batteries
    await campaign.methods
      .createRequest('Buy batteries', '100', recipient)
      .send({
        from: manager,
        gas: '5000000'

      });

    // Get the payment request at index 0
    const request = await campaign.methods.getRequest(0).call();

    assert.equal('Buy batteries', request.description);
  });

  it('processes requests', async () => {
    const contributor1 = accounts[1];
    const contributor2 = accounts[2];
    const manager = accounts[0];
    const recipient = accounts[3];

    // Contribute 10 ether to the campaign
    await campaign.methods.contribute().send({
      from: contributor1,
      value: web3.utils.toWei('10', 'ether')
    });

    // Create a payment request to send 


    await campaign.methods
      .createRequest('A', web3.utils.toWei('5', 'ether'), accounts[3])
      .send({ from: accounts[0], gas: '5000000' });

    await campaign.methods.approveRequest(0).send({
      from: accounts[1],
      gas: '5000000'

    });

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '5000000'
    });

    let balance = await web3.eth.getBalance(accounts[3]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);

    assert(balance > 104);
  });
});
