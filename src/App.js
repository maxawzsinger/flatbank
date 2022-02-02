import './App.css'; //from create react app, can probs delete
import {useState, useEffect} from 'react';

//main screens
import DaoSummonPane from './daoSummonPane';
import DaoInteractionPane from './daoInteractionPane';

//building transactions for MetaMask
import {MolochMessenger} from './molochMessenger';
import contractConfigs from './contractConfigs.js';

//styling components
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {utilities} from './utilities';




function App() {

  //functions
  const [web3js, setWeb3js] = useState({}); //hold web3 obj
  const [summonerContract, setSummonerContract] = useState({}); //hold summoning contract
  const [tokenContract, setTokenContract] = useState({});
  const [molochMessenger, setMolochMessenger] = useState({});

  //display
  const [screenType, setScreenType] = useState("Treasury creation"); //controls screen screenType (interact or creation)

  //both functions and display
  const [account, setAccount] = useState(''); //hold user wallet address they are signed into metamask with
  const [userDaos, setUserDaos] = useState([]);

  useEffect(() => {


  async function load() {
    if (window.ethereum !== undefined) { //XXX change to .exists?

      //INSTANTIATE AND STORE WEB3JS OBJECT IN STATE, checking if user has installed MetaMask and is signed in
      const web3Obj = new window.Web3(window.ethereum);
      setWeb3js(web3Obj);
      const accounts = await web3Obj.eth.requestAccounts();
      if (accounts) {
      setAccount(accounts[0]);       //set primary account





      //USE WEB3JS TO BUILD CONTRACT OBJECTS, STORING IN STATE
      let summonerContract = new web3Obj.eth.Contract(contractConfigs.summonerABI, contractConfigs.summonerAddress);
      setSummonerContract(summonerContract);


      let tokenContract = new web3Obj.eth.Contract(contractConfigs.tokenABI, contractConfigs.tokenAddress);
      setTokenContract(tokenContract);
      const totalNumberOfDaos = await summonerContract.methods.numberOfDaos().call();


      //USE SUMMONER CONTRACT TO CHECK IF USER IS A MEMBER OF ANY DAOS. IF THEY ARE, OPTIMISTICALLY BUILD A NEW MolochMessenger for the first DAO they joined.
      //MolochMessengers are rebuilt for each dao as the user switches between them. They build transaction requests for MetaMask pre-addressed to the DAO instance.
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


// FUNCTION TO BUILD A NEW molochMessenger IF THE USER SWITCHES DAOs THEY ARE INTERACTING WITH
 function changeDao(daoAddress) {
   const daoInstance = new web3js.eth.Contract(contractConfigs.molochABI, daoAddress);
   const molochMessenger = new MolochMessenger(summonerContract, tokenContract, daoInstance, account);
   setMolochMessenger(molochMessenger);
   console.log(daoInstance);
 }


//RETURNS EITHER INTERACTION OR CREATION COMPONENT DEPENDING ON STATE OF "screenType"
  return (

    <div className="App">
    <Box sx = {{
      border : '2px solid',
      borderColor : '#2196f3',
      borderRadius : '5px',
      textAlign : 'left',
      mx: 2
    }}>

    <Typography
        variant="body1"
        gutterBottom
        component="div"
        sx = {{mx:2,mt:2, maxWidth:'300px'}}>
        {account.length===0? 'No account detected, please sign in to MetaMask' : `your web3 account is: ${utilities.shortenAddress(account)}`}
     </Typography>
      {screenType === 'Treasury creation' ? <Button
          onClick={() => setScreenType('Treasury management')}>
          Switch to interact mode
      </Button>
    :  <Button
        onClick={() => setScreenType('Treasury creation')}>
        Switch to create mode
    </Button>}
      </Box>
      <Typography
      variant="h6"
      gutterBottom
      component="div"
      sx = {{mx:2,mt:2}}>
       {screenType}
     </Typography>

      {screenType==='Treasury creation'
      ? <DaoSummonPane molochMessenger = {molochMessenger}/>
      : <DaoInteractionPane molochMessenger = {molochMessenger} changeDao = {changeDao} userDaos = {userDaos}/>
    }
    </div>

  );
}

export default App;
