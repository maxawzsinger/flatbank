import otherConfig from './otherConfig';
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


  //MEMBERS
  //get information about all members of the DAO
  const memberCount = await daoContract.methods.getMemberCount().call(); //number of DAO members

  var memberDataArray = []; //to hold information about DAO members

  //build array of member objects holding information about each member of the DAO
  console.log('guild token balance: ', await daoContract.methods.getUserTokenBalance('0x8626f6940e2eb28930efb4cef49b2d1f2c9c1199', contractConfigs.tokenAddress).call());
  console.log('escrow token balance: ', await daoContract.methods.getUserTokenBalance('0xdd2fd4581271e230360230f9337d5c0430bf44c0', contractConfigs.tokenAddress).call());
  console.log('total token balance: ', await daoContract.methods.getUserTokenBalance('0xbda5747bfd65f08deb54cb465eb87d40e51b197e', contractConfigs.tokenAddress).call());
  console.log('**********LOGGING MEMBERS');
  for (let i=0;i<memberCount;i++) {
    console.log('LOGGING MEMBER ',i);
    const memberAddress = await daoContract.methods.memberList(i).call(); //get member address
    console.log('member token balance: ', await daoContract.methods.getUserTokenBalance(memberAddress, contractConfigs.tokenAddress).call());
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
    memberDataArray.push(memberData); //add to the above array
    console.log('member highest index yes vote: ', memberData.highestIndexYesVote);
    console.log('member jailed: ', memberData.jailed);
    console.log('member shares: ', memberData.shares);
    console.log('member loot: ', memberData.loot);
    console.log('member period member last submit prop in: ', memberData.periodMemberLastSubmittedProposalIn);
    console.log('prop submit in last period: ', memberData.proposalsSubmittedInLastPeriod);
    console.log('member prop to kick: ', memberData.proposedToKick);
    console.log('member rq stats: ', memberData.ragequitStatus);






  }

  data.memberInformation = memberDataArray;

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

  console.log('proposal queue: ', proposalQueueMap);

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
      proposalDataArray.push(proposalData);
      console.log('proposal: ', proposalData);
    }

  }

  data.proposalData = proposalDataArray;

  //testing purposes
  console.log('proposal count: ', await daoContract.methods.proposalCount().call());
  console.log('total shares: ', await daoContract.methods.totalShares().call());
  console.log('total loot: ', await daoContract.methods.totalLoot().call());



  return data;
}

export default getData;
