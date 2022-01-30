import {useState} from 'react';
import Proposal from './proposal';

import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MaterialProposal from './materialProposal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {utilities} from './utilities';
import ProposalForm from './materialProposalForm';

function DaoInteractionPane(props) {

  const [contractGetterFunctions, setContractGetterFunctions] = useState([]);
  const [availableContractFunctions, setAvailableContractFunctions] = useState([]);
  const [currentDaoContract, setCurrentDaoContract] = useState({});
  const [selectedContractFunction, setSelectedContractFunction] = useState('');
  const [selectedContractFunctionParameters, setSelectedContractFunctionParameters] = useState(''); //passed as string 'arg1,arg2' to be split on comma
  const [amountToBeWithdrawn, setAmountToBeWithdrawn] = useState(0);

  //CURRENT DAO info
  const [currentDaoAddress, setCurrentDaoAddress] = useState('');
  const [currentDaoData, setCurrentDaoData] = useState(0);
  const [proposalView, setProposalView] = useState(false);

  //SUBMIT PROPOSAL FORM state





/////////////////////ONLOAD
async function getAndSetData() {
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

//SNIPPIT OF CODE FOR DROP DOWN MENU, was problmatic showing loaded dao addres "cannot read properties of undefined reading value"
// <Box sx={{ minWidth: 120, maxWidth:500 }}>
//   <FormControl fullWidth>
//     <InputLabel id="demo-simple-select-label">DAOs</InputLabel>
//     <Select
//       labelId="demo-simple-select-label"
//       id="demo-simple-select"
//       label="DAOs"
//       value = ''
//       onChange={(e) => {props.changeDao(e.target.value);setCurrentDaoAddress(e.target.value);}}
//     > {props.userDaos?.map((element) => (
//       <MenuItem value = {element}>{element}</MenuItem>
//     ))}
//     </Select>
//   </FormControl>
// </Box>





function makeProposal(proposal) {
  return  <MaterialProposal
  proposalObj = {proposal}
  molochMessenger = {props.molochMessenger}
  account = {props.account}
  summoningTime = {currentDaoData.originalSummoningTime}/>
};




let proposalList;
let daoTimeInformation;
if (currentDaoData) {
  proposalList = currentDaoData.proposalData.map(proposal =>
        <MaterialProposal
        proposalObj = {proposal}
        molochMessenger = {props.molochMessenger}
        account = {props.account}
        summoningTime = {currentDaoData.originalSummoningTime}/>
      );
  daoTimeInformation =
    <div>
      <p>  Dao summoning time: {currentDaoData.originalSummoningTime}</p>;
      <p>Maybe modified time (test): {currentDaoData.summoningTime}</p>;
    </div>
} else {
  proposalList = <p>No dao selected yet</p>;
  daoTimeInformation = '';
}


  if (currentDaoAddress.length ==0) {
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
      </div>
    )
  } else {


  return (

    <div className="DaoInteractionPane">


    <Box sx = {{
      border : '2px solid',
      borderColor : '#2196f3',
      borderRadius : '5px',
      textAlign : 'left',
      mx: 2,
      my : 2
    }}>
    {props.userDaos?.map((element) => makeDaoButton(element))}

    </Box>
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

   {proposalList}

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
      {daoTimeInformation}
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

  );
};
}

export default DaoInteractionPane;
