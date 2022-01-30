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
import TextField from '@mui/material/TextField';



function ProposalForm(props) {

  const [applicant, setApplicant] = useState('');
  const [shares, setShares] = useState('');
  const [loot, setLoot] = useState('');
  const [payment,setPayment] = useState('');
  const [details, setDetails] = useState('');
  const [proposalType, setProposalType] = useState('payment');

  function handleSubmitPaymentProposal(event) {
    event.preventDefault();

    alert("submitting proposal")
    if ((shares + loot + payment) > 0) {
      props.molochMessenger.submitPaymentProposal(
        applicant,
        shares,
        loot,
        payment,
        details
      );
    };
  }

  if (proposalType === 'payment') {
    return(
      <Box sx = {{
        maxWidth : '300px',
        border : '2px solid',
        borderColor : '#2196f3',
        borderRadius : '5px',
        textAlign : 'left',
        mx: 2,
        my:2
      }}>

      <Button
          onClick={() => setProposalType('guildkick')}>
          Propose to kick a member
      </Button>
      <TextField
        sx={{
          mx : 2,
          mt : 2,
          alignSelf : 'stretch'

        }}
        label = 'Transaction to (hex address):'
        id="outlined-basic"
        variant="outlined"
        value = {applicant}
        onChange = {e => setApplicant(e.target.value)}
        />
        <TextField
          sx={{
            mx : 2,
            mt : 2,
            alignSelf : 'stretch'

          }}
          label = 'Number of voting shares to be dispensed:'
          id="outlined-basic"
          variant="outlined"
          value = {shares}
          onChange = {e => setShares(e.target.value)}
          />
          <TextField
            sx={{
              mx : 2,
              mt : 2,
              alignSelf : 'stretch'

            }}
            label = 'Number of non-voting shares to be dispensed:'
            id="outlined-basic"
            variant="outlined"
            value = {loot}
            onChange = {e => setLoot(e.target.value)}
            />
            <TextField
              sx={{
                mx : 2,
                mt : 2,
                alignSelf : 'stretch'

              }}
              label = 'Amount of payment to be dispensed:'
              id="outlined-basic"
              variant="outlined"
              value = {payment}
              onChange = {e => setPayment(e.target.value)}
              />
              <TextField
                sx={{
                  mx : 2,
                  mt : 2,
                  alignSelf : 'stretch'

                }}
                label = 'Proposal details:'
                id="outlined-basic"
                variant="outlined"
                value = {details}
                onChange = {e => setDetails(e.target.value)}
                />


      <Button
          onClick={e => handleSubmitPaymentProposal(e)}>
          Submit proposal
      </Button>
      </Box>
    )
  } else if (proposalType === 'guildkick'){

    return (

      <Box sx = {{
        maxWidth : '300px',
        border : '2px solid',
        borderColor : '#2196f3',
        borderRadius : '5px',
        textAlign : 'left',
        mx: 2,
        my:2        
      }}>

      <Button
          onClick={() => setProposalType('payment')}>
          Propose to make a payment
      </Button>
      <TextField
        sx={{
          mx : 2,
          mt : 2,
          alignSelf : 'stretch'

        }}
        label = 'Transaction to (hex address):'
        id="outlined-basic"
        variant="outlined"
        value = {applicant}
        onChange = {e => setApplicant(e.target.value)}
        />
      <TextField
        sx={{
          mx : 2,
          mt : 2,
          alignSelf : 'stretch'

        }}
        label = 'Proposal details:'
        id="outlined-basic"
        variant="outlined"
        value = {details}
        onChange = {e => setDetails(e.target.value)}
        />
      <Button
          onClick={e => {e.preventDefault();props.molochMessenger.submitGuildKickProposal(applicant,details);}}>
          Submit proposal
      </Button>
      </Box>
    )
  }
}

export default ProposalForm;
