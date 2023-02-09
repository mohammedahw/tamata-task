import { MapContainer, TileLayer, Marker, Polygon } from "react-leaflet";
import Navbar from "../components/Navbar";
import "leaflet/dist/leaflet.css";
import regions from "../data/regions.json";
import customers from "../data/customers.json";
import { useEffect, useState } from "react";
import { Address } from "../types";
import LoadingSpinner from "../components/LoadingSpinner";

const randomRegions = Array.from({ length: 4 }, () => {
  return regions[Math.floor(Math.random() * regions.length)];
});

export default function QuestionOne() {
  const [customer, setCustomer] = useState(
    customers[Math.floor(Math.random() * customers.length)]
  );
  const [warningMessage, setWarningMessage] = useState("");
  const [selectedRegions, setSelectedRegions] = useState(randomRegions);
  const [customerLocation, setCustomerLocation] = useState<Address | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  const handleCustomerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCustomer(customers.filter((c) => c.name === e.target.value)[0]);
    setWarningMessage("");
    setLoading(true);
  };

  const getCustomerAddressDetails = async (
    lat: number,
    lng: number,
    signal: AbortSignal
  ) => {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`,
      { signal }
    );
    const data = await response.json();
    setCustomerLocation(data.address as Address);
    setLoading(false);
  };

  useEffect(() => {
    const isInRegion = selectedRegions.some((region) => {
      const { lat, lng } = customer;
      const { positions } = region;
      const x = lat;
      const y = lng;
      let inside = false;
      for (let i = 0, j = positions.length - 1; i < positions.length; j = i++) {
        // xi and yi are the coordinates of the current point
        let xi = positions[i][0];
        let yi = positions[i][1];
        // xj and yj are the coordinates of the previous point
        let xj = positions[j][0];
        let yj = positions[j][1];

        let intersect =
          yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    });

    if (!isInRegion) {
      setWarningMessage(
        "The customer is not in any of the regions, please change the customer"
      );
    }

    const abortController = new AbortController();
    getCustomerAddressDetails(
      customer.lat,
      customer.lng,
      abortController.signal
    );

    return () => {
      abortController.abort();
    };
  }, [customer]);

  return (
    <>
      <Navbar />
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="flex w-full" style={{ height: "90vh" }}>
          <div className="h-full w-3/4 relative">
            <MapContainer
              className="absolute top-0 bottom-0"
              center={[33.31627654080032, 44.37513107435181]}
              zoom={12}
              scrollWheelZoom={false}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {selectedRegions.map((region, idx) => {
                return (
                  <Polygon
                    key={idx}
                    positions={region.positions as [[number, number]]}
                    color={region.color}
                  />
                );
              })}

              <Marker
                position={[customer.lat, customer.lng]}
                title={customer.name}
              />
            </MapContainer>
          </div>
          <div className="h-full w-1/4 mt-5">
            {warningMessage && (
              <div className="bg-red-500 text-white p-2 rounded-md">
                {warningMessage}
              </div>
            )}
            <div className="flex flex-col">
              <div className="flex justify-around items-center">
                <div>Customer: </div>
                <select
                  name="customer"
                  id="customer"
                  value={customer.name}
                  onChange={handleCustomerChange}
                >
                  {customers.map((customer, idx) => (
                    <option key={idx} value={customer.name}>
                      {customer.name}
                    </option>
                  ))}
                </select>
              </div>
              {customerLocation && (
                <div className="ml-10 mt-5">
                  <div className="text-lg font-bold">
                    Customer Address Details:
                  </div>
                  <div>Country: {customerLocation.country}</div>
                  <div>Country Code: {customerLocation.country_code}</div>
                  <div>City: {customerLocation.city}</div>
                  <div>State: {customerLocation.state}</div>
                  <div>Suburb: {customerLocation.suburb}</div>
                  <div>Road: {customerLocation.road}</div>
                  <div>District: {customerLocation.district}</div>
                  <div>Sub District: {customerLocation.subdistrict}</div>
                  <div>Postcode: {customerLocation.postcode}</div>
                  <div>Municipality: {customerLocation.municipality}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
