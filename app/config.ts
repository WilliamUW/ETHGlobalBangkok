import {
  createPublicClient,
  createWalletClient,
  custom,
  getContract,
  http,
  parseEventLogs,
  publicActions,
} from "viem";
import crypto from "crypto";

import {
  polygonAmoy,
  morphHolesky,
  flowTestnet,
  scrollSepolia,
  mantleSepoliaTestnet,
  zircuitTestnet,
  baseSepolia,
  lineaSepolia,
} from "viem/chains";

export const MANTLE = 5003;
export const POLYGON = 80002;
export const FLOW = 545;
export const SCROLL = 534351;
export const ZIRCUIT = 48899;

export const polygonContractAddress =
  "0x4d0379bbd839b360fac03d0020efd85b220a5cd7";
export const flowContractAddress = "0x94c19Bf5be886B5dF611A18eA714dE2001927e44";
export const scrollContractAddress =
  "0x632e69488e25f1bec16a11cf1aa7b2261f2b94ef";
export const mantleContractAddress =
  "0x632e69488e25f1bec16a11cf1aa7b2261f2b94ef";
export const zircuitContractAddress =
  "0x632e69488e25f1bec16a11cf1aa7b2261f2b94ef";
export const morphContractAddress =
  "0xf0796fa044982b81514b9172834fe64e681723cc";
export const baseContractAddress = "0x968d147e523eed619180030e502c95700f1228b6";
export const lineaContractAddress =
  "0x632e69488e25f1bec16a11cf1aa7b2261f2b94ef";

export const polygonPublicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(),
});

export const polygonWalletClient =
  typeof window !== "undefined" && window.ethereum
    ? createWalletClient({
        chain: polygonAmoy,
        transport: custom(window.ethereum),
      })
    : null;

export const flowPublicClient = createPublicClient({
  chain: flowTestnet,
  transport: http(),
});

export const flowWalletClient =
  typeof window !== "undefined" && window.ethereum
    ? createWalletClient({
        chain: flowTestnet,
        transport: custom(window.ethereum),
      })
    : null;

export const morphPublicClient = createPublicClient({
  chain: morphHolesky,
  transport: http(),
});

export const morphWalletClient =
  typeof window !== "undefined" && window.ethereum
    ? createWalletClient({
        chain: morphHolesky,
        transport: custom(window.ethereum),
      })
    : null;

export const mantlePublicClient = createPublicClient({
  chain: mantleSepoliaTestnet,
  transport: http(),
});

export const mantleWalletClient =
  typeof window !== "undefined" && window.ethereum
    ? createWalletClient({
        chain: mantleSepoliaTestnet,
        transport: custom(window.ethereum),
      })
    : null;

export const zircuitPublicClient = createPublicClient({
  chain: zircuitTestnet,
  transport: http(),
});

export const zircuitWalletClient =
  typeof window !== "undefined" && window.ethereum
    ? createWalletClient({
        chain: zircuitTestnet,
        transport: custom(window.ethereum),
      })
    : null;

export const scrollPublicClient = createPublicClient({
  chain: scrollSepolia,
  transport: http(),
});

export const scrollWalletClient =
  typeof window !== "undefined" && window.ethereum
    ? createWalletClient({
        chain: scrollSepolia,
        transport: custom(window.ethereum),
      })
    : null;

export const basePublicClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
});

export const baseWalletClient =
  typeof window !== "undefined" && window.ethereum
    ? createWalletClient({
        chain: baseSepolia,
        transport: custom(window.ethereum),
      })
    : null;

export const lineaPublicClient = createPublicClient({
  chain: lineaSepolia,
  transport: http(),
});

export const lineaWalletClient =
  typeof window !== "undefined" && window.ethereum
    ? createWalletClient({
        chain: lineaSepolia,
        transport: custom(window.ethereum),
      })
    : null;

// JSON-RPC Account
// ts-expect-error await
export const account = polygonWalletClient
  ? await polygonWalletClient.getAddresses().then((addresses) => addresses[0])
  : null;
