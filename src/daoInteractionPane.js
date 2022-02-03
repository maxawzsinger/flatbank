import {useState, useEffect} from 'react';
import * as React from 'react';

//functionality
import {utilities} from './utilities';

//custom components
import ProposalForm from './interaction/materialProposalForm';
import MaterialProposal from './interaction/materialProposal';

//mui components
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

function DaoInteractionPane(props) {

  const[waitingForReceipt,setWaitingForReceipt] = useState(false);

  const [amountToBeWithdrawn, setAmountToBeWithdrawn] = useState(0);

  //CURRENT DAO info
  const [currentDaoAddress, setCurrentDaoAddress] = useState('');
  const [currentDaoData, setCurrentDaoData] = useState('');
  const [proposalView, setProposalView] = useState(false);

  const [lastTransactionReceipt, setLastTransactionReceipt] = useState({});
  //SUBMIT PROPOSAL FORM state

async function getAndSetData() { //fetches data about the DAO
  const daoData = await props.molochMessenger.getData();
  setCurrentDaoData(daoData);
}


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

const MINUTE_MS = 60000;

useEffect(() => {
  const interval = setInterval(() => {
    getAndSetData();
  }, MINUTE_MS);

  return () => clearInterval(interval); // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
}, [])

// useEffect(() => {
//   setLastTransactionReceipt(props.molochMessenger.lastTransactionReceipt);
//   console.log('receipted tx hash', lastTransactionReceipt);
// }, [props.molochMessenger.lastTransactionReceipt])

useEffect(() => {
  if (props.lastTXReturn.transactionHash !== undefined) {
    //the return data on last transaction signals verified tx
    //also is not empty object as it is initialized as
  getAndSetData();
  console.log('receipted tx recipt');
} else if (props.lastTXReturn.code!== undefined) { //return data is an error which has two properties - code and name. unsafe to rely on code
  alert('there was an issue processing this transaction');
}
}, [props.lastTXReturn])



function makeProposal(proposal) {
  return  <MaterialProposal
  proposalObj = {proposal}
  molochMessenger = {props.molochMessenger}
  account = {props.account}
  summoningTime = {currentDaoData.originalSummoningTime}/>
};



//DISPLAY DAOs OF WHICH THE USER IS A MEMBER AND IF THERE IS A DAO SELECTED, RENDER INFO ABOUT THE DAO
    return (
      <div className="DaoInteractionPane">
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
     variant="body1"
     gutterBottom
     component="div"
     sx = {{mx:2,mt:2}}>
     About treasury:
    </Typography>

     </Box>
     <Box sx = {{
       border : '2px solid',
       borderColor : '#2196f3',
       borderRadius : '5px',
       textAlign : 'left',
       mx: 2,
       my : 2
     }}>

     {currentDaoData.proposalData.map(proposal =>
           <MaterialProposal
           proposalObj = {proposal}
           molochMessenger = {props.molochMessenger}
           account = {props.account}
           summoningTime = {currentDaoData.originalSummoningTime}/>
         )}

     </Box>

     <Button
         onClick={() => {
           setProposalView(!proposalView);
         }}>
         {proposalView? 'Make proposal △' : 'Make proposal ▽'}
     </Button>

        {proposalView && <ProposalForm molochMessenger = {props.molochMessenger}/>}

        <p>
        _______________________________________
        </p>
        <p>
        withdraw:
        </p>
        <button
            onClick={() => props.molochMessenger.withdrawBalance(amountToBeWithdrawn)}>
            Withdraw balance
        </button>
        <p>
        <input
          type="text"
          value={amountToBeWithdrawn}
          onChange={e => setAmountToBeWithdrawn(e.target.value)}
        />
        </p>
        <p>
        _______________________________________
        </p>
        <p>  Dao summoning time: {currentDaoData.originalSummoningTime}</p>
        <p>Maybe modified time (test): {currentDaoData.summoningTime}</p>
        <button
            onClick={e => {e.preventDefault();props.molochMessenger.fastForward()}}>
            FF 7 days
        </button>
        <button
            onClick={e => {e.preventDefault();props.molochMessenger.revertSummoningTime()}}>
            Revert time
        </button>
        <button
            onClick={e => {e.preventDefault();getAndSetData()}}>
            get data
        </button>
        <button
            onClick={e => {e.preventDefault();props.molochMessenger.sendToDao(1)}}>
            transfer to DAO
        </button>
      </div>
    }

      </div>
    )

}

export default DaoInteractionPane;
