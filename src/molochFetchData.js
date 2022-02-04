import contractConfigs from './contractConfigs';

async function getData(daoContract) {

  //receives a web3js Contract object representing the DAO selected by the user

  var data = {}; //this will hold

  //TIME information
  //get dao summoning time
  const summoningTime = await daoContract.methods.summoningTime().call();
  data.summoningTime = summoningTime;

  const originalSummoningTime = await daoContract.methods.originalSummoningTime().call();
  data.originalSummoningTime = originalSummoningTime;
  //build array of member objects holding information about each member of the DAO
  data.guildBalance = await daoContract.methods.getUserTokenBalance(contractConfigs.guildAddress, contractConfigs.tokenAddress).call();
  data.escrowBalance = await daoContract.methods.getUserTokenBalance(contractConfigs.escrowAddress, contractConfigs.tokenAddress).call();
  data.totalBalance = await daoContract.methods.getUserTokenBalance(contractConfigs.totalAddress, contractConfigs.tokenAddress).call();
  console.log('**********LOGGING MEMBERS');

  //MEMBERS
  //get information about all members of the DAO
  const memberCount = await daoContract.methods.getMemberCount().call(); //number of DAO members
  data.memberCount = memberCount;

  var memberDataMap = {}; //to hold information about DAO members



  var shareCount = 0;
  var lootCount = 0;
  for (let i=0;i<memberCount;i++) {
    // console.log('LOGGING MEMBER ',i);
    const memberAddress = await daoContract.methods.memberList(i).call(); //get member address
    console.log('memberAddress ', memberAddress);
    // console.log('member token balance: ', await daoContract.methods.getUserTokenBalance(memberAddress, contractConfigs.tokenAddress).call());
    const memberData = await daoContract.methods.members(memberAddress).call(); //get Member object from the DAO.
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
    console.log('sharecount',shareCount);
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
  console.log('member data: ', memberDataMap);

  data.totalShares = shareCount;
  data.totalLoot = lootCount;
  console.log(shareCount);
  console.log(lootCount);
  console.log('**********LOGGING PROPOSALS');

  //PROPOSALS
  //get proposals in the queue (have been sponsored) and their position in the queue
  var proposalQueueMap = {};
  //proposalQueueMap is proposalId (which number proposal in history of contract) => proposalIndex (position of proposal in queue)
  const qLength = await daoContract.methods.getProposalQueueLength().call();
  for (let i = 0;i<qLength;i++) {
    const propId = await daoContract.methods.proposalQueue(i).call();
    proposalQueueMap[propId] = i;
    }

  // console.log('proposal queue: ', proposalQueueMap);

  //get information about all proposals in history of contract
  var proposalDataArray = [];
  const proposalCount = await daoContract.methods.proposalCount().call(); //number of proposals ever proposed
  const currentPeriod = await daoContract.methods.getCurrentPeriod().call(); //attach this to proposalData object below

  if (proposalCount > 0) {
    for (let i=0;i<proposalCount;i++) {
      const proposalData = await daoContract.methods.proposals(i).call();

      //add other data to proposalData obj, then push to array.
      var flagData = [];//holds the status of each proposal
      const flags = await daoContract.methods.getProposalFlags(i).call();

      proposalData.flags = flags;
      proposalData.propId = i; //set the same way in the contract - which number proposal in history of contract
      if (proposalQueueMap[i]) {
        proposalData.propIndex = proposalQueueMap[i];
      }
      proposalData.currentPeriod = currentPeriod;
      if ((currentPeriod == proposalData.startingPeriod) && flags[0] == true) {
        proposalData.status = 'In voting stage';
      } else if (currentPeriod - 7 == proposalData.startingPeriod){
        proposalData.status = 'Proposal is now in grace stage';
      } else if (currentPeriod < proposalData.startingPeriod) {
        proposalData.status = 'Pre-voting stage';
      } else if (currentPeriod >= (proposalData.startingPeriod + 14)) {
        proposalData.status = 'Ready to process';
      } else if (flags[1] == true && flags[2] == true) {
        proposalData.status = 'Passed';
      } else if (flags[1] == true && flags[2] == false) {
        proposalData.status = 'Failed';
      } else {
        proposalData.status = 'Not yet scheduled';
      }

      // console.log('prop status', proposalData.status);
      proposalDataArray.push(proposalData);
      // console.log('proposal: ', proposalData);
    }

  }

  data.proposalData = proposalDataArray;

  //testing purposes
  // console.log('proposal count: ', await daoContract.methods.proposalCount().call());
  // console.log('total shares: ', await daoContract.methods.totalShares().call());
  // console.log('total loot: ', await daoContract.methods.totalLoot().call());



  return data;
}

export default getData;
