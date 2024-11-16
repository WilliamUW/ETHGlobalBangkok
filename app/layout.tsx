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
