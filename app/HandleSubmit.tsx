"use client";

import { useState, useRef, useEffect } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Upload, Camera } from "lucide-react";
import Image from "next/image";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { wagmiAbi } from "./abi";
import {
  account,
  getClientContractAddress,
} from "./config";
import { storeStringAndGetBlobId } from "./utility/walrus";
import { motion } from "framer-motion";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Slider } from "@/components/ui/slider";
import { Ratings } from "@/components/Ratings";
import {PointPopup} from "@/components/PointPopup";
import {getRandomInt} from "@/lib/helpers";

const genAI = new GoogleGenerativeAI(
  process.env.NEXT_PUBLIC_GEMINI_API_KEY || ""
);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro",
  systemInstruction:
    "You are an expert that reviewing public amenities like restrooms and water fountains. Return what type of amenity the picture is, followed by a description of the amenity in the image.\n\nOutput Format:\nLocationType: one of Restroom or Water Fountain or Other\nDescription: [image description]\n\n",
});

export default function HandleSubmit() {
  const { primaryWallet } = useDynamicContext();
  const publicKey = primaryWallet?.address;

  const [step, setStep] = useState(1);
  const [recordType, setRecordType] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<string | null>(null);
  const [recordData, setRecordData] = useState<object | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [latitude, setLatitude] = useState(13.7392299);
  const [longitude, setLongitude] = useState(100.4847994);
  const [rating, setRating] = useState(5);
  const points = getRandomInt(1, 5);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((err) => console.error("Error accessing camera:", err));
    }
  }, []);

  const makeGeminiCalls = async () => {
    setIsLoading(true);
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          setLatitude(position.coords.latitude);
          setLongitude(position.coords.longitude);
        });
      } else {
        console.log("Geolocation is not supported by this browser.");
      }
      const format = image?.split(";")[0].slice(5);
      const base64Image = image?.split(",")[1];
      const result = await model.generateContent([
        "Analyze this picture and return what it is, and a description of the image.",
        {
          inlineData: {
            mimeType: format ?? "image/jpeg",
            data: base64Image ?? "",
          },
        },
      ]);

      const geminiResponse = await result.response;
      const text = geminiResponse.text();
      console.log(text);
      const extractedType = text
        .split("LocationType:")[1]
        .split("Description:")[0]
        .trim();
      const extractedDescription = text.split("Description:")[1].trim();
      if (extractedType.includes("Other")) {
        setError(
          "Image is not a Restroom or Water Fountain. Error Description: " +
            extractedDescription
        );
      } else {
        setDescription(extractedDescription);
        setRecordType(extractedType);
        // setName(extractedType);
        console.log(text);
        setStep(3);
      }
    } catch (error) {
      console.error(error);
      setError("Error. Please try again. " + error);
      setDescription("Sample Description");
      setRecordType("Water Fountain");
      // setName(extractedType);
      setStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMintNFT = async () => {
    setIsLoading(true);
    try {
      const timestamp = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true,
      }).format(new Date());

      const recordData = {
        rating,
        latitude,
        longitude,
        timestamp,
        recordType,
        image,
        description,
      };
      const ipfsCid =
        (await storeStringAndGetBlobId(JSON.stringify(recordData) ?? "")) ?? "";
      console.log(ipfsCid);
      const networkId = await primaryWallet?.getNetwork();
      const { client, walletClient, contractAddress } =
        getClientContractAddress((networkId as number));
      console.log(account, client, walletClient, contractAddress)
      try {
        if (account && walletClient) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { request } = await  (client.simulateContract as any)({
            address: contractAddress as `0x${string}`,
            abi: wagmiAbi,
            functionName: "addRecord",
            args: [
              ipfsCid,
              recordData.latitude.toString(),
              recordData.longitude.toString(),
              recordData.recordType,
              new Uint8Array([recordData.rating])[0],
            ],
            account,
          });

          const writeContractResponse = await walletClient.writeContract(
            request
          );
          console.log("Transaction successful:", writeContractResponse);
        }
      } catch (error) {
        console.error("Error writing record to blockchain:", error);
      }
      setRecordData(recordData);
      setStep(4);
    } catch (error) {
      console.error(error);
      setError("Error. Please try again. " + error);
      setStep(5);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
      const imageDataUrl = canvas.toDataURL("image/jpeg");
      setImage(imageDataUrl);
      setStep(2);
    }
  };

  const resetApp = () => {
    setStep(1);
    setImage(null);
    setRecordData(null);
    setError(null);
  };

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setImage(result);
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (step === 3) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
      if (mapContainerRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          center: [longitude, latitude],
          zoom: 13,
        });

        mapRef?.current?.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true,
            },
            trackUserLocation: true,
            showUserHeading: true,
          })
        );

        new mapboxgl.Marker()
          .setLngLat([longitude, latitude])
          .addTo(mapRef.current);
      }

      return () => {
        mapRef?.current?.remove();
      };
    }
  }, [step, longitude, latitude]);

  return (
    <div className="w-96 h-[700px] rounded-lg shadow-lg overflow-hidden p-4">
      <div className="h-full overflow-y-auto">
        {publicKey && step === 1 && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="bg-white border-8 border-blue-400 rounded-3xl shadow-lg">
              <CardHeader className="text-center text-2xl font-bold text-blue-600">
                Record a Facility
              </CardHeader>
              <CardContent>
                {image && (
                  <motion.div
                    className="mt-4"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={image}
                      alt="Preview"
                      className="max-w-full h-auto max-h-64 rounded-lg"
                    />
                  </motion.div>
                )}
                {!image && (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-64 object-cover rounded-lg mb-4"
                  />
                )}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handleCapture}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                  >
                    <Camera className="mr-2 h-6 w-6" /> Capture
                  </Button>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-4"
                >
                  <Button
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                    onClick={() => fileInputRef?.current?.click()}
                  >
                    <Upload className="mr-2 h-4 w-4" /> Upload
                  </Button>
                </motion.div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </CardContent>
            </Card>
          </motion.div>
        )}
        {step === 2 && (
          <Card className="border-2 border-blue-500 rounded-xl shadow-lg animate-fade-in">
            <CardHeader className="text-center text-xl font-bold text-blue-500">
              Confirm Image
            </CardHeader>
            <CardContent>
              <Image
                src={image ?? ""}
                alt="Captublue"
                width={300}
                height={300}
                className="mb-4 max-w-full h-auto object-cover rounded-lg"
              />

              <div className="flex gap-2 mt-4">
                <Button
                  onClick={() => {
                    makeGeminiCalls();
                  }}
                  className="flex-1 bg-blue-500 hover:bg-blue-600  font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  Next
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {step === 3 && (
          <Card className="border-2 border-blue-500 rounded-xl shadow-lg animate-fade-in">
            <CardHeader className="text-center text-xl font-bold text-blue-500">
              Confirm Details
            </CardHeader>
            <CardContent>
              <div
                style={{ width: "100%", height: "30vh", marginBottom: "2rem" }}
                id="map-container"
                ref={mapContainerRef}
              />
              <div className="flex flex-col gap-2 mt-4">
                <input
                  type="number"
                  placeholder="Enter Latitude"
                  value={latitude}
                  onChange={(e) => setLatitude(parseFloat(e.target.value))}
                  className="border border-gray-300 rounded p-2"
                />
                <input
                  type="number"
                  placeholder="Enter Longitude"
                  value={longitude}
                  onChange={(e) => setLongitude(parseFloat(e.target.value))}
                  className="border border-gray-300 rounded p-2"
                />
                <Select value={recordType} onValueChange={setRecordType}>
                  <SelectTrigger className="border border-gray-300 rounded p-2">
                    {recordType ? recordType : "Select Type"}
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Restroom">🚻 Restroom</SelectItem>
                    <SelectItem value="Water Fountain">
                      🚰 Water Fountain
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Textarea
                  placeholder="Enter Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="border border-gray-300 rounded p-2"
                />
                <div className="w-full space-y-4">
                  <Ratings ratings={rating} />
                  <Slider
                    defaultValue={[5]}
                    max={5}
                    min={1}
                    step={1}
                    value={[rating]}
                    onValueChange={(value) => setRating(value[0])}
                    className="w-full"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  onClick={handleMintNFT}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="flex items-center">
                      <Loader2 className="mr-2 h-6 w-6 animate-spin" />
                      <span>Uploading Record to IPFS...</span>
                    </div>
                  ) : (
                    "Upload Image"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        {recordData && (
          <Card className="border-2 border-blue-500 rounded-xl shadow-lg animate-fade-in">
            <CardHeader className="text-center text-xl font-bold text-blue-500">
              Recorded Uploaded Successfully!
            </CardHeader>
            <CardContent>
              <div className="mb-4 text-center">
                <PointPopup isVisible={true} points={points} />
                <h2 className="text-xl font-bold text-blue-500">Record Data:</h2>
                <div className=" rounded-lg p-4 shadow-md text-left w-full ">
                  {recordData &&
                    Object.entries(recordData).map(([key, value], index) => (
                      <div key={index} className="mb-2">
                        <span className="font-semibold text-blue">{key}:</span>{" "}
                        <span className="break-words">
                          {String(value).slice(0, 200)}
                        </span>
                      </div>
                    ))}
                </div>
                {image && (
                  <Image
                    src={image}
                    alt="Captublue"
                    width={300}
                    height={300}
                    className="mb-4 max-w-full h-auto object-cover rounded-lg"
                  />
                )}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  View on BlockScan
                </a>
              </div>
              <Button
                onClick={resetApp}
                className="w-full bg-blue-500 hover:bg-blue-600  font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
              >
                Upload Another Image
              </Button>
            </CardContent>
          </Card>
        )}
        {error && (
          <Alert
            variant="destructive"
            className="animate-shake bg-blue-900 border-blue-500 "
          >
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
            <Button
              onClick={resetApp}
              className="mt-4 w-full bg-blue-500 hover:bg-blue-600  font-bold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              Try Again
            </Button>
          </Alert>
        )}
      </div>
    </div>
  );
}
