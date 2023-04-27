import React, { Component } from 'react';
import factory from './factory';
import ConnectWallet from './component/connectWallet';

class App extends Component {
  async componentDidMount() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    console.log(campaigns);
  }

  render() {
    return (
      <div>
        <h1>Crowdfunding App</h1>
        <ConnectWallet />
      </div>
    );
  }
}

export default App;
