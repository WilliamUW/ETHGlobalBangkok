"use client";
import { IPFSRecord, Record, useAppContext } from "../AppContextProvider";
import { polygonPublicClient } from "../config";
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
import {useDynamicContext} from "@dynamic-labs/sdk-react-core";

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
          center: [-24, 42],
          zoom: 1,
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
                <div>
                  <h3>${record.recordType}</h3>
                  
                  <p><strong>Latitude:</strong> ${record.latitude}</p>
                  <p><strong>Longitude:</strong> ${record.longitude}</p>
                  <p><strong>Time Captured:</strong> ${record.timestamp}</p>
                  <button onclick="viewDetails('${record.ipfsCid}')">View More Details</button>
                </div>
              `,
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

        // Add a layer for the markers
        mapRef?.current?.addLayer({
          id: "places",
          type: "circle",
          source: "places",
          paint: {
            "circle-radius": 6,
            "circle-color": "#B42222",
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
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    if (polygonPublicClient) {
      try {
        const response = await polygonPublicClient.readContract({
          address: "0xe82f3275779792da70477c359b7aa27d1b66524b",
          abi: wagmiAbi,
          functionName: "getAllRecords",
        });
        console.log(response);
        setRecords(response as Record[]);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
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
        <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-lg z-10">
          <h1 className="text-lg font-bold">Welcome to WaterFinder!</h1>
          <Button onClick={() => setShowSubmit(!showSubmit)}>
            Missing Facility?
          </Button>
        </div>

        {showSubmit && (
          <div className="absolute top-32 left-4 z-10">
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
                  {details.recordType ?? details.locationType}
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
              <Image
                src={details.image}
                alt="WaterFinder Logo"
                width={256}
                height={256}
                className="rounded-md"
              />
              <CardContent className="p-4">
                <p className="text-md  mb-2">{details.description}</p>
                <p className="text-md  mb-2">
                  {details.ratings ?? details.rating}
                </p>
                <p className="text-sm text-blue-400">
                  Uploaded on {details.timestamp} at Location:{" "}
                  {details.latitude}, {details.longitude}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      )}
    </>
  );
}
