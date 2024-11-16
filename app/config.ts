import { createPublicClient, createWalletClient, custom, http } from "viem";
import {
  polygonAmoy,
  skaleNebulaTestnet,
  morphHolesky,
  flowTestnet,
} from "viem/chains";

export const SKALE = 37084624;
export const POLYGON = 80002;

export const polygonContract = "0x0a09d03de8962ee30f4118230e6b224c5fcf8f23";

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
