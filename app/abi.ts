export const wagmiAbi = [
  {
    inputs: [
      {
        internalType: "string",
        name: "_ipfsCid",
        type: "string",
      },
      {
        internalType: "string",
        name: "_latitude",
        type: "string",
      },
      {
        internalType: "string",
        name: "_longitude",
        type: "string",
      },
      {
        internalType: "string",
        name: "_recordType",
        type: "string",
      },
      {
        internalType: "uint8",
        name: "_rating",
        type: "uint8",
      },
    ],
    name: "addRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "deleteRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "ipfsCid",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "latitude",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "longitude",
        type: "string",
      },
      {
        indexed: false,
        internalType: "string",
        name: "recordType",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "timestamp",
        type: "uint256",
      },
    ],
    name: "RecordAdded",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "recordIndex",
        type: "uint256",
      },
    ],
    name: "RecordDeleted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "user",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "recordIndex",
        type: "uint256",
      },
    ],
    name: "RecordRestored",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_index",
        type: "uint256",
      },
    ],
    name: "restoreRecord",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "getAllRecords",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsCid",
            type: "string",
          },
          {
            internalType: "string",
            name: "latitude",
            type: "string",
          },
          {
            internalType: "string",
            name: "longitude",
            type: "string",
          },
          {
            internalType: "string",
            name: "recordType",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isDeleted",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "rating",
            type: "uint8",
          },
        ],
        internalType: "struct RecordTracker.Record[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "getTotalRecordCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserRecordCount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_user",
        type: "address",
      },
    ],
    name: "getUserRecords",
    outputs: [
      {
        components: [
          {
            internalType: "string",
            name: "ipfsCid",
            type: "string",
          },
          {
            internalType: "string",
            name: "latitude",
            type: "string",
          },
          {
            internalType: "string",
            name: "longitude",
            type: "string",
          },
          {
            internalType: "string",
            name: "recordType",
            type: "string",
          },
          {
            internalType: "uint256",
            name: "timestamp",
            type: "uint256",
          },
          {
            internalType: "bool",
            name: "isDeleted",
            type: "bool",
          },
          {
            internalType: "uint8",
            name: "rating",
            type: "uint8",
          },
        ],
        internalType: "struct RecordTracker.Record[]",
        name: "",
        type: "tuple[]",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
