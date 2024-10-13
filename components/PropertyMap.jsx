"use client";
import { useEffect, useState } from "react";
import { setDefaults, fromAddress } from "react-geocode";
const PropertyMap = ({ property }) => {
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [viewport, setViewport] = useState({
    latitude: 0,
    longitude: 0,
    zoom: 12,
    width: "100%",
    height: "500px",
  });

  const [loading, setLoading] = useState(true);

  const [geoCodeError, setGeoCodeError] = useState(false);

  setDefaults({
    key: process.env.NEXT_PUBLIC_GOOGLE_GEOCODING_API_KEY,
    language: "en",
    region: "us",
  });

  useEffect(() => {
    const fetchCoords = async () => {
      try {
        const res = await fromAddress(
          `${property.location.street} ${property.location.city} ${property.location.state} ${property.location.zipcode}`
        );

        //Check Geocode results

        if (res.results.length === 0) {
          setGeoCodeError(true);
          return;
        }

        const { lat, lng } = res.results[0].geometry.location;
        setLat(lat);
        setLng(lng);
        setViewport({
          ...viewport,
          latitude: lat,
          longitude: lng,
        });
      } catch (error) {
        console.log(error);
        setGeoCodeError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchCoords();
  }, []);

  if (loading) {
    return <h3>Loading...</h3>;
  }

  if (geoCodeError) {
    return <div className="text-xl">No location data found</div>;
  }

  return <div>Map</div>;
};

export default PropertyMap;
