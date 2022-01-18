import {useState, useEffect} from 'react';
import otherConfig from './otherConfig';

//TO DO - need to properly pass in props as has been specified in here - mostly the entire proposal object for each proposal component, as well as a props.account, props. daoContract
function Proposal(props) { //pass in summonerContract and web3js obj and accout addr to props


  //most of these are for updating state instantly for UX
  const [yesVotes, setYesVotes] = useState(0); //this should update immediately to be exciting
  const [noVotes, setNoVotes] = useState(0); //likewise
  const [cleanPaymentString, setCleanPaymentString] = useState(''); //for displaying a clean readout of proposal formal details
  const [cancellationStatus,setCancellationStatus] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');

  useEffect(() => {

    //initialise votes and then people can vote on their end which will reflect immediately for good ux. might take some time to update on other ppls (via getData() chron)
    setYesVotes(props.proposalObj.yesVotes);
    setNoVotes(props.proposalObj.noVotes);

    if (props.proposalObj.flags[5] == true) { //indicates proposal is guildkick
        setCleanPaymentString(`${props.proposalObj.proposer}: Remove ${props.proposalObj.applicant} from the treasury`);
    } else if (props.proposalObj.flags[4] ==false) {
      //indicates proposal is some kind of transfer. build a nice looking string describing the combination of proposal items.
      var cleanPaymentStringArray = [];

      if (props.proposalObj.sharesRequested > 0) {
        cleanPaymentStringArray.push(`${props.proposalObj.sharesRequested} voting shares`);
      }

      if (props.proposalObj.lootRequested > 0) {
        cleanPaymentStringArray.push(`${props.proposalObj.lootRequested} non-voting shares`);
      }

      if (props.proposalObj.paymentRequested > 0) {
        cleanPaymentStringArray.push(`${props.proposalObj.paymentRequested} payment`);
      }

      if (cleanPaymentStringArray.length === 1) {

        setCleanPaymentString(`${props.proposalObj.proposer}: Give ${props.proposalObj.applicant} ${cleanPaymentStringArray[0]}`);

    } else if (cleanPaymentStringArray.length === 2) {
      setCleanPaymentString(`${props.proposalObj.proposer}: Give ${props.proposalObj.applicant} ${cleanPaymentStringArray[0]} and ${cleanPaymentStringArray[1]}`);

    } else if (cleanPaymentStringArray.length === 3) {

        setCleanPaymentString(`${props.proposalObj.proposer}: Give ${props.proposalObj.applicant} ${cleanPaymentStringArray[0]}, ${cleanPaymentStringArray[1]}, and ${cleanPaymentStringArray[2]}`);

    }
  }

 }, [])



  function submitVote(voteType){ //vote type is either 1 (yes) or 2 (no) - this is the format expected by the smart contract
        alert("submitting vote");
        props.daoContract.methods.submitVote(props.proposalObj.propIndex, voteType).send(
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

function handleCancelProposal() {
  props.daoContract.methods.cancelProposal(props.proposalObj.propId).send(
    {from: props.proposalObj.account}
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

  setCancellationStatus('This proposal has been cancelled');
}

function handleApproveProposal() {
  console.log('prop id');
  console.log(props.proposalObj.propId);
  props.daoContract.methods.sponsorProposal(props.proposalObj.propId).send(
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

  setApprovalStatus('This proposal has been approved');
}


  let proposalStatus;
  //there are 4 possible statuses
  // voting has commenced (provide buttons for member to vote)
  //voting has finished
  //voting has not yet commenced (user is not the proposal submitter)
  //voting has not yet commenced (user is the proposal submitter, provide cancellation button)
  if (props.proposalObj.currentPeriod == props.proposalObj.startingPeriod) {
    proposalStatus =
      <p>
        <p>
          Voting has commenced
        </p>
        <p>
          <button onClick={event => {event.preventDefault(); submitVote(1); setYesVotes(yesVotes+1)}}>Vote yes</button>
          <button onClick={event => {event.preventDefault(); submitVote(2); setNoVotes(noVotes+1)}}>Vote no</button>
        </p>
      </p>
    } else if (props.proposalObj.currentPeriod - 7 == props.proposalObj.startingPeriod) {
      proposalStatus = <p>Voting has ended, currently in grace period</p>
    } else if (props.proposalObj.currentPeriod < props.proposalObj.startingPeriod) {
        if (props.account == props.proposalObj.proposer) {
            proposalStatus =
            <p>
            <p>Voting has not yet commenced</p>
            <button onClick={event => {event.preventDefault(); handleCancelProposal()}}>Cancel proposal</button>
            {cancellationStatus}
            </p>
              //cancel if prop.account = prop.proposer
        } else {
            proposalStatus =  <p>Voting has not yet commenced</p>
        }

    } else { //proposal starting period won't exist because proposal hasn't been yet sponsored

            proposalStatus =
            <p>
              <button onClick={event => {event.preventDefault(); handleApproveProposal()}}>Schedule proposal for vote</button>
              <p>
                {approvalStatus}
              </p>
            </p>

  }

  return (

  <div className="Proposal">

    <p>
      {cleanPaymentString}
    </p>
    <div>
    {proposalStatus}
    </div>
    <p>
    Details: {props.proposalObj.details}
    </p>



  </div>
  );
  }

export default Proposal;
