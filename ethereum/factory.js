import web3 from './web3';
import CampaignFactory from '../ethereum/build/CampaignFactory.json';

const instance = new web3.eth.Contract(
  CampaignFactory.abi,
  '0x633cdd7931dB0c8B2Bf29ecda6Af052eDEEC2816'
);

export default instance;
