import React, { useState } from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CameraIcon, Droplet, Wallet } from "lucide-react";
// import Image from "next/image";
import { motion } from "framer-motion";
import { DynamicWidget } from "@dynamic-labs/sdk-react-core";
import { Button } from "./ui/button";
import Link from "next/link";
import {
  IDKitWidget,
  VerificationLevel,
  ISuccessResult,
} from "@worldcoin/idkit";
import { verify } from "../app/utility/verifyBackend";

export const SplashPage = () => {
  const [isVerified, setIsVerified] = useState(false);
  const onSuccess = () => {
    setIsVerified(true);
  };
  const handleVerify = async (proof: ISuccessResult) => {
    const data = await verify(proof);
    if (data.success) {
      console.log("Successful response from backend:\n", JSON.stringify(data)); // Log the response from our backend for visibility
    } else {
      throw new Error(`Verification failed: ${data.detail}`);
    }
  };
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5 }}
    >
      <motion.div
        className="mb-2"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <IDKitWidget
          app_id="app_4020275d788fc6f5664d986dd931e5e6"
          action="verify"
          signal="user_value" // any arbitrary value the user is committing to, e.g. a vote
          onSuccess={onSuccess}
          handleVerify={handleVerify} // callback when the proof is received
          verification_level={VerificationLevel.Device} // minimum verification level accepted, defaults to "orb"
        >
          {({ open }) => (
            <Button onClick={open}>
              {isVerified ? "✅ You are verified!" : "Verify with World ID"}
            </Button>
          )}
        </IDKitWidget>
        <DynamicWidget />
      </motion.div>
      <Card className=" border-2 border-blue-500 rounded-xl shadow-lg overflow-hidden">
        <CardHeader className="text-center">
          <h2 className="text-3xl font-bold text-blue-500 mb-4">
            Welcome to Hydrofy!
          </h2>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <div className="mb-8 relative w-48 h-48">
            {/* <Image
                  src="/logo.webp"
                  alt="Hydrofy Logo"
                  width={256}
                  height={256}
                  className="rounded-full"
                /> */}
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <Droplet className="w-32 h-32 text-blue-500 animate-pulse" />
            </div>
          </div>
          <div className="space-y-6 w-full ">
            <motion.div
              className="flex items-center space-x-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Wallet className="w-8 h-8 text-blue-500" />
              <p className="text-lg">1. Connect your wallet</p>
            </motion.div>
            <motion.div
              className="flex items-center space-x-4"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <Droplet className="w-8 h-8 text-blue-500" />
              <p className="text-lg">
                2. See all the nearby water fountains and restrooms
              </p>
            </motion.div>
            <motion.div
              className="flex items-center space-x-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <CameraIcon className="w-8 h-8 text-blue-500" />
              <p className="text-lg">
                3. Upload nearby facilities to help other users!
              </p>
            </motion.div>
            <motion.div
              className="flex items-center justify-center space-x-4"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Link href="/gallery">
                <Button variant="default" className="bg-blue-500 text-xl p-8">
                  Get Started!
                </Button>
              </Link>
            </motion.div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
