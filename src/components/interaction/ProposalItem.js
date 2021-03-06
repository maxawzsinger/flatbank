import {useState, useEffect} from 'react';
import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {utilities} from '../../utilities/utilities';

//ABOUT: displays information about a proposal.

function ProposalItem(props) { //pass in summonerContract and web3js obj and accout addr to props

  console.log(props.originalSummoningTime);

  //most of these are for updating state instantly for UX
  const [yesVotes, setYesVotes] = useState(0); //this should update immediately to be exciting
  const [noVotes, setNoVotes] = useState(0); //likewise
  const [cancellationStatus,setCancellationStatus] = useState('');

  useEffect(() => {

    setYesVotes(props.proposalObj.yesVotes); //IS THIS AN ANTIPATTERN
    setNoVotes(props.proposalObj.noVotes);
 }, [])

//render dfferent cards depending on the status of the proposal

console.log((props.originalSummoningTime + (props.proposalObj.currentPeriod * 17280))*1000);
console.log('og summon time: ', props.originalSummoningTime);
console.log(typeof props.originalSummoningTime);
console.log('og summon time * 17280: ',props.proposalObj.startingPeriod*17280);
console.log(typeof props.proposalObj.startingPeriod);
console.log(typeof props.proposalObj.startingPeriod * 17280);
console.log((parseInt(props.proposalObj.startingPeriod)*17280) + parseInt(props.originalSummoningTime));


 const date = new Date((parseInt(props.originalSummoningTime) + (parseInt(props.proposalObj.currentPeriod * 17280)))*1000)

 let proposalDate = date.toLocaleString();


  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Status: {props.proposalObj.status}.
          {props.proposalObj.timeline}
        </Typography>
        <Typography variant="h5" component="div">
          Proposal
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {proposalDate}
        </Typography>
        <Typography variant="body2">
        {utilities.produceProposalDescription(props.proposalObj)}. {props.proposalObj.details}
        </Typography>
      </CardContent>
      {props.proposalObj.status === 'In voting stage' &&
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
      </CardActions>
    }
    {(props.proposalObj.status === 'Pre-voting stage') && (props.account == props.proposalObj.proposer) &&
    <CardActions>
      <Button size="small" onClick={event => {
        event.preventDefault();
        props.molochMessenger.cancelProposal(props.proposalObj.propId);
        setCancellationStatus('cancelled');
        console.log("cancelled proposal");}}
        >Cancel</Button>
    </CardActions>
    } {props.proposalObj.status === 'Not yet scheduled' &&
     <CardActions>
      <Button size="small" onClick={event => {
        event.preventDefault();
        props.molochMessenger.approveProposal(props.proposalObj.propId);
        console.log("scheduled for vote");
      }}
      >Schedule proposal</Button>
    </CardActions>
  }
  {props.proposalObj.status === 'Ready to process' &&
   <CardActions>
    <Button size="small" onClick={event => {
      event.preventDefault();
      console.log(props.proposalObj.propIndex);
      props.molochMessenger.processProposal(props.proposalObj.propIndex);
      console.log("processed");
    }}
    >Process proposal</Button>
  </CardActions>
}
    </Card>
  );
}

export default ProposalItem;
