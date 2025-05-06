"use client";
import React, { useEffect, useState } from "react";

interface Vehicle {
  _id: string;
  model: string;
  registrationNumber: string;
  licenseExpirationDate: string;
  fitnessExpirationDate: string;
}

const getDaysLeft = (dateStr: string): number => {
  if (!dateStr) return 0; // Default to 0 if dateStr is invalid
  const today = new Date();
  const exp = new Date(dateStr);
  const diff = Math.ceil(
    (exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diff;
};

const NotificationPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch("/api/vehicles/get-all");
        const data = await res.json();
        setVehicles(data);
      } catch (error) {
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const expiringSoon = vehicles.filter(
    (v) =>
      (getDaysLeft(v.licenseExpirationDate) !== null &&
        getDaysLeft(v.licenseExpirationDate)! <= 30) ||
      (getDaysLeft(v.fitnessExpirationDate) !== null &&
        getDaysLeft(v.fitnessExpirationDate)! <= 30)
  );

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>
      {loading ? (
        <div>Loading...</div>
      ) : expiringSoon.length === 0 ? (
        <div>No upcoming expirations.</div>
      ) : (
        <ul className="space-y-4">
          {expiringSoon.map((v) => (
            <li key={v._id} className="p-4 border rounded bg-yellow-50">
              <div className="font-semibold">
                {v.model} ({v.registrationNumber})
              </div>
              {getDaysLeft(v.licenseExpirationDate)! <= 0 ? (
                <div className="text-red-600">
                  License expired before{" "}
                  {Math.abs(getDaysLeft(v.licenseExpirationDate))} day(s) (
                  {v.licenseExpirationDate})
                </div>
              ) : (
                getDaysLeft(v.licenseExpirationDate) !== null &&
                getDaysLeft(v.licenseExpirationDate)! <= 30 && (
                  <div className="text-red-600">
                    License will expire within{" "}
                    {getDaysLeft(v.licenseExpirationDate)} day(s) (
                    {v.licenseExpirationDate})
                  </div>
                )
              )}
              {getDaysLeft(v.fitnessExpirationDate)! <= 0 ? (
                <div className="text-red-600">
                  Fitness expired before{" "}
                  {Math.abs(getDaysLeft(v.fitnessExpirationDate))} day(s) (
                  {v.fitnessExpirationDate})
                </div>
              ) : (
                getDaysLeft(v.fitnessExpirationDate) !== null &&
                getDaysLeft(v.fitnessExpirationDate)! <= 30 && (
                  <div className="text-red-600">
                    Fitness will expire within{" "}
                    {getDaysLeft(v.fitnessExpirationDate)} day(s) (
                    {v.fitnessExpirationDate})
                  </div>
                )
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
