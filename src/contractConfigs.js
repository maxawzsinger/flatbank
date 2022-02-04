import {tokenABI} from "./contractABIs/tokenABI";
import {molochABI} from "./contractABIs/molochABI";
import {summonerABI} from "./contractABIs/summonerABI";

const contractConfigs = {

  tokenAddress : '0x5FbDB2315678afecb367f032d93F642f64180aa3',
  summonerAddress : "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  tokenABI: tokenABI,
  molochABI :  molochABI,
  summonerABI : summonerABI,
  guildAddress : '0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199',
  escrowAddress : '0xdd2fd4581271e230360230f9337d5c0430bf44c0',
  totalAddress : '0xbda5747bfd65f08deb54cb465eb87d40e51b197e'
};

export default contractConfigs;
