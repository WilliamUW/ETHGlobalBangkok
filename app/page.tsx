"use client";

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { CameraIcon, Upload, Box } from "lucide-react";
import Image from "next/image";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { motion } from "framer-motion";

import HandleSubmit from "./HandleSubmit";

export default function Home() {
  const { primaryWallet } = useDynamicContext();
  const publicKey = primaryWallet?.address;

  

  return (
    <div className="container mx-auto p-4 max-w-md align-middle justify-center  min-h-screen">
      <motion.div
        className="mb-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <DynamicWidget />
      </motion.div>
      {!publicKey && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className=" border-2 border-blue-500 rounded-xl shadow-lg overflow-hidden">
            <CardHeader className="text-center">
              <h2 className="text-3xl font-bold text-blue-500 mb-4">
                Welcome to WaterFinder
              </h2>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="mb-8 relative w-64 h-64">
                <Image
                  src="/logo.webp"
                  alt="WaterFinder Logo"
                  width={256}
                  height={256}
                  className="rounded-full"
                />
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                  <Box className="w-32 h-32 text-blue-500 animate-pulse" />
                </div>
              </div>
              <div className="space-y-6 w-full ">
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <Box className="w-8 h-8 text-blue-500" />
                  <p className="text-lg">1. Connect your wallet</p>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ x: 50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <Upload className="w-8 h-8 text-blue-500" />
                  <p className="text-lg">2. See all the nearby water fountains and restrooms</p>
                </motion.div>
                <motion.div
                  className="flex items-center space-x-4"
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <CameraIcon className="w-8 h-8 text-blue-500" />
                  <p className="text-lg">
                    3. Upload any nearby facility to help other users!
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
      

      {publicKey && <HandleSubmit />}
    </div>
  );
}
