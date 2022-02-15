import {useState, useEffect} from 'react';
import * as React from 'react';

//functionality
import {utilities} from '../utilities/utilities';

//custom components
import ProposalForm from '../components/interaction/ProposalForm';
import ProposalItem from '../components/interaction/ProposalItem';

//mui components
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';


//ABOUT:
//this component uses molochMessenger to getAndSetData() from the current treasury selected, and maps this data to:
//a general "about treasury" display with readouts of treasury balances etc
//a list of proposal cards (themselves each a component), with one for each proposal, and information about the proposal

//this component also includes a form to create new proposals for the treasury.

//the function getAndSetData() is called on treasury change - as change in treasury will obviously result in different information - as well as every minute,
//using a useEffect(), so actions made by others should be visible to all other treasury members within a minute

//the component also listens for receipts produced my MetaMask by listening to changes in the prop lastTXReturn, which is a dependancy array in a below useEffect.
//it will display an error message if the transaction request failed, or call getAndSetData() if it was successful, to reflect new changes in contract state.

function TreasuryInteractionScreen(props) {



  const [amountToBeWithdrawn, setAmountToBeWithdrawn] = useState(0);

  //CURRENT DAO info
  const [currentDaoAddress, setCurrentDaoAddress] = useState('');
  const [currentDaoData, setCurrentDaoData] = useState('');
  const [proposalView, setProposalView] = useState(false);

  //for dev purposes
  const [period,setPeriod] = useState(0);


//FUNCTION TO MANUALLY REFRESH DATA
async function getAndSetData() { //fetches data about the DAO
  const daoData = await props.molochMessenger.getData();
  setCurrentDaoData(daoData);
  console.log(daoData.originalSummoningTime);
}



//REFRESHES DATA EVERY MINUTE
const MINUTE_MS = 60000;

useEffect(() => {
  const interval = setInterval(() => {
    getAndSetData();
  }, MINUTE_MS);

  return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
}, [])


//LISTEN TO RETURNED DATA FROM TRANSACTION REQUESTS TO UPDATE STATE CONDITIONALLY
useEffect(() => {
  if (props.lastTXReturn.transactionHash !== undefined) {
    //the return data on last transaction signals verified tx
    //also is not empty object as it is initialized as
  getAndSetData();
  console.log('receipted tx recipt');
} else if (props.lastTXReturn.code!== undefined) { //return data is an error which has two properties - code and name. unsafe to rely on code
  alert(`there was an issue: ${props.lastTXReturn.message}`);
}
}, [props.lastTXReturn])


function makeDaoButton(daoAddress) {
    return (
        <Button
            onClick={() => {
              props.changeDao(daoAddress);
              setCurrentDaoAddress(daoAddress);
              getAndSetData();
            }}>
            {utilities.shortenAddress(daoAddress)}
        </Button>
    );
}

//DISPLAY DAOs OF WHICH THE USER IS A MEMBER AND IF THERE IS A DAO SELECTED, RENDER INFO ABOUT THE DAO
    return (
      <div className="TreasuryInteractionScreen">
      <Typography
      variant="h6"
      gutterBottom
      component="div"
      sx = {{mx:2,mt:2}}>
       Select a treasury
     </Typography>

      <Box sx = {{
        border : '2px solid',
        borderColor : '#2196f3',
        borderRadius : '5px',
        textAlign : 'left',
        mx: 2,
        my:2
      }}>
      {props.userDaos?.map((element) => makeDaoButton(element))}

      </Box>

      {currentDaoData &&
        <div>
        <Typography
      variant="h6"
      gutterBottom
      component="div"
      sx = {{mx:2,mt:2}}>
      Treasury {utilities.shortenAddress(currentDaoAddress)}
     </Typography>
     <Box sx = {{
       border : '2px solid',
       borderColor : '#2196f3',
       borderRadius : '5px',
       textAlign : 'left',
       mx: 2,
       my : 2
     }}>
     <Typography
     variant="body2"
     gutterBottom
     component="div"
     sx = {{mx:2,mt:2}}>
     Current period: {currentDaoData.currentPeriod}.
     Total members: {currentDaoData.memberCount}.
     Native token: xDAI.
     Amount owned by treasury: {currentDaoData.totalBalance}.
     Your voting power: {
       (currentDaoData.memberInformation[props.account].sharesInt/currentDaoData.totalShares)*100
     }%.
     Your total ownership of treasury : {
       ((currentDaoData.memberInformation[props.account].sharesInt +
       currentDaoData.memberInformation[props.account].lootInt) /
       (currentDaoData.totalShares + currentDaoData.totalLoot))*100
     }%.
    </Typography>

     </Box>
     {currentDaoData.proposalData.length>0 &&
     <Box sx = {{
       border : '2px solid',
       borderColor : '#2196f3',
       borderRadius : '5px',
       textAlign : 'left',
       mx: 2,
       my : 2
     }}>

     {currentDaoData.proposalData.map(proposal =>
           <ProposalItem
           proposalObj = {proposal}
           molochMessenger = {props.molochMessenger}
           account = {props.account}
           originalSummoningTime = {currentDaoData.originalSummoningTime}/>
         )}

     </Box>
   }

     <Button
         onClick={() => {
           setProposalView(!proposalView);
         }}>
         {proposalView? 'Make proposal △' : 'Make proposal ▽'}
     </Button>

        {proposalView && <ProposalForm molochMessenger = {props.molochMessenger}/>}

        <Box sx = {{
          border : '2px solid',
          borderColor : '#2196f3',
          borderRadius : '5px',
          textAlign : 'left',
          mx: 2,
          my : 2
        }}>
       <TextField
         sx={{
           mx : 2,
           mt : 2,
           alignSelf : 'stretch'

         }}
         label = 'Amount to withdraw'
         id="outlined-basic"
         variant="outlined"
         value = {amountToBeWithdrawn}
         onChange = {e => setAmountToBeWithdrawn(e.target.value)}
         />
         <p>
       <Button
           onClick={() => props.molochMessenger.withdrawBalance(amountToBeWithdrawn)}>
           Withdraw
       </Button>
       </p>
        </Box>
        <p>
        _______________________________________
        </p>
        <p>  Dao summoning time: {currentDaoData.originalSummoningTime}</p>
        <p>Maybe modified time (test): {currentDaoData.summoningTime}</p>
        <button
            onClick={e => {e.preventDefault();props.molochMessenger.fastForward(period)}}>
            Set new period of contract
        </button>
        <p>
        <input
          type="text"
          value={period}
          onChange={e => setPeriod(e.target.value)}
        />
        </p>
        <button
            onClick={e => {e.preventDefault();props.molochMessenger.revertSummoningTime()}}>
            Revert time
        </button>
        <button
            onClick={e => {e.preventDefault();getAndSetData()}}>
            get data
        </button>
        <button
            onClick={e => {e.preventDefault();props.molochMessenger.increaseDaoAllowanceBy1000(currentDaoAddress)}}>
            Mint and transfer 1000 tokens to DAO
        </button>
        <button
            onClick={e => {e.preventDefault();props.molochMessenger.collectTokens()}}>
            collectTokens
        </button>
      </div>
    }

      </div>
    )

}

export default TreasuryInteractionScreen;
