import {useState, useEffect} from 'react';
import * as React from 'react';

//mui components
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';

//About:
//uses molochMessenger to build a proposal for an existing treasury to join.




function RequestToJoinForm(props) {


  const [shares, setShares] = useState('');
  const [loot, setLoot] = useState('');
  const [payment,setPayment] = useState('');
  const [details, setDetails] = useState('');
  const [daoAddress, setDaoAddress] = useState('');

  function handleJoinSubmit() {




    if ((shares + loot + payment) > 0) {
      props.changeDao(daoAddress);
      props.molochMessenger.submitPaymentProposal(

        props.account,//from props
        shares,
        loot,
        payment,
        details
      )
    }else {
      alert('payment amount is0');
    }
  };

  useEffect(() => {
    if (props.lastTXReturn.transactionHash !== undefined) {
      //the return data on last transaction signals verified tx
      //also is not empty object as it is initialized as
    alert('successfully submited proposal to join');
  } else if (props.lastTXReturn.code!== undefined) { //return data is an error which has two properties - code and name. unsafe to rely on code
    alert(`there was an issue: ${props.lastTXReturn.message}`);
  }
  }, [props.lastTXReturn])

//add in textfields, export to daoSummonPane, pass in relevant props, make a dropdown for display.


  // function changeDao(daoAddress) {
  //   const daoInstance = new web3js.eth.Contract(contractConfigs.molochABI, daoAddress);
  //   const molochMessenger = new MolochMessenger(summonerContract, tokenContract, daoInstance, account, setLastTXReturn);
  //   setMolochMessenger(molochMessenger);
  //   console.log(daoInstance);
  // }

//adds more or less textfields depending on proposal type
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

      <Typography
            variant="h6"
            gutterBottom
            component="div"
            sx = {{mx:2,mt:2}}>
             Propose to join a Treasury
      </Typography>

      <TextField
        sx={{
          mx : 2,
          mt : 2,
          alignSelf : 'stretch'

        }}
        label = 'Treasury hex address:'
        id="outlined-basic"
        variant="outlined"
        value = {daoAddress}
        onChange = {e => setDaoAddress(e.target.value)}
        />
        <TextField
          sx={{
            mx : 2,
            mt : 2,
            alignSelf : 'stretch'

          }}
          label = 'Shares requested:'
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
            label = 'Loot requested:'
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
              label = 'Payment requested:'
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
                label = 'Detail:'
                id="outlined-basic"
                variant="outlined"
                value = {details}
                onChange = {e => setDetails(e.target.value)}
                />





      <Button
          onClick={() => handleJoinSubmit()}>
          Submit proposal to join
      </Button>

      </Box>
    )

}

//post

export default RequestToJoinForm;