export const getClientContractAddress = (networkId: number) => {
  let client, walletClient, contractAddress;

  // Determine the correct client, wallet client, and contract address based on networkId
  switch (networkId) {
    case POLYGON:
      client = polygonPublicClient;
      walletClient = polygonWalletClient;
      contractAddress = polygonContractAddress;
      break;
    case FLOW:
      client = flowPublicClient;
      walletClient = flowWalletClient;
      contractAddress = flowContractAddress;
      break;
    case SCROLL:
      client = scrollPublicClient;
      walletClient = scrollWalletClient;
      contractAddress = scrollContractAddress;
      break;
    case MANTLE:
      client = mantlePublicClient;
      walletClient = mantleWalletClient;
      contractAddress = mantleContractAddress;
      break;
    case ZIRCUIT:
      client = zircuitPublicClient;
      walletClient = zircuitWalletClient;
      contractAddress = zircuitContractAddress;
      break;
    case morphHolesky.id:
      client = morphPublicClient;
      walletClient = morphWalletClient;
      contractAddress = morphContractAddress;
      break;
    case baseSepolia.id:
      client = basePublicClient;
      walletClient = baseWalletClient;
      contractAddress = baseContractAddress;
      break;
    case lineaSepolia.id:
      client = lineaPublicClient;
      walletClient = lineaWalletClient;
      contractAddress = lineaContractAddress;
      break;
    default:
      console.error("Unsupported network ID:", networkId);
      break;
  }

  // Fallback to Polygon as default if no client or contractAddress found
  if (!client || !contractAddress || !walletClient) {
    console.error("Falling back to Polygon network as default.");
    client = polygonPublicClient;
    walletClient = polygonWalletClient;
    contractAddress = polygonContractAddress;
  }

  return { client, walletClient, contractAddress };
};

export async function getRandomRewardNumber() {
  if (!(typeof window !== "undefined" && window.ethereum)) {
    return 0;
  }
  const client = createWalletClient({
    chain: baseSepolia,
    // ts-expect-error error
    transport: custom(window.ethereum),
  }).extend(publicActions);
  const coinFlipContract = getContract({
    address: "0x7c9d318bF4ac2B2B58468eE38eB107F4FFA0c5fB",
    abi: ICoinFlipAbi,
    client,
  });
  console.log("1. Generating user's random number...");

  const randomNumber: `0x${string}` = `0x${crypto
    .randomBytes(32)
    .toString("hex")}`;
  console.log(`User Generated Random number: ${randomNumber}`);

  console.log("\n2. Requesting coin flip...");

  const flipFee = await coinFlipContract.read.getFlipFee();
  console.log(`Flip Fee: ${flipFee} wei`);

  console.log("\n3. Sending request to flip coin...");

  const flipTxHash = await coinFlipContract.write.requestFlip([randomNumber], {
    // ts-expect-error error
    value: flipFee,
    account
  });
  console.log(`Transaction Hash: ${flipTxHash}`);

  const receipt = await client.waitForTransactionReceipt({
    hash: flipTxHash,
  });

  const logs = parseEventLogs({
    abi: ICoinFlipAbi,
    eventName: "FlipRequest",
    logs: receipt.logs,
  });

  const sequenceNumber = logs[0].args.sequenceNumber;

  console.log(`\nSequence Number: ${sequenceNumber}`);

  console.log("\n4. Waiting for flip result...");
  const result = await new Promise((resolve) => {
    const unwatch = coinFlipContract.watchEvent.FlipResult({
      // ts-expect-error error
      fromBlock: receipt.blockNumber - 1n,
      onLogs: (logs) => {
        for (const log of logs) {
          if (log.args.sequenceNumber === sequenceNumber) {
            unwatch();
            resolve(log.args.result);
          }
        }
      },
    });
  });

  console.log(`\nFlip Result: ${result}`);
  return result;
}

const ICoinFlipAbi = [
  {
    inputs: [
      {
        internalType: "uint64",
        name: "sequence",
        type: "uint64",
      },
      {
        internalType: "address",
        name: "provider",
        type: "address",
      },
      {
        internalType: "bytes32",
        name: "randomNumber",
        type: "bytes32",
      },
    ],
    name: "_entropyCallback",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "_entropy",
        type: "address",
      },
      {
        internalType: "address",
        name: "_entropyProvider",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "InsufficientFee",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "sequenceNumber",
        type: "uint64",
      },
    ],
    name: "FlipRequest",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint64",
        name: "sequenceNumber",
        type: "uint64",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "result",
        type: "uint256",
      },
    ],
    name: "FlipResult",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "userRandomNumber",
        type: "bytes32",
      },
    ],
    name: "requestFlip",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    stateMutability: "payable",
    type: "receive",
  },
  {
    inputs: [],
    name: "getFlipFee",
    outputs: [
      {
        internalType: "uint256",
        name: "fee",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;
