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


  const handleSummonDaoSubmit = (event) => {

      event.preventDefault();
      if (addresses.length>0) {
      alert("creating contract")
      props.summonerContract.methods.summonMoloch(addresses,[otherConfig.tokenAddress],17280, 35, 35, 1, 3, 1, shares).send(
        {from: props.account}
      ).on('transactionHash', function(hash){
          console.log(hash);
      })
      .on('receipt', function(receipt){
          console.log(receipt);
      })
      .on('confirmation', function(confirmationNumber, receipt){
          console.log(confirmationNumber);
      })
      .on('error', function(error, receipt) {
          console.log(error);
      });
    } else {
      alert("no members added");
    }
  }


  //summoners (array)
  //approved tokens (array)
  // uint256 public periodDuration; // default = 17280 = 4.8 hours in seconds (5 periods per day)
  // uint256 public votingPeriodLength; // default = 35 periods (7 days)
  // uint256 public gracePeriodLength; // default = 35 periods (7 days)
  // uint256 public proposalDeposit; // default = 10 ETH (~$1,000 worth of ETH at contract deployment)
  // uint256 public dilutionBound; // default = 3 - maximum multiplier a YES voter will be obligated to pay in case of mass ragequit
  // uint256 public processingReward; // default = 0.1 - amount of ETH to give to whoever processes a proposal
  //summoner shares (array, order corresponding to each summoner)

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
    <button onClick={handleSummonDaoSubmit}>Summon dao</button>


  </div>
  );
  }

export default DaoSummonPane;
