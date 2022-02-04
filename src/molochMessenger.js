import contractConfigs from './contractConfigs.js';
import getData from './molochFetchData.js';


//write functions up here

// initialize object const = {}

export function MolochMessenger(summon, token, dao, account, updateTXReturn) {
  //summoner is summonMoloch web3js contract, dao is daoInstance contract, token is token contract

  this.voteOnProposal = function(proposalIndex,voteType) {
    dao.methods.submitVote(proposalIndex,voteType).send(
      {from: account}
    ).on('transactionHash', function(hash){
        console.log(hash);
    })
    .on('receipt', function(receipt){
        console.log(receipt);
        updateTXReturn(receipt);


    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber);
    })
    .on('error', function(error, receipt) {
        console.log(error);
        updateTXReturn(error);
    });
  }

  this.approveProposal = function(proposalId) {
    dao.methods.sponsorProposal(proposalId).send(
      {from: account}
    ).on('transactionHash', function(hash){
        console.log(hash);
        console.log('logged');
    })
    .on('receipt', function(receipt){
        console.log(receipt);
        console.log('tx received');

        updateTXReturn(receipt);
        console.log('log',this.lastTransactionReceipt);

    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber);
    })
    .on('error', function(error, receipt) {
        console.log(error);
        updateTXReturn(error);

    });
  }

  this.cancelProposal = function(proposalIndex) {
    dao.methods.cancelProposal(proposalIndex).send(
      {from: account}
    ).on('transactionHash', function(hash){
        console.log(hash);
    })
    .on('receipt', function(receipt){
        console.log(receipt);
        updateTXReturn(receipt);

    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber);
    })
    .on('error', function(error, receipt) {
        console.log(error);
        updateTXReturn(error);

    });
  }



  this.withdrawBalance = function(amount) {
    dao.methods.withdrawBalance(contractConfigs.tokenAddress,amount).send(
      {from: account}
    ).on('transactionHash', function(hash){
        console.log(hash);
    })
    .on('receipt', function(receipt){
        console.log(receipt);
        updateTXReturn(receipt);

    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber);
    })
    .on('error', function(error, receipt) {
        console.log(error);
        updateTXReturn(error);

    });
  }

  this.submitPaymentProposal = function(
    applicant,
    sharesRequested,
    lootRequested,
    paymentRequested,
    details
  ) {

    const shares = parseInt(sharesRequested);
    if (!shares) { //shares requested is the empty string (user has not put a value in) so parseInt return NaN
      shares = 0;
    };
    const loot = parseInt(lootRequested);
    if (!loot) {
      loot = 0;
    };
    const payment = parseInt(paymentRequested);
    if (!payment) {
      payment = 0;
    };

    dao.methods.submitProposal(
      applicant,
      parseInt(sharesRequested),
      parseInt(lootRequested),
      0, //0 is tribute offered
      contractConfigs.tokenAddress,
      parseInt(paymentRequested),
      contractConfigs.tokenAddress,
      details
    ).send(
      {from: account}
    ).on('transactionHash', function(hash){
        console.log(hash);
    })
    .on('receipt', function(receipt){
        console.log(receipt);
        console.log('tx received');
        updateTXReturn(receipt);
        console.log('log',this.lastTransactionReceipt);


    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber);
    })
    .on('error', function(error, receipt) {
        console.log(error);
        updateTXReturn(error);

    });
    console.log('pingers');

  }

  this.submitGuildKickProposal = function(applicant, details) {
    dao.methods.submitGuildKickProposal(applicant, details).send(
      {from: account}
    ).on('transactionHash', function(hash){
        console.log(hash);
    })
    .on('receipt', function(receipt){
        console.log(receipt);
        updateTXReturn(receipt);

    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber);
    })
    .on('error', function(error, receipt) {
        console.log(error);
        updateTXReturn(error);

    });

  };


  this.getData = async function() {
    return await getData(dao);
  };

  this.sendToDao = function(amount) {

    token.methods.approve(dao.options.address,amount).send(
    {from: account}
  ).on('transactionHash', function(hash){
      console.log(hash);
  })
  .on('receipt', function(receipt){
      console.log(receipt);
      updateTXReturn(receipt);

  })
  .on('confirmation', function(confirmationNumber, receipt){
      console.log(confirmationNumber);
  })
  .on('error', function(error, receipt) {
      console.log(error);
      updateTXReturn(error);

  });

  }

  this.processProposal = function(proposalIndex) {
    dao.methods.processProposal(proposalIndex
    ).send(
      {from: account}
    ).on('transactionHash', function(hash){
        console.log(hash);
    })
    .on('receipt', function(receipt){
        console.log(receipt);
        updateTXReturn(receipt);

    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber);
    })
    .on('error', function(error, receipt) {
        console.log(error);
        updateTXReturn(error);

    })
  };



  this.summon = function(addresses,shares) { //arrays of founding members are their shares. array lengths must be equal
    summon.methods.summonMoloch(
      addresses,
      contractConfigs.tokenAddress, //approved tokens for use in the dao contract
      17280,  //period duration (4.8hr inseconds)
      35, //number of periods in voting phase (ie, 7 days)
      35,  //^ but in grace phase
      0, //proposal deposit
      3, //dilution bound refer to molochdao whitepaper
      0,  //processing reward
      shares
    ).send(
      {from: account}
    ).on('transactionHash', function(hash){
        console.log(hash);
    })
    .on('receipt', function(receipt){
        console.log(receipt);
        updateTXReturn(receipt);

    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber);
    })
    .on('error', function(error, receipt) {
        console.log(error);
        updateTXReturn(error);

    })
  };


///TEMP FUNCTIONS FOR DEV
  this.fastForward = async function() {
    const summoningTime = await dao.methods.summoningTime().call();

    dao.methods.changeSummoningTime(summoningTime - 604800).send(
      {from: account}
    ).on('transactionHash', function(hash){
        console.log(hash);
    })
    .on('receipt', function(receipt){
        console.log(receipt);
        updateTXReturn(receipt);

    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber);
    })
    .on('error', function(error, receipt) {
        console.log(error);
        updateTXReturn(error);

    });
  }

  this.revertTime = function() {
    dao.methods.revertSummoningTime().send(
      {from: account}
    ).on('transactionHash', function(hash){
        console.log(hash);
    })
    .on('receipt', function(receipt){
        console.log(receipt);
        updateTXReturn(receipt);

    })
    .on('confirmation', function(confirmationNumber, receipt){
        console.log(confirmationNumber);
    })
    .on('error', function(error, receipt) {
        console.log(error);
        updateTXReturn(error);

    });
  }

};


//pass in summonercontract object and dao instance object.

//add a function in app.js that takes in a dao address and creates a new dao instance to pass to MolochMessenger
//pass this as props to the interaction pane


// var usersDaos = [];
// for (let i = 0; i<totalNumberOfDaos; i++) {
//   const daoAddress = await props.summonerContract.methods.addressLUT(i).call();
//   const daoInstance = new props.web3js.eth.Contract(molochContractABI, daoAddress);
//   const memberInDao = await daoInstance.methods.checkMemberInDao(account);
//   if (memberInDao) {
//     usersDaos.push(daoAddress);
//   }
// }

// add this code to app.js and remove from daoInteractionPane

//replace stuff in my components with these functions

//haven't done : fast forward, revert summoning time
