export const utilities = {
  produceProposalDescription : function(proposalObject) {
      if (proposalObject.flags[5] == true) { //indicates proposal is guildkick
          return `${proposalObject.proposer}: Remove ${proposalObject.applicant} from the treasury`;
      } else if (proposalObject.flags[4] ==false) {


        //indicates proposal is some kind of transfer. build a nice looking string describing the combination of proposal items.
        var cleanPaymentStringArray = [];

        if (proposalObject.sharesRequested > 0) {
          cleanPaymentStringArray.push(`${proposalObject.sharesRequested} voting shares`);
        }

        if (proposalObject.lootRequested > 0) {
          cleanPaymentStringArray.push(`${proposalObject.lootRequested} non-voting shares`);
        }

        if (proposalObject.paymentRequested > 0) {
          cleanPaymentStringArray.push(`${proposalObject.paymentRequested} payment`);
        }

        //now use array to build string

        if (cleanPaymentStringArray.length === 1) {

        return `${proposalObject.proposer}: Give ${proposalObject.applicant} ${cleanPaymentStringArray[0]}`;

        } else if (cleanPaymentStringArray.length === 2) {

        return `${proposalObject.proposer}: Give ${proposalObject.applicant} ${cleanPaymentStringArray[0]} and ${cleanPaymentStringArray[1]}`;

        } else if (cleanPaymentStringArray.length === 3) {

        return `${proposalObject.proposer}: Give ${proposalObject.applicant} ${cleanPaymentStringArray[0]}, ${cleanPaymentStringArray[1]}, and ${cleanPaymentStringArray[2]}`;

      }
    }
  },
  shortenAddress : function(address) {
    return (address.substring(0,5) + '...' +address.substring(address.length-3)).toLowerCase();
  }
};
