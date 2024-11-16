"use client";

import React from "react";
// import Image from "next/image";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

import HandleSubmit from "./HandleSubmit";
import {SplashPage} from "@/components/SplashPage";

export default function Home() {
  const { primaryWallet } = useDynamicContext();
  const publicKey = primaryWallet?.address;

  return (
    <div className="container mx-auto p-4 max-w-md align-middle justify-center  min-h-screen">
      {!publicKey && <SplashPage /> }

      {publicKey && <HandleSubmit />}
    </div>
  );
}
