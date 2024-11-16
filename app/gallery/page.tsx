"use client";
import { Record, useAppContext } from "../AppContextProvider";
import { polygonPublicClient } from "../config";
import { wagmiAbi } from "../abi";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button } from "@/components/ui/button";
import HandleSubmit from "../HandleSubmit";
import { motion } from "framer-motion";
import {Card, CardContent, CardHeader} from "@/components/ui/card";

export default function Gallery() {
  const { records, setRecords } = useAppContext();
  const [showSubmit, setShowSubmit] = useState(false);
  const [details, setDetails] = useState(false);

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  useEffect(() => {
    if (records.length > 0) {
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
  }, [records]); // Add `records` to the dependency array

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

  return (
    <>
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ width: "100%", height: "95vh", marginBottom: "2rem" }}
        className="rounded-lg overflow-hidden relative"
      >
        <div className="absolute top-4 left-4 bg-white p-4 rounded shadow-lg z-10">
          <h1 className="text-lg font-bold">Welcome to WaterFinder!</h1>
          <Button onClick={() => setShowSubmit(!showSubmit)}>
            Missing Facility?
          </Button>
          <Button onClick={() => setDetails(!details)}>
            View Records
          </Button>
        </div>

        {showSubmit && (
          <div className="absolute top-32 left-4 z-10">
            <HandleSubmit />
          </div>
        )}
      </div>

      {details && (
        <div className="absolute bottom-4 left-4 z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {records.map((model, index) => (
              <motion.div
                key={index}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className="border-2 border-blue-500 rounded-xl shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105">
                  <CardHeader className="p-4 bg-blue-900">
                    <h2 className="text-2xl font-bold text-white">
                      {model.recordType}
                    </h2>
                  </CardHeader>
                  {/* {model.imageWalrusBlobId in images ? (
                    <GLB modelUrl={images[model.imageWalrusBlobId]} />
                  ) : (
                    <p className="text-center">Loading 3D Model...</p>
                  )} */}
                  <CardContent className="p-4">
                    <p className="text-md  mb-2">
                      {model.ipfsCid}
                    </p>
                    <p className="text-md  mb-2">
                      {model.ratings}
                    </p>
                    <p className="text-sm text-blue-400">
                      Uploaded on {model.timestamp} at Location:{" "}
                      {model.latitude}, {model.longitude}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
