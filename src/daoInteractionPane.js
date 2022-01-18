import {useState, useEffect} from 'react';
import {molochContractABI} from './molochContractConfig';
import getData from './molochFetchData.js';
import otherConfig from './otherConfig';
import Proposal from './proposal';



function DaoInteractionPane(props) {


  const [listOfDaos, setListOfDaos] = useState([]); //hold list of all daos of which the user is a member
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
  useEffect(() => {


  async function load() {

    if (props.summonerContract.methods) { //if not yet init, do nothing. this avoids an err message. but will auto run again when properly init
    const totalNumberOfDaos = await props.summonerContract.methods.numberOfDaos().call();

    var usersDaos = [];
    for (let i = 0; i<totalNumberOfDaos; i++) {
      const daoAddress = await props.summonerContract.methods.addressLUT(i).call();
      const daoInstance = new props.web3js.eth.Contract(molochContractABI, daoAddress);
      const memberInDao = await daoInstance.methods.checkMemberInDao(props.account);
      if (memberInDao) {
        usersDaos.push(daoAddress);
      }
    }

    //then for each dao address, check if daoAddress.members[user.addresss] exists, if so build array for this.

    setListOfDaos(usersDaos);
    console.log("daos of which user is a member: " + usersDaos);

    var getterFunctions = [];
    for (let i = 0;i<molochContractABI.length;i++) {
      if (molochContractABI[i].uiLocation === "hidden" && molochContractABI[i].type == "function") {
        getterFunctions.push(molochContractABI[i].name);
      }
    }
    setContractGetterFunctions(getterFunctions);

    console.log(getterFunctions);
    var allFunctions = [];

    for (let i = 0;i<34;i++) {
      allFunctions.push(`var ${getterFunctions[i]}Data = await daoContract.methods.${getterFunctions[i]}().call;data.push(${getterFunctions[i]}Data)`);
    }



    var allAvailableContractFunctions =[];

    for (let i = 0;i<molochContractABI.length;i++) {
      if (molochContractABI[i].uiLocation !== "hidden" && molochContractABI[i].type == "function" && molochContractABI[i].uiLocation !== "lockedOff") {
        allAvailableContractFunctions.push(molochContractABI[i].name);
      }
    }
    setAvailableContractFunctions(allAvailableContractFunctions);
  }
}

  load();
}, [props.summonerContract]) //when props.summmonerContract is properly init, this function will run again.


function handleFunctionSelect(functionName) {
  for (let i = 0; i<molochContractABI.length;i++) {
    if (molochContractABI[i].name == functionName) {
      setSelectedContractFunction(molochContractABI[i]);
      console.log(functionName);
    }
  }
}

function makeFunctionButton(functionName) {
    return (
        <button
            onClick={() => handleFunctionSelect(functionName)}>
            {functionName}
        </button>
    );
}

// <ul>
// {availableContractFunctions.map(element => <li key = {element}> {makeFunctionButton(element)}</li>)}
// </ul>

function handleDaoSelect(daoAddress) {
  const daoInstance = new props.web3js.eth.Contract(molochContractABI, daoAddress);
  setCurrentDaoAddress(daoAddress);
  setCurrentDaoContract(daoInstance);
}

function makeDaoButton(daoAddress) {
    return (
        <button
            onClick={() => handleDaoSelect(daoAddress)}>
            {daoAddress}
        </button>
    );
}





const handleWithdraw = (event) => {
    event.preventDefault();

    alert("withdrawing")
    currentDaoContract.methods.withdrawBalance(otherConfig.tokenAddress,amountToBeWithdrawn).send(
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
}

function handleSubmitPaymentProposal(event) {
  event.preventDefault();

  alert("submitting proposal")
  if ((proposalSharesRq + proposalLootRq + proposalPaymentRq) > 0) {
    currentDaoContract.methods.submitProposal(
      proposalApplicant,
      proposalSharesRq,
      proposalLootRq,
      0,//tribute offered
      otherConfig.tokenAddress,//token that tribute is made in
      proposalPaymentRq,
      otherConfig.tokenAddress,//token that payment will be made in
      proposalDetails
    ).send(
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
  }
}

function handleSubmitGuildkickProposal(event) {
  event.preventDefault();

  alert("submitting proposal")
  if ((proposalSharesRq + proposalLootRq + proposalPaymentRq) > 0) {
    currentDaoContract.methods.submitGuildKickProposal(
      proposalApplicant,
      proposalDetails
    ).send(
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
  }
}


async function getAndSetNewData() { //called to refresh things
  const newData = await getData(currentDaoContract);
  console.log(newData)
  setCurrentDaoData(newData);
}

// const [proposalApplicant, setProposalApplicant] = useState('');
// const [proposalSharesRq, setProposalSharesRq] = useState(0);
// const [proposalLootRq, setProposalLootRq] = useState(0);
// const [proposalPaymentRq, setProposalPaymentRq] = useState(0);
// const [proposalDetails, setProposalDetails] = useState('');

async function handleFastForward(event) {
  event.preventDefault();
  currentDaoContract.methods.changeSummoningTime(currentDaoData.summoningTime - 604800).send(
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
  getAndSetNewData();

}

function handleTransfer() {

  let tokenContract = new props.web3js.eth.Contract(otherConfig.tokenABI, otherConfig.tokenAddress);

  tokenContract.methods.transfer(currentDaoAddress,1).send(
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
          onClick={e => handleSubmitGuildkickProposal(e)}>
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
      <li key = {currentDaoData.proposalData.propId}><Proposal proposalObj = {proposal} daoContract = {currentDaoContract} account = {props.account}/></li>);
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
    {listOfDaos.map(element => <li key = {element}> {makeDaoButton(element)}</li>)}
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
          onClick={() => handleWithdraw(amountToBeWithdrawn)}>
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
          onClick={e => handleFastForward(e)}>
          FF 7 days
      </button>
      <button
          onClick={() => currentDaoContract.methods.revertSummoningTime().send({from:props.account})}>
          Revert time
      </button>
      <button
          onClick={e => {e.preventDefault();getAndSetNewData()}}>
          get data
      </button>
      <button
          onClick={e => {e.preventDefault();handleTransfer()}}>
          Transfer 1 token to contract
      </button>
     </div>

  );
}

export default DaoInteractionPane;
