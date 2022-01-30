import {useState, useEffect} from 'react';
import otherConfig from './otherConfig';
import Button from '@mui/material/Button';
import FounderList from './FounderList';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


function DaoSummonPane(props) { //pass in summonerContract and web3js obj and accout addr to props


//TRANSACTION SETTINGS
  // const [templateAddress, setTemplateAddress] = useState("");

  const [addresses,setAddresses] = useState([]);
  const [shares,setShares] = useState([]);
  const [displayedAddressesAndShares, setDisplayedAddressesAndShares] = useState([]);
  const [enteredSummonerAddress, setEnteredSummonerAddress] = useState('');
  const [enteredSummonerShare, setEnteredSummonerShare] = useState();
  const [addressesAndShares, setAddressesAndShares] = useState([]);

  const [muiAddressAndShares, setMuiAddressAndShares] = useState([]);
  //calling contract functions



//ADD TO FORM BUTTONS FOR adding dao members and corresponding membership share, one by one for below function to use


  function handleAddSummoner(){
    if (!addresses.includes(enteredSummonerAddress)) {
    setAddresses([...addresses,enteredSummonerAddress]);
    setEnteredSummonerAddress([]);
    setShares([...shares,enteredSummonerShare]);
    setEnteredSummonerShare([]);
    setDisplayedAddressesAndShares([...displayedAddressesAndShares,{address: enteredSummonerAddress,shares: enteredSummonerShare}]);

    } else {
    alert("summoner already added");
  }
}



  return (

  <div className="DaoSummonPane">
    <h1>
    Create a contract
    </h1>

    <p>
      proposed summoners and shares
    </p>
    <FounderList data={displayedAddressesAndShares}/>


      <Box sx = {{
        border : '2px solid',
        borderColor : '#2196f3',
        borderRadius : '5px',
        textAlign : 'left'
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
        <Button
        sx = {{
          mx : 2,
          mb : 2,
        }}
        variant = "outlined"
        onClick={() => props.molochMessenger.summon(addresses,shares)}
        >Summon dao
        </Button>

      </Box>



  </div>
  );
  }

export default DaoSummonPane;
