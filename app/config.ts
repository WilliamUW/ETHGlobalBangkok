import { createPublicClient, createWalletClient, custom, http } from "viem";
import {
  polygonAmoy,
  skaleNebulaTestnet,
  morphHolesky,
  flowTestnet,
} from "viem/chains";

export const SKALE = 37084624;
export const POLYGON = 80002;
export const FLOW = 545;

export const polygonContractAddress = "0x4d0379bbd839b360fac03d0020efd85b220a5cd7";
export const flowContractAddress = "0x94c19Bf5be886B5dF611A18eA714dE2001927e44"

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

export const skalePublicClient = createPublicClient({
  chain: skaleNebulaTestnet,
  transport: http(),
});

export const skaleWalletClient =
  typeof window !== "undefined" && window.ethereum
    ? createWalletClient({
        chain: skaleNebulaTestnet,
        transport: custom(window.ethereum),
      })
    : null;

// JSON-RPC Account
// ts-expect-error await
export const account = polygonWalletClient
  ? await polygonWalletClient.getAddresses().then((addresses) => addresses[0])
  : null;
