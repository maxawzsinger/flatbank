import {useState, useEffect} from 'react';
import otherConfig from './otherConfig';
import {utilities} from './utilities';

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
    setCleanPaymentString(utilities.produceProposalDescription(props.proposalObj));
 }, [])


  let proposalStatus;
  //there are 4 possible statuses
  // voting has commenced (provide buttons for member to vote)
  //voting has finished
  //voting has not yet commenced (user is not the proposal submitter)
  //voting has not yet commenced (user is the proposal submitter, provide cancellation button)
  if ((props.proposalObj.currentPeriod == props.proposalObj.startingPeriod)&&props.proposalObj.flags[0]==true) { //flags[0] ==true means it has been sponsored
    proposalStatus =
      <p>
        <p>
          Voting has commenced
        </p>
        <p>
          <button onClick={event => {event.preventDefault(); props.molochMessenger.voteOnProposal(props.proposalObj.propId,1); setYesVotes(yesVotes+1)}}>Vote yes</button>
          <button onClick={event => {event.preventDefault(); props.molochMessenger.voteOnProposal(props.proposalObj.propId,2); setNoVotes(noVotes+1)}}>Vote no</button>
        </p>
      </p>
    } else if (props.proposalObj.currentPeriod - 7 == props.proposalObj.startingPeriod) {
      proposalStatus = <p>Voting has ended, currently in grace period</p>
    } else if (props.proposalObj.currentPeriod < props.proposalObj.startingPeriod) {
        if (props.account == props.proposalObj.proposer) {
            proposalStatus =
            <p>
            <p>Voting has not yet commenced</p>
            <button onClick={event => {event.preventDefault(); props.molochMessenger.cancelProposal(props.proposalObj.propId);setCancellationStatus('cancelled');}}>Cancel proposal</button>
            {cancellationStatus}
            </p>
              //cancel if prop.account = prop.proposer
        } else {
            proposalStatus =  <p>Voting has not yet commenced</p>
        }

    } else { //proposal starting period won't exist because proposal hasn't been yet sponsored

            proposalStatus =
            <p>
              <button onClick={event => {
                event.preventDefault();
                props.molochMessenger.approveProposal(props.proposalObj.propId);
                setApprovalStatus('This proposal has been approved');
              }}>
              Schedule proposal for vote
              </button>
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
