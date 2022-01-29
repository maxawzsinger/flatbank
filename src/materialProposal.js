import {useState, useEffect} from 'react';
import otherConfig from './otherConfig';
import {utilities} from './utilities';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';



function MaterialProposal(props) { //pass in summonerContract and web3js obj and accout addr to props


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


 const date = new Date((props.originalSummoningTime + (props.proposalObj.currentPeriod * 17280))*1000)

 let proposalDate = date.toLocaleString();

let actionButton;

let proposalStatus;

if ((props.proposalObj.currentPeriod == props.proposalObj.startingPeriod)&&props.proposalObj.flags[0]==true) { //flags[0] ==true means it has been sponsored
  proposalStatus = 'In voting stage';
  actionButton =
  <CardActions>
        <Button size="small" onClick={event => {
          event.preventDefault();
          props.molochMessenger.voteOnProposal(props.proposalObj.propId,1);
          setYesVotes(yesVotes+1)}}
          >Vote for</Button>
        <Button size="small" onClick={event => {
          event.preventDefault();
          props.molochMessenger.voteOnProposal(props.proposalObj.propId,2);
          setNoVotes(noVotes+1)}}
          >Vote against</Button>
  </CardActions>;
  } else if (props.proposalObj.currentPeriod - 7 == props.proposalObj.startingPeriod) {
    proposalStatus = "In grace stage";
  } else if (props.proposalObj.currentPeriod < props.proposalObj.startingPeriod) {
      if (props.account == props.proposalObj.proposer) {
          proposalStatus = "Pre-voting stage";
          actionButton =
          <CardActions>
            <Button size="small" onClick={event => {
              event.preventDefault();
              props.molochMessenger.cancelProposal(props.proposalObj.propId);
              setCancellationStatus('cancelled');
              console.log("cancelled proposal");}}
              >Cancel</Button>
          </CardActions>
            //cancel if prop.account = prop.proposer
      } else {
          proposalStatus = "Pre-voting stage";
      }

  } else { //proposal starting period won't exist because proposal hasn't been yet sponsored

          proposalStatus = "Not yet scheduled";
          actionButton =
          <CardActions>
            <Button size="small" onClick={event => {
              event.preventDefault();
              props.molochMessenger.approveProposal(props.proposalObj.propId);
              setApprovalStatus('This proposal has been approved');
              console.log("scheduled for vote");
            }}
            >Schedule proposal</Button>
          </CardActions>;
}



  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {proposalStatus}
        </Typography>
        <Typography variant="h5" component="div">
          Proposal
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {proposalDate}
        </Typography>
        <Typography variant="body2">
        {cleanPaymentString}. {props.proposalObj.details}
        </Typography>
      </CardContent>
      {actionButton}
    </Card>
  );
}

export default MaterialProposal;
