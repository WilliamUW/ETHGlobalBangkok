"use client";
import { IPFSRecord, Record, useAppContext } from "../AppContextProvider";
import {
  getClientContractAddress,
} from "../config";
import { wagmiAbi } from "../abi";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import HandleSubmit from "../HandleSubmit";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { readFromBlobId } from "../utility/walrus";
import Image from "next/image";
import { X } from "lucide-react";
import { SplashPage } from "@/components/SplashPage";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Ratings } from "@/components/Ratings";

declare global {
  interface Window {
    viewDetails: (ipfsCid: string) => Promise<void>;
  }
}
export default function Gallery() {
  const { records, setRecords } = useAppContext();
  const { primaryWallet } = useDynamicContext();
  const publicKey = primaryWallet?.address;
  const [showSubmit, setShowSubmit] = useState(false);
  const [details, setDetails] = useState<IPFSRecord | null>(null);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  useEffect(() => {
    // Expose viewDetails globally for the button
    window.viewDetails = async (ipfsCid: string): Promise<void> => {
      try {
        console.log("Fetching details for CID:", ipfsCid);

        // Simulated readFromBlobId function
        const response: string | null = await readFromBlobId(ipfsCid);
        if (!response)
          throw new Error("Failed to fetch IPFS data or response is empty");

        const data = JSON.parse(response);
        console.log("Fetched data:", data);
        setDetails(data); // Save the data in state to display it
      } catch (error: unknown) {
        console.error("Error fetching IPFS data:", error);
      }
    };
  }, []);
  useEffect(() => {
    if (publicKey && records.length > 0) {
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN ?? "";
      if (!mapRef.current && mapContainerRef.current) {
        mapRef.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: "mapbox://styles/mapbox/streets-v12",
          center: [100.4849994, 13.7392299],
          zoom: 13,
        });
      }

      // Add geolocate control to the map.
      mapRef?.current?.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        })
      );

      // Add markers for all records
      mapRef?.current?.on("load", () => {
        // Prepare GeoJSON data from records
        const geojsonData = {
          type: "FeatureCollection",
          features: records.map((record) => ({
            type: "Feature",
            properties: {
              description: `
                <div style="
                  font-family: Arial, sans-serif; 
                  padding: 10px; 
                  border: 1px solid #ddd; 
                  border-radius: 8px; 
                  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
                  background-color: #ffffff;
                  text-align: center;
                  max-width: 250px;
                ">
                  <h3 style="
                    font-size: 18px; 
                    margin-bottom: 10px; 
                    color: #333;
                  ">
                    ${record.recordType == "Restroom" ? "🚻" : "🚰"} 
                    ${record.recordType} 
                    <span style="font-size: 16px; color: #777;">(${
                      record.rating
                    }/5⭐️)</span>
                  </h3>
      
                  <button onclick="viewDetails('${record.ipfsCid}')" style="
                    background-color: #007bff; 
                    color: white; 
                    border: none; 
                    border-radius: 6px; 
                    padding: 8px 12px; 
                    font-size: 14px; 
                    cursor: pointer;
                    text-align: center;
                    width: 100%;
                    transition: background-color 0.3s ease, transform 0.2s ease;
                  " 
                  onmouseover="this.style.backgroundColor='#0056b3'; this.style.transform='scale(1.05)';" 
                  onmouseout="this.style.backgroundColor='#007bff'; this.style.transform='scale(1.0)';"
                  >
                    ℹ️ View More Details ℹ️
                  </button>
                </div>
              `,
              type: record.recordType, // Store the record type for color coding
            },
            geometry: {
              type: "Point",
              coordinates: [record.longitude, record.latitude],
            },
          })),
        };

        // Add the source to the map
        mapRef?.current?.addSource("places", {
          type: "geojson",
          // @ts-expect-error error
          data: geojsonData,
        });

        // Add a layer for the colored markers
        mapRef?.current?.addLayer({
          id: "places",
          type: "circle",
          source: "places",
          paint: {
            // Circle radius
            "circle-radius": 6,
            // Circle color based on the record type
            "circle-color": [
              "match",
              ["get", "type"],
              "Restroom",
              "#808080", // Grey for restrooms
              "Water Fountain",
              "#007bff", // Blue for water fountains
              "#000000", // Default to black for unknown types
            ],
            "circle-stroke-width": 2,
            "circle-stroke-color": "#ffffff", // White border
          },
        });
      });

      // Add a click event for popups
      mapRef?.current?.on("click", "places", (e) => {
        if (e.features && mapRef.current) {
          // @ts-expect-error error
          const coordinates = e.features[0].geometry.coordinates.slice();
          const description = e.features[0].properties?.description;

          // Ensure the popup stays at the same point
          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
            coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
            .setLngLat(coordinates)
            .setHTML(description)
            .addTo(mapRef.current);
        }
      });

      return () => {
        if (mapRef.current) {
          // Ensure the event listeners are removed properly
          // @ts-expect-error error
          mapRef.current.off("load");
          // @ts-expect-error error
          mapRef.current.off("click", "places");

          // Finally, remove the map instance
          mapRef.current.remove();
          mapRef.current = null; // Optional cleanup step
        }
      };
    }
  }, [records, publicKey]); // Add `records` to the dependency array

  useEffect(() => {
    if (publicKey) {
      fetchRecords();
    }
  }, [publicKey]);

  const fetchRecords = async () => {
    const networkId = await primaryWallet?.getNetwork();

    const clientAndAddress = getClientContractAddress(networkId as number);
    const { client, contractAddress } = clientAndAddress;

    // Fetch records from the correct chain
    if (client) {
      try {
        const response = await client.readContract({
          address: contractAddress as `0x${string}`,
          abi: wagmiAbi,
          functionName: "getAllRecords",
        });
        console.log(response);
        setRecords(response as Record[]);
      } catch (error) {
        console.error(
          `Error fetching records from network ${networkId}:`,
          error
        );
      }
    } else {
      console.error("Public client not initialized for the selected network.");
    }
  };

  // const [images, setImages] = useState<Record<string, string>>({});
  if (!publicKey) {
    return <SplashPage />;
  }
  return (
    <>
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ width: "100%", height: "92.5vh" }}
        className="rounded-lg overflow-hidden relative"
      >
        <div className="absolute top-4 left-4 bg-white p-4 rounded-lg shadow-lg z-10">
          <h1 className="text-lg font-bold">Welcome to Hydrofy!</h1>
          <Button onClick={() => setShowSubmit(!showSubmit)}>
            {!showSubmit ? "➕ Add a Facility" : "❌ Close Panel"}
          </Button>
        </div>

        {showSubmit && (
          <div className="absolute top-32 left-0 z-10">
            <HandleSubmit />
          </div>
        )}
      </div>

      {details && (
        <div className="absolute bottom-0 w-full z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <Card
              className="h-[50vh] md:w-[50%] overflow-y-auto border-2 border-blue-500 rounded-xl shadow-lg"
              style={{ maxHeight: "50vh" }}
            >
              <CardHeader className="flex justify-between items-center p-4 bg-blue-900">
                <h2 className="text-2xl font-bold text-white">
                  {details.recordType == "Restroom" ? "🚻" : "🚰"}{" "}
                  {details.recordType}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setDetails(null)}
                  aria-label="Close"
                  className="absolute top-2 right-2 p-2"
                >
                  <X className="h-5 w-5 text-white" />
                </Button>
              </CardHeader>

              <CardContent className="p-4 flex flex-col">
                <Ratings ratings={details.rating} />
                <div className="flex justify-center mt-2 mb-2">
                  <Image
                    src={details.image}
                    alt="Hydrofy Logo"
                    width={256}
                    height={256}
                    className="rounded-md"
                  />
                </div>
                <p className="text-md  mb-2">{details.description}</p>
                <p className="text-sm text-blue-400">
                  Uploaded on {details.timestamp}
                </p>
                <p className="text-sm text-green-400">
                  Location: {details.latitude}, {details.longitude}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </>
  );
}
