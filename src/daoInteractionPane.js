import {useState} from 'react';
import Proposal from './proposal';



function DaoInteractionPane(props) {

  const [contractGetterFunctions, setContractGetterFunctions] = useState([]);
  const [availableContractFunctions, setAvailableContractFunctions] = useState([]);
  const [currentDaoContract, setCurrentDaoContract] = useState({});
  const [selectedContractFunction, setSelectedContractFunction] = useState('');
  const [selectedContractFunctionParameters, setSelectedContractFunctionParameters] = useState(''); //passed as string 'arg1,arg2' to be split on comma
  const [amountToBeWithdrawn, setAmountToBeWithdrawn] = useState(0);

  //CURRENT DAO info
  const [currentDaoAddress, setCurrentDaoAddress] = useState('No DAO selected');
  const [currentDaoData, setCurrentDaoData] = useState(0);

  const [proposalType, setProposalType] = useState('payment');

  //SUBMIT PROPOSAL FORM state

  const [proposalApplicant, setProposalApplicant] = useState('');
  const [proposalSharesRq, setProposalSharesRq] = useState(0);
  const [proposalLootRq, setProposalLootRq] = useState(0);
  const [proposalPaymentRq, setProposalPaymentRq] = useState(0);
  const [proposalDetails, setProposalDetails] = useState('');



/////////////////////ONLOAD



function makeDaoButton(daoAddress) {
    return (
        <button
            onClick={() => props.changeDao(daoAddress)}>
            {daoAddress}
        </button>
    );
}



function handleSubmitPaymentProposal(event) {
  event.preventDefault();

  alert("submitting proposal")
  if ((proposalSharesRq + proposalLootRq + proposalPaymentRq) > 0) {
    props.molochMessenger.submitPaymentProposal(
      proposalApplicant,
      proposalSharesRq,
      proposalLootRq,
      proposalPaymentRq,
      proposalDetails
    );
  };
}

async function getAndSetData() {
  const daoData = await props.molochMessenger.getData();
  setCurrentDaoData(daoData);
}


function makeProposalForm() {
  if (proposalType === 'payment') {
    return(
      <div>
      <button
          onClick={() => setProposalType('guildkick')}>
          Propose to kick a member
      </button>
      <p>
      <label>
      Transaction to (hex address):
        <input
          type="text"
          value={proposalApplicant}
          onChange={e => setProposalApplicant(e.target.value)}
        />
      </label>
      </p>
      <p>
      <label>
      Number of voting shares to be dispensed:
        <input
          type="number"
          value={proposalSharesRq}
          onChange={e => setProposalSharesRq(e.target.value)}
        />
      </label>
      </p>
      <p>
      <label>
      Number of non-voting shares to be dispensed:
        <input
          type="number"
          value={proposalLootRq}
          onChange={e => setProposalLootRq(e.target.value)}
        />
      </label>
      </p>
      <p>
      <label>
      Amount of payment to be dispensed:
        <input
          type="number"
          value={proposalPaymentRq}
          onChange={e => setProposalPaymentRq(e.target.value)}
        />
      </label>
      </p>
      <p>
      <label>
      Proposal details:
        <input
          type="text"
          value={proposalDetails}
          onChange={e => setProposalDetails(e.target.value)}
        />
      </label>
      </p>
      <p>
      <button
          onClick={e => handleSubmitPaymentProposal(e)}>
          Submit proposal
      </button>
      </p>
      </div>
    )
  } else if (proposalType === 'guildkick'){
    return(
      <div>
      <button
          onClick={() => setProposalType('payment')}>
          Propose to make a payment
      </button>
      <p>
      <label>
      Member to kick (hex address):
        <input
          type="text"
          value={proposalApplicant}
          onChange={e => setProposalApplicant(e.target.value)}
        />
      </label>
      </p>
      <p>
      <label>
      Proposal details:
        <input
          type="text"
          value={proposalDetails}
          onChange={e => setProposalDetails(e.target.value)}
        />
      </label>
      </p>
      <p>
      <button
          onClick={e => {e.preventDefault();props.molochMessenger.submitGuildKickProposal(proposalApplicant,proposalDetails);}}>
          Submit proposal
      </button>
      </p>
      </div>
    )
  }
}

let proposalList;
let daoTimeInformation;
if (currentDaoData) {
  proposalList = currentDaoData.proposalData.map(proposal =>
      <li key = {currentDaoData.proposalData.propId}>
        <Proposal proposalObj = {proposal} molochMessenger = {props.molochMessenger} account = {props.account}/>
      </li>);
  daoTimeInformation =
    <div>
      <p>  Dao summoning time: {currentDaoData.originalSummoningTime}</p>;
      <p>Maybe modified time (test): {currentDaoData.summoningTime}</p>;
    </div>
} else {
  proposalList = <p>No dao selected yet</p>;
  daoTimeInformation = '';
}


  return (

    <div className="DaoInteractionPane">
    <h1>
    Interact with DAO
    </h1>
    Currently interacting with DAO at address:
    <p>
    {currentDaoAddress}
    </p>
    <ul>
    {props.userDaos.map(element => <li key = {element}> {makeDaoButton(element)}</li>)}
    </ul>
    <p>
    Proposals
    </p>
    <ul>
    {proposalList}
    </ul>
      <h3>
      Submit proposal:
      </h3>
      {makeProposalForm()}

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
          onClick={e => {e.preventDefault();props.molochMessenger.getData()}}>
          get data
      </button>
     </div>

  );
}

export default DaoInteractionPane;
