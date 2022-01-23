import {useState, useEffect} from 'react';
import otherConfig from './otherConfig';


function DaoSummonPane(props) { //pass in summonerContract and web3js obj and accout addr to props


//TRANSACTION SETTINGS
  // const [templateAddress, setTemplateAddress] = useState("");

  const [addresses,setAddresses] = useState([]);
  const [shares,setShares] = useState([]);
  const [displayedAddressesAndShares, setDisplayedAddressesAndShares] = useState([]);
  const [enteredSummonerAddress, setEnteredSummonerAddress] = useState('');
  const [enteredSummonerShare, setEnteredSummonerShare] = useState(0);
  const [addressesAndShares, setAddressesAndShares] = useState([]);
  //calling contract functions



//ADD TO FORM BUTTONS FOR adding dao members and corresponding membership share, one by one for below function to use


  function handleAddSummoner(){
    if (!addresses.includes(enteredSummonerAddress)) {
    setAddresses([...addresses,enteredSummonerAddress]);
    setEnteredSummonerAddress([]);
    setShares([...shares,enteredSummonerShare]);
    setEnteredSummonerShare([]);
    setDisplayedAddressesAndShares([...displayedAddressesAndShares,`Founding summoner: ${enteredSummonerAddress} (share: ${enteredSummonerShare})`]);
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
    <ul>
    {displayedAddressesAndShares.map(addressAndShare => <li key = {addressAndShare}> {addressAndShare}</li>)}
    </ul>
      <p>
        add summoner
      </p>
      <label>
      Address:
        <input
          type="text"
          value={enteredSummonerAddress}
          onChange={e => setEnteredSummonerAddress(e.target.value)}
        />
      </label>
      <label>
        Shares:
        <input
          type="text"
          value={enteredSummonerShare}
          onChange={e => setEnteredSummonerShare(e.target.value)}
        />
      </label>

    <p>
    <button onClick={() => handleAddSummoner()}>Add summoner</button>

    <button onClick={() => {setAddresses([]);setShares([]);setEnteredSummonerAddress([]);setEnteredSummonerShare([])}}>CLEAR ALL</button>

    </p>
    <button onClick={(e) => {e.preventDefault();props.molochMessenger.summon(addresses,shares);}}>Summon dao</button>


  </div>
  );
  }

export default DaoSummonPane;
