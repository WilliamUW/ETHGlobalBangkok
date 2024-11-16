"use client";

import React from "react";
// import Image from "next/image";

import { SplashPage } from "@/components/SplashPage";
import {Button} from "@/components/ui/button";
import {getRandomRewardNumber} from "./config";

export default function Home() {
  return (
    <div className="container p-4 max-w-md align-middle justify-center">
      <SplashPage />
      <Button onClick={() => getRandomRewardNumber()}>Pyth RNG</Button>
    </div>
  );
}
