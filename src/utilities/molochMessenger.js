import contractConfigs from '../contractConfigs/contractConfigs.js';
import getData from './molochFetchData.js';


//MolochMessenger ABOUT:
//this object packages all functions that interact with both the treasury creation smart contract and
//the treasury smart contract itself. some of these functions contain a lot of repeated code and also parameters that for the purposes of this particular website are hardcoded.
// these functions are themselves attached to web3js contract objects which abstract over the raw transaction request syntax.
//below, summon refers to the treasury creation smart contract web3js object, token to the token contract, dao to the treasury contract,
//account is the user's current wallet hex addresses
//and updateTXReturn is a setState method updating any response from MetaMask on transaction request, to be passed down to child components for display

export function MolochMessenger(summon, token, dao, account, updateTXReturn) {

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

    let shares = parseInt(sharesRequested);
    //shares requested is the empty string (user has not put a value in) so parseInt return NaN. same with below checks -- if(!var)
    if (!shares) {
      shares = 0;
    };
    let loot = parseInt(lootRequested);
    if (!loot) {
      loot = 0;
    };
    let payment = parseInt(paymentRequested);
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
    console.log('in pp, ',proposalIndex, typeof proposalIndex);
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
    let intShares = []
    for (let i=0;i<shares.length;i++) {
      intShares.push(parseInt(shares[i]));
    }
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
  this.fastForward = async function(desiredPeriod) {
    //change summoning time to make the current time the desired periodDuration
    const currentTime = Math.round(Date.now() / 1000) //seconds since epoch
    const newSummoningTime = (-17280 * parseInt(desiredPeriod)) + currentTime;


    dao.methods.changeSummoningTime(newSummoningTime).send(
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
