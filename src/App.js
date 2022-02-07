import {useState, useEffect} from 'react';

//main screens
import TreasuryCreationScreen from './screens/TreasuryCreationScreen';
import TreasuryInteractionScreen from './screens/TreasuryInteractionScreen';

//building transactions for MetaMask
import {MolochMessenger} from './utilities/molochMessenger';
import contractConfigs from './contractConfigs/contractConfigs.js';

//styling components
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {utilities} from './utilities/utilities';




function App() {

  //functions
  const [web3js, setWeb3js] = useState({}); //hold web3 obj
  const [summonerContract, setSummonerContract] = useState({}); //hold summoning contract
  const [tokenContract, setTokenContract] = useState({});
  const [molochMessenger, setMolochMessenger] = useState({});
  const [lastTXReturn,setLastTXReturn] = useState({})

  //important notes - web3js signals a verified transaction by returning a tx receipt. molochmessenger takes in
  //the setLastTXReturn() as a parameter and uses this to pass txreceipt data to App.js which then passes this to dao INTERACTION
  //pane as props. inside, daoInteractionPane uses useEffect to trigger a data refresh

  //display
  const [screenType, setScreenType] = useState("Treasury creation"); //controls screen screenType (interact or creation)
  const [walletStatus, setWalletStatus] = useState('Please install MetaMask to proceed');
  const [userStatus, setUserStatus] = useState('No wallet');
  //No wallet, Has Wallet, Has account, Has daos

  //both functions and display
  const [account, setAccount] = useState(''); //hold user wallet address they are signed into metamask with
  const [userDaos, setUserDaos] = useState([]);




  useEffect(() => {

    if (window.ethereum !== undefined) {
      window.ethereum.on('accountsChanged', (accounts) => {
        console.log('account changed to ', accounts[0]);
        signIn();
      })

      window.ethereum.on('chainChanged', (chainId) => {
        console.log('Chain changed to ', chainId);
        alert('did you mean to change chains? make sure you are on gnosis chain');
        //only supporting one chain at the moment
      })
    }
 }, [])

 async function signIn() {

   //INSTANTIATE AND STORE WEB3JS OBJECT IN STATE, checking if user has installed MetaMask and is signed in
if(window.ethereum!==undefined) {
  console.log('attempting to connect');
  // await window.ethereum.request({ method: 'eth_requestAccounts' });
  const web3Obj = new window.Web3(window.ethereum);
  setWeb3js(web3Obj);
  const accounts = await web3Obj.eth.requestAccounts();
  console.log(accounts);
  if (accounts!==undefined) {
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
    const memberInDao = await daoInstance.methods.checkMemberInDao(accounts[0]).call();
    console.log(memberInDao);
    console.log(accounts[0]);
    if (memberInDao) {
      usersDaos.push(daoAddress);
    }
  }
  setUserDaos(usersDaos);
  console.log(usersDaos);


  if (usersDaos.length > 0) {
    const daoInstance = new web3Obj.eth.Contract(contractConfigs.molochABI, usersDaos[0]);

    const molochMessenger = new MolochMessenger(summonerContract, tokenContract, daoInstance, accounts[0], setLastTXReturn);
    setMolochMessenger(molochMessenger);

  }
 }
} else {
  //may have signed out
  setAccount('');
}

};


// FUNCTION TO BUILD A NEW molochMessenger IF THE USER SWITCHES DAOs THEY ARE INTERACTING WITH
 function changeDao(daoAddress) {
   const daoInstance = new web3js.eth.Contract(contractConfigs.molochABI, daoAddress);
   const molochMessenger = new MolochMessenger(summonerContract, tokenContract, daoInstance, account, setLastTXReturn);
   setMolochMessenger(molochMessenger);
   console.log(daoInstance);
 }


//RETURNS EITHER INTERACTION OR CREATION COMPONENT DEPENDING ON STATE OF "screenType"

//THREE ROUTES -
//user hasn't installed metamask or hasn't signed in. display only sign in button
//user has signed in but is not in any daos. should not be able to access interaction pane.
//user has signed in and is in a dao. should be able to switch between creation and interaction

  if (account.length===0) { //user either hasn't installed
    return (
    <div className="App">
    <Typography
    variant="h1"
    gutterBottom
    component="div"
    sx = {{mx:2,mt:2}}>
     flatbank
   </Typography>
    <Box sx = {{
      border : '2px solid',
      borderColor : '#2196f3',
      borderRadius : '5px',
      textAlign : 'left',
      mx: 2
    }}>
    <Button
        onClick={() => signIn()}>
        Sign in with MetaMask to interact
    </Button>
    </Box>
    </div>
  )
} else if ((userDaos.length==0) && (account.length!==0)) {
   return (
   <div className="App">
   <Typography
   variant="h1"
   gutterBottom
   component="div"
   sx = {{mx:2,mt:2}}>
    flatbank
  </Typography>
   <Box sx = {{
     border : '2px solid',
     borderColor : '#2196f3',
     borderRadius : '5px',
     textAlign : 'left',
     mx: 2
   }}>
   <Typography
   variant="h6"
   gutterBottom
   component="div"
   sx = {{mx:2,mt:2}}>
    {screenType} - interacting as {utilities.shortenAddress(account)}
  </Typography>
     </Box>
<TreasuryCreationScreen
  molochMessenger = {molochMessenger}
  changeDao={changeDao}
  account={account}
  lastTXReturn={lastTXReturn}
  />

   </div>
 )
} else if ((userDaos.length!==0) && (account.length!==0))  {
  return (
  <div className="App">
  <Typography
  variant="h1"
  gutterBottom
  component="div"
  sx = {{mx:2,mt:2}}>
   flatbank
 </Typography>
  <Box sx = {{
    border : '2px solid',
    borderColor : '#2196f3',
    borderRadius : '5px',
    textAlign : 'left',
    mx: 2
  }}>
  <Typography
  variant="h6"
  gutterBottom
  component="div"
  sx = {{mx:2,mt:2}}>
   {screenType} - interacting as {utilities.shortenAddress(account)}
 </Typography>
 <Button
     onClick={() => setScreenType('Treasury creation')}>
     Switch to create mode
 </Button>
 <Button
     onClick={() => setScreenType('Treasury management')}>
     Switch to manage {userDaos.length} treasuries
 </Button>
    </Box>
    {screenType==='Treasury creation'
    ? <TreasuryCreationScreen
      molochMessenger = {molochMessenger}
      changeDao={changeDao}
      account={account}
      lastTXReturn={lastTXReturn}

      />
    : <TreasuryInteractionScreen
    molochMessenger = {molochMessenger}
    changeDao = {changeDao}
    userDaos = {userDaos}
    lastTXReturn={lastTXReturn}
    account={account}
    />
  }

  </div>
)
}


}

export default App;
