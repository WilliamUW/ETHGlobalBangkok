"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Droplet, MapPin, TableIcon as Toilet, Trophy, Activity } from 'lucide-react';

export default function Profile() {
  const { primaryWallet } = useDynamicContext();

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-blue-500 rounded-xl shadow-lg overflow-hidden">
          <CardHeader className="p-6 text-center bg-blue-900">
            <motion.img
              src="https://media.licdn.com/dms/image/v2/D5603AQG5efoV2B-P8Q/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1674067603082?e=1733356800&v=beta&t=KBy_a7n2ss4HXhUensd8bDGKrmkQ-AWWdCoVzhVYVFI"
              alt="Profile"
              width={120}
              height={120}
              className="rounded-full mx-auto mb-4 border-4 border-blue-500"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
            <h2 className="text-3xl font-bold text-white">William Wang</h2>
            <p className="text-sm text-blue-300">{primaryWallet?.address}</p>
            <p className="text-sm text-blue-100 mt-2">Restroom and Water Fountain Scout</p>
          </CardHeader>
          <CardContent className="p-6">
            <motion.div
              className="mb-6"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-2xl font-semibold text-blue-500 mb-3 flex items-center">
                <Activity className="mr-2" /> Scan Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center">
                  <Toilet className="mr-2 text-blue-500" />
                  <p className="text-lg">Restrooms Scanned: 78</p>
                </div>
                <div className="flex items-center">
                  <Droplet className="mr-2 text-blue-500" />
                  <p className="text-lg">Water Fountains Scanned: 42</p>
                </div>
              </div>
              <p className="text-lg mt-2">Total Scans: 120</p>
            </motion.div>
            <motion.div
              className="mb-6"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-2xl font-semibold text-blue-500 mb-3 flex items-center">
                <Trophy className="mr-2" /> Achievements
              </h3>
              <ul className="list-disc list-inside text-lg">
                <li>Restroom Reconnaissance Expert</li>
                <li>Hydration Hero</li>
                <li>Urban Facility Mapper</li>
              </ul>
            </motion.div>
            <motion.div
              className="mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <h3 className="text-2xl font-semibold text-blue-500 mb-3 flex items-center">
                <MapPin className="mr-2" /> Top Scan Locations
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold">Restrooms:</h4>
                  <p className="text-lg">1. Benchakitti Park, Bangkok</p>
                  <p className="text-lg">2. Golden Gate Park, SF</p>
                  <p className="text-lg">3. Hyde Park, London</p>
                </div>
                <div>
                  <h4 className="font-semibold">Water Fountains:</h4>
                  <p className="text-lg">1. Benchakitti Park, Bangkok</p>
                  <p className="text-lg">2. Millennium Park, Chicago</p>
                  <p className="text-lg">3. Ueno Park, Tokyo</p>
                </div>
              </div>
            </motion.div>
            <motion.div
              className="mb-6"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <h3 className="text-2xl font-semibold text-blue-500 mb-3">Recent Activity</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Toilet className="mr-2 text-blue-500" />
                  <span>Scanned a restroom at Benchakitti Park, Bangkok (2 hours ago)</span>
                </li>
                <li className="flex items-center">
                  <Droplet className="mr-2 text-blue-500" />
                  <span>Added a new water fountain at Benchakitti Park, Bangkok (1 day ago)</span>
                </li>
                <li className="flex items-center">
                  <Trophy className="mr-2 text-blue-500" />
                  <span>Earned Hydration Hero badge (2 days ago)</span>
                </li>
              </ul>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300">
                Edit Profile
              </Button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}