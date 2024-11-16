import type { Metadata } from "next";
import "./globals.css";
import { Inter } from "next/font/google";
import BottomNav from "@/components/ButtomNav";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";

import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { FlowWalletConnectors } from "@dynamic-labs/flow";
import { AppContextProvider } from "./AppContextProvider";
export const metadata: Metadata = {
  title: "ETHGlobal",
  description: "ETHGlobal",
};

const inter = Inter({ subsets: ["latin"] });

// Setting up list of evmNetworks
const myEvmNetworks = [
  {
    blockExplorerUrls: ['https://amoy.polygonscan.com/'],
    chainId: 80002,
    chainName: 'Polygon Amoy Testnet',
    iconUrls: ["https://app.dynamic.xyz/assets/networks/polygon.svg"],
    name: 'Polygon Amoy Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'MATIC',
      symbol: 'MATIC',
      iconUrl: 'https://app.dynamic.xyz/assets/networks/polygon.svg',
    },
    networkId: 80002,
    rpcUrls: ['https://polygon-amoy.g.alchemy.com/v2/PuM8zcodoMXyTiAgrENcLWRnhckxbFJw'],
    vanityName: 'Polygon Amoy Testnet',
  },
  {
    blockExplorerUrls: ['https://lanky-ill-funny-testnet.explorer.testnet.skalenodes.com/'],
    chainId: 37084624,
    chainName: 'SKALE Nebula Hub Testnet',
    iconUrls: ["https://pbs.twimg.com/profile_images/1511058435261009925/cpm25NwI_400x400.png"],
    name: 'SKALE Nebula Hub Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'sFUEL',
      symbol: 'sFUEL',
      iconUrl: 'https://pbs.twimg.com/profile_images/1511058435261009925/cpm25NwI_400x400.png',
    },
    networkId: 37084624,
    rpcUrls: ['https://testnet.skalenodes.com/v1/lanky-ill-funny-testnet'],
    vanityName: 'SKALE Nebula Hub Testnet',
  },
  {
    blockExplorerUrls: ['https://explorer-holesky.morphl2.io/'],
    chainId: 2810,
    chainName: 'Morph Holesky Testnet',
    iconUrls: ["https://app.dynamic.xyz/assets/networks/morph.svg"],
    name: 'Morph Holesky Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'ETH',
      symbol: 'ETH',
      iconUrl: 'https://app.dynamic.xyz/assets/networks/morph.svg',
    },
    networkId: 2810,
    rpcUrls: ['https://rpc-quicknode-holesky.morphl2.io/'],
    vanityName: 'Morph Holesky Testnet',
  },
  {
    blockExplorerUrls: ['https://evm-testnet.flowscan.io'],
    chainId: 545,
    chainName: 'EVM on Flow Testnet',
    iconUrls: ["https://app.dynamic.xyz/assets/networks/flow.svg"],
    name: 'EVM on Flow Testnet',
    nativeCurrency: {
      decimals: 18,
      name: 'FLOW',
      symbol: 'FLOW',
      iconUrl: 'https://app.dynamic.xyz/assets/networks/flow.svg',
    },
    networkId: 545,
    rpcUrls: ['https://testnet.evm.nodes.onflow.org'],
    vanityName: 'EVM on Flow Testnet',
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.className} bg-gradient-to-b from-purple-400 to-blue-500 min-h-screen`}
      >
        <main className="pb-16">
          <DynamicContextProvider
            settings={{
              // Find your environment id at https://app.dynamic.xyz/dashboard/developer
              environmentId: "8c70b21d-72a6-4cc5-88cf-e7e48f772dd9",
              walletConnectors: [
                EthereumWalletConnectors,
                FlowWalletConnectors,
              ],
              overrides: {
                evmNetworks: myEvmNetworks,
              }
            }}
          >
            <AppContextProvider>{children}</AppContextProvider>
          </DynamicContextProvider>
        </main>
        <BottomNav />
      </body>
    </html>
  );
}
