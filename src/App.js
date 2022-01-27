import './App.css';
import {useState, useEffect} from 'react';
import {summonerContractABI, summonerContractAddress} from './summonerContractConfig';
import DaoSummonPane from './daoSummonPane';
import DaoInteractionPane from './daoInteractionPane';
import contractConfigs from './contractConfigs.js';
import {MolochMessenger} from './molochMessenger';


function App() {

  const [web3js, setWeb3js] = useState({}); //hold web3 obj
  const [summonerContract, setSummonerContract] = useState({}); //hold summoning contract
  const [account, setAccount] = useState("no account detected, pls install MetaMask and reload"); //hold user wallet address they are signed into metamask with
  const [display, setDisplay] = useState("create");
  const [molochMessenger, setMolochMessenger] = useState({});
  const [tokenContract, setTokenContract] = useState({});
  const [userDaos, setUserDaos] = useState([]);
/////////////////////ONLOAD
  useEffect(() => {


  async function load() {
    if (window.ethereum !== undefined) {
      //instantiate web3 object
      const web3Obj = new window.Web3(window.ethereum);
      setWeb3js(web3Obj); //store in state for later
      //set primary account
      const accounts = await web3Obj.eth.requestAccounts();
      console.log(accounts);
      if (accounts) { //if exists, successfully init web3js
        setAccount(accounts[0]);




      //set summonerContract obj
      let summonerContract = new web3Obj.eth.Contract(summonerContractABI, summonerContractAddress); //RESET THIS - most recent crank, addr on ganache,, abi on remix
      //add summonerContract address to state
      setSummonerContract(summonerContract); //store in state for later


      let tokenContract = new web3Obj.eth.Contract(contractConfigs.tokenABI, contractConfigs.tokenAddress);
      setTokenContract(tokenContract);
      const totalNumberOfDaos = await summonerContract.methods.numberOfDaos().call();

      let usersDaos = [];

      for (let i = 0; i<totalNumberOfDaos; i++) {
        const daoAddress = await summonerContract.methods.addressLUT(i).call();
        const daoInstance = new web3Obj.eth.Contract(contractConfigs.molochABI, daoAddress);
        const memberInDao = await daoInstance.methods.checkMemberInDao(accounts[0]);
        if (memberInDao) {
          usersDaos.push(daoAddress);
        }
      }

      setUserDaos(usersDaos);



      if (usersDaos.length > 0) {
        const daoInstance = new web3Obj.eth.Contract(contractConfigs.molochABI, usersDaos[0]);

        const molochMessenger = new MolochMessenger(summonerContract, tokenContract, daoInstance, accounts[0]);
        setMolochMessenger(molochMessenger);

      }
    }

    } else {
      console.log("no metamask detected");
    }
  }

  load();
 }, [])



 function changeDao(daoAddress) {
   const daoInstance = new web3js.eth.Contract(contractConfigs.molochABI, daoAddress);
   const molochMessenger = new MolochMessenger(summonerContract, tokenContract, daoInstance, account);
   setMolochMessenger(molochMessenger);
   console.log(daoInstance);
 }



 if (display == "create") {

  return (

    <div className="App">
      <p>
        your web3 account is: {account}
      </p>
      <button
          onClick={() => setDisplay('interact')}>
          Switch to interact mode
      </button>
      <DaoSummonPane molochMessenger = {molochMessenger}/>
    </div>

  );
} else {
  return (

    <div className="App">
      <p>
        your web3 account is: {account}
      </p>
      <button
          onClick={() => setDisplay('create')}>
          Switch to create mode
      </button>
      <DaoInteractionPane molochMessenger = {molochMessenger} changeDao = {changeDao} userDaos = {userDaos}/>
    </div>

  );
}
}

export default App;
