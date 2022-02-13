export const summonerABI = [
    {
      "constant": true,
      "inputs": [],
      "name": "numberOfDaos",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_summoner",
          "type": "address[]"
        },
        {
          "name": "_approvedTokens",
          "type": "address[]"
        },
        {
          "name": "_periodDuration",
          "type": "uint256"
        },
        {
          "name": "_votingPeriodLength",
          "type": "uint256"
        },
        {
          "name": "_gracePeriodLength",
          "type": "uint256"
        },
        {
          "name": "_proposalDeposit",
          "type": "uint256"
        },
        {
          "name": "_dilutionBound",
          "type": "uint256"
        },
        {
          "name": "_processingReward",
          "type": "uint256"
        },
        {
          "name": "_summonerShares",
          "type": "uint256[]"
        }
      ],
      "name": "summonMoloch",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_address",
          "type": "address"
        }
      ],
      "name": "getAddressAlias",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "template",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "addressAliases",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_address",
          "type": "address"
        },
        {
          "name": "_alias",
          "type": "string"
        }
      ],
      "name": "setAddressAlias",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "addressLUT",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "name": "daos",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_daoAdress",
          "type": "address"
        },
        {
          "name": "_daoTitle",
          "type": "string"
        },
        {
          "name": "_http",
          "type": "string"
        },
        {
          "name": "_version",
          "type": "uint256"
        }
      ],
      "name": "registerDao",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "name": "_template",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "moloch",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "summoner",
          "type": "address[]"
        },
        {
          "indexed": false,
          "name": "tokens",
          "type": "address[]"
        },
        {
          "indexed": false,
          "name": "summoningTime",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "periodDuration",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "votingPeriodLength",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "gracePeriodLength",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "proposalDeposit",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "dilutionBound",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "processingReward",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "summonerShares",
          "type": "uint256[]"
        }
      ],
      "name": "SummonComplete",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "name": "daoIdx",
          "type": "uint256"
        },
        {
          "indexed": false,
          "name": "moloch",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "title",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "http",
          "type": "string"
        },
        {
          "indexed": false,
          "name": "version",
          "type": "uint256"
        }
      ],
      "name": "Register",
      "type": "event"
    }
  ];
