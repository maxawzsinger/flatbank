import contractConfigs from '../contractConfigs/contractConfigs';


//ABOUT: this function reads data from the treasury specified by daoContract, which is a web3js contract object abstracting over the on-chain contract.
//the data object declared below is returned at the end reflecting all important state in the contract.
//broadly, this is general information, information about members, and information about actions being taken within the treasury (proposals)
//because of Solidity limitations, it is often necessary to call getter functions for each item in arrays stored in the smart contract
//
async function getData(daoContract) {



  var data = {};

  //##################
  //GENERAL information
  //##################

  //get dao summoning time
  const summoningTime = await daoContract.methods.summoningTime().call();
  data.summoningTime = summoningTime;

  const originalSummoningTime = await daoContract.methods.originalSummoningTime().call();
  data.originalSummoningTime = originalSummoningTime;

  console.log('summoning time: ',summoningTime);
  console.log('og summoning time: ', originalSummoningTime);
  //build array of member objects holding information about each member of the DAO
  data.guildBalance = await daoContract.methods.getUserTokenBalance(contractConfigs.guildAddress, contractConfigs.tokenAddress).call();
  data.escrowBalance = await daoContract.methods.getUserTokenBalance(contractConfigs.escrowAddress, contractConfigs.tokenAddress).call();
  data.totalBalance = await daoContract.methods.getUserTokenBalance(contractConfigs.totalAddress, contractConfigs.tokenAddress).call();

  //##################
  //MEMBER INFORMATION
  //##################
  //get information about all members of the DAO
  const memberCount = await daoContract.methods.getMemberCount().call(); //number of DAO members
  data.memberCount = memberCount;

  var memberDataMap = {}; //to hold information about DAO members



  var shareCount = 0;
  var lootCount = 0;
  for (let i=0;i<memberCount;i++) {
    // console.log('LOGGING MEMBER ',i);
    const memberAddress = await daoContract.methods.memberList(i).call(); //get member address
    // console.log('member token balance: ', await daoContract.methods.getUserTokenBalance(memberAddress, contractConfigs.tokenAddress).call());
    const memberData = await daoContract.methods.members('0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266').call();
    //get Member object from the DAO.
    //call various contract helper functions to add to the Member object which already contains numerous fields
    try { //if true, member can leave the DAO
      memberData.ragequitStatus = await daoContract.methods.canRagequit(memberData.highestIndexYesVote).call();
      //this may revert as there is a require() in sol that at least 1 proposal exist
      //can change function canRagequit to include if highestIndexYesVote < proposalQueue.length return false instead of throwing revert error
    }
    catch(err) {
      memberData.ragequitStatus = false;
    }
    const proposedToKick = await daoContract.methods.proposedToKick(memberAddress).call();
    if (proposedToKick == true) {
      memberData.proposedToKick = true;
    } else {
      memberData.proposedToKick = false;
    }
    memberData.userTokenBalance = await daoContract.methods.getUserTokenBalance(memberAddress, contractConfigs.tokenAddress).call();

    memberData.sharesInt = parseInt(memberData.shares);
    memberData.lootInt = parseInt(memberData.loot);
    console.log(memberData.sharesInt);
    shareCount = shareCount +  memberData.sharesInt;
    lootCount += memberData.lootInt;
    memberDataMap[memberAddress] = memberData; //add to the above array
    // console.log('member highest index yes vote: ', memberData.highestIndexYesVote);
    // console.log('member jailed: ', memberData.jailed);
    // console.log('member shares: ', memberData.shares);
    // console.log('member loot: ', memberData.loot);
    // console.log('member period member last submit prop in: ', memberData.periodMemberLastSubmittedProposalIn);
    // console.log('prop submit in last period: ', memberData.proposalsSubmittedInLastPeriod);
    // console.log('member prop to kick: ', memberData.proposedToKick);
    // console.log('member rq stats: ', memberData.ragequitStatus);






  }

  data.memberInformation = memberDataMap;

  data.totalShares = shareCount;
  data.totalLoot = lootCount;

  //##################
  //PROPOSALS information
  //##################

  //get proposals in the queue (have been sponsored) and their position in the queue
  var proposalQueueMap = {};
  //proposalQueueMap is proposalId (which number proposal in history of contract) => proposalIndex (position of proposal in queue)
  const qLength = await daoContract.methods.getProposalQueueLength().call();
  console.log('q length:',qLength);
  for (let i = 0;i<qLength;i++) {
    const propId = await daoContract.methods.proposalQueue(i).call();
    console.log(propId);
    proposalQueueMap[propId] = i;
    }
  console.log(proposalQueueMap);

  // console.log('proposal queue: ', proposalQueueMap);

  //get information about all proposals in history of contract
  var proposalDataArray = [];
  const proposalCount = await daoContract.methods.proposalCount().call(); //number of proposals ever proposed
  const currentPeriod = await daoContract.methods.getCurrentPeriod().call(); //attach this to proposalData object below
  data.currentPeriod = parseInt(currentPeriod);
  console.log('currentPeriod',currentPeriod);


  if (proposalCount > 0) {
    for (let i=0;i<proposalCount;i++) {
      const proposalData = await daoContract.methods.proposals(i).call();
      console.log('starting period for prop: ', i, '-- starting period: ', proposalData.startingPeriod);

      proposalData.startingPeriod = parseInt(proposalData.startingPeriod);
      //add other data to proposalData obj, then push to array.
      var flagData = [];//holds the status of each proposal
      const flags = await daoContract.methods.getProposalFlags(i).call();

      proposalData.flags = flags;
      proposalData.propId = i; //set the same way in the contract - which number proposal in history of contract

      if (proposalQueueMap[i] >=0) {
        proposalData.propIndex = proposalQueueMap[i];
      }
      proposalData.currentPeriod = parseInt(currentPeriod);

      //SET PROPOSAL STATUS
      proposalData.status = 'error'; //default

      if (flags[0]==true) {
        proposalData.timeline = `
        Pre-voting will end and voting will start in period ${proposalData.startingPeriod}.
        Voting will end and grace period will begin in period ${proposalData.startingPeriod + 36}.
        Grace period will end and proposal can be processed in period ${proposalData.startingPeriod + 71}.
        `
      }

      if (flags[0]==false) {
        proposalData.status = 'Not yet scheduled';
      }

      if ( //current period is between starting period and starting period + 35 periods (7 days)

        ((proposalData.startingPeriod + 35 >  data.currentPeriod)
        &&
        (data.currentPeriod >= proposalData.startingPeriod))

        && flags[0] == true

      ) {
        proposalData.status = 'In voting stage';
      }

      if (data.currentPeriod > proposalData.startingPeriod + 35 && flags[0] == true){
        proposalData.status = 'Proposal is now in grace stage';
      }

      if (data.currentPeriod < proposalData.startingPeriod && flags[0] == true) {
        console.log(typeof currentPeriod);
        console.log(typeof proposalData.startingPeriod);
        console.log('prevoting');
        proposalData.status = 'Pre-voting stage';
      }

      if (data.currentPeriod > (proposalData.startingPeriod + 70) && flags[0] == true) {
        proposalData.status = 'Ready to process';
      }

      if (flags[1] == true && flags[2] == true) {
        proposalData.status = 'Passed';
      }

      if (flags[1] == true && flags[2] == false) {
        proposalData.status = 'Failed';
      }

      // console.log('prop status', proposalData.status);
      proposalDataArray.push(proposalData);
      // console.log('proposal: ', proposalData);
    }

  }

  let sortedDataArray = proposalDataArray.sort((a, b) => parseInt(b.propIndex) - parseInt(a.propIndex));
  data.proposalData = sortedDataArray;
  console.log(proposalDataArray);

  //testing purposes
  // console.log('proposal count: ', await daoContract.methods.proposalCount().call());
  // console.log('total shares: ', await daoContract.methods.totalShares().call());
  // console.log('total loot: ', await daoContract.methods.totalLoot().call());



  return data;
}

export default getData;
