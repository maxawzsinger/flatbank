import otherConfig from './otherConfig';

async function getData(daoContract) {

 //THIS IS THE THING THAT PERIODICALLY REFRESHES/called on submit proposal

if (daoContract.methods) { //dao has been selected
console.log('test');
var data = {}; //build this object over following function, and this gets returned at the end

//get time information
const summoningTime = await daoContract.methods.summoningTime().call();
data.summoningTime = summoningTime;
const originalSummoningTime = await daoContract.methods.originalSummoningTime().call();
data.originalSummoningTime = originalSummoningTime;
const currentPeriod = daoContract.methods.getCurrentPeriod().call; //attach to prop obj for render by component

//get member information
const memberCount = await daoContract.methods.getMemberCount().call();
var memberAddressArray = [];
for (let i=0;i<memberCount;i++) {
  const memberAddress = await daoContract.methods.memberList(i).call();
  memberAddressArray.push(memberAddress);
}
var memberDataArray =[];
for (let i=0;i<memberAddressArray.length;i++) {
  const memberData = await daoContract.methods.members(memberAddressArray[i]).call(); //obj
  try {
    memberData.ragequitStatus = await daoContract.methods.canRagequit(memberData.highestIndexYesVote).call(); //this may revert as there is a require() in sol that at least 1 proposal exist
    //can change function canRagequit to include if highestIndexYesVote < proposalQueue.length return false instead of throwing revert error
  }
  catch(err) {
    memberData.ragequitStatus = false;
  }
  const proposedToKick = await daoContract.methods.proposedToKick(memberAddressArray[i]).call();
  if (proposedToKick == true) {
    memberData.proposedToKick = true;
  } else {
    memberData.proposedToKick = false;
  }
  memberData.userTokenBalance = await daoContract.methods.getUserTokenBalance(memberAddressArray[i], otherConfig.tokenAddress).call();
  memberDataArray.push(memberData);
}
//get proposals data
var proposalQueueMap = {};//get proposalq (array of proposal ids) - that have been at least sponsored
const qLength = await daoContract.methods.getProposalQueueLength().call();
for (let i = 0;i<qLength;i++) {
  const propId = await daoContract.methods.proposalQueue(i).call();
  proposalQueueMap[propId] = i; //where i is proposalIndex in contract
  }

//now get all proposals ever submitted (sponsored or not)
var proposalDataArray = [];
const proposalCount = await daoContract.methods.proposalCount().call();
if (proposalCount > 0) {
  for (let i=0;i<proposalCount;i++) {
    const proposalData = await daoContract.methods.proposals(i).call();

    //add other data to proposalData obj, then push to array.
    var flagData = []

    const flags = await daoContract.methods.getProposalFlags(i).call();

    proposalData.flags = flags;
    proposalData.propId = i; //the count at time proposal was submitted
    if (proposalQueueMap[i]) {
      proposalData.propIndex = proposalQueueMap[i];
    }
    proposalData.currentPeriod = currentPeriod;


    proposalDataArray.push(proposalData);
  }

}

data.proposalData = proposalDataArray;

return data;
} else {
  console.log("check dao is selected");
}
}

export default getData;
