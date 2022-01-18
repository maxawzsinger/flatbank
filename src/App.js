import './App.css';
import {useState, useEffect} from 'react';
import {summonerContractABI, summonerContractAddress} from './summonerContractConfig';
import DaoSummonPane from './daoSummonPane';
import DaoInteractionPane from './daoInteractionPane';

function App() {

  const [web3js, setWeb3js] = useState({}); //hold web3 obj
  const [summonerContract, setSummonerContract] = useState({}); //hold summoning contract
  const [account, setAccount] = useState("no account detected, pls install MetaMask and reload"); //hold user wallet address they are signed into metamask with
  const [display, setDisplay] = useState("create");
/////////////////////ONLOAD
  useEffect(() => {


  async function load() {
    if (window.ethereum !== undefined) {
      //instantiate web3 object
      const web3Obj = new window.Web3(window.ethereum);
      setWeb3js(web3Obj); //store in state for later
      //set primary account
      const accounts = await web3Obj.eth.getAccounts();
      if (accounts) { //if exists, successfully init web3js
        setAccount(accounts[0]);


      //set summonerContract obj
      let summonerContract = new web3Obj.eth.Contract(summonerContractABI, summonerContractAddress); //RESET THIS - most recent crank, addr on ganache,, abi on remix
      //add summonerContract address to state
      setSummonerContract(summonerContract); //store in state for later
    }

    } else {
      console.log("no metamask detected");
    }
  }

  load();
 }, [])





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
      <DaoSummonPane summonerContract = {summonerContract} account = {account}/>
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
      <DaoInteractionPane summonerContract = {summonerContract} web3js = {web3js} account={account}/>
    </div>

  );
}
}

export default App;
