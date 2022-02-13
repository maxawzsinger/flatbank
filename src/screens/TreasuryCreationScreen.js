import {useState} from 'react';

//custom components
import FounderList from '../components/creation/FounderList';
import RequestToJoinForm from '../components/creation/RequestToJoinForm';

//functionality

//mui components
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

//ABOUT
//this component contains forms to either create a treasury or join a treasury, if the user has the treasury's on-chain hex available.
//

function TreasuryCreationScreen(props) { //pass in summonerContract and web3js obj and accout addr to props

  const [addresses,setAddresses] = useState([]); //for molochmessenger summon method
  const [shares,setShares] = useState([]);//for moloch messenger summon method
  const [displayedAddressesAndShares, setDisplayedAddressesAndShares] = useState([]); //for passing to founderlist component
  const [enteredSummonerAddress, setEnteredSummonerAddress] = useState(''); //for display in texfield
  const [enteredSummonerShare, setEnteredSummonerShare] = useState(''); //for display in textfield
  const [joinView, setJoinView] = useState(false);


  function handleAddSummoner(){
    //first check if this founder has already been added
    if (!addresses.includes(enteredSummonerAddress)) {
    //add founder wallet address and shares to array in state
    setAddresses([...addresses,enteredSummonerAddress]);
    setShares([...shares,enteredSummonerShare]);
    //reset textfields
    setEnteredSummonerAddress([]);
    setEnteredSummonerShare([]);
    //update array being passed for display to founder list component
    setDisplayedAddressesAndShares([...displayedAddressesAndShares,{address: enteredSummonerAddress,shares: enteredSummonerShare}]);

    } else {
    alert("summoner already added");
  }
}



  return (

  <div className="TreasuryCreationScreen">
    <FounderList data={displayedAddressesAndShares}/>


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
       Add summoner
     </Typography>
      <TextField
        sx={{
          mx : 2,
          mt : 2,
          alignSelf : 'stretch'


        }}
        label = 'Address'
        id="outlined-basic"
        variant="outlined"
        value = {enteredSummonerAddress}
        onChange = {e => setEnteredSummonerAddress(e.target.value)}
        />
      <TextField
        sx={{
          mx : 2,
          mt : 2,
          alignSelf : 'stretch'

        }}
        label = 'Shares'
        id="outlined-basic"
        variant="outlined"
        value = {enteredSummonerShare}
        onChange = {e => setEnteredSummonerShare(e.target.value)}
        />

        <p>
        <Button sx = {{mx: 2, my : 2}} variant = "outlined" onClick={() => handleAddSummoner()}>Add summoner</Button>
        <Button variant = "outlined" onClick={() => {
          setAddresses([]);
          setShares([]);
          setEnteredSummonerAddress([]);
          setEnteredSummonerShare([])}
        }>Clear all</Button>
        </p>


      </Box>
      <Button
      sx = {{
        mx : 2,
        my : 2,
      }}
      variant = "outlined"
      onClick={() => props.molochMessenger.summon(addresses,shares)} //parse string to integer
      >Summon dao
      </Button>

      <Button
          onClick={() => {
            setJoinView(!joinView);
          }}>
          {joinView? 'Request to join a treasury △' : 'Request to join a treasury ▽'}
      </Button>
      {joinView && <RequestToJoinForm
        account = {props.account}
        molochMessenger = {props.molochMessenger}
        changeDao={props.changeDao}
        lastTXReturn={props.lastTXReturn}

        />
      }


  </div>
  );
  }

export default TreasuryCreationScreen;
