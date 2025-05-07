"use client";
import React, { useEffect, useState } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";

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

const REMOVED_KEY = "removedNotifications";

const NotificationPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [removed, setRemoved] = useState<string[]>([]);
  // Load removed notifications from localStorage
  useEffect(() => {
    const removedIds = JSON.parse(localStorage.getItem(REMOVED_KEY) || "[]");
    setRemoved(removedIds);
  }, []);

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

  // Filter out removed notifications
  const filteredVehicles = vehicles.filter((v) => !removed.includes(v._id));

  const expiringSoon = filteredVehicles.filter(
    (v) =>
      (getDaysLeft(v.licenseExpirationDate) !== null &&
        getDaysLeft(v.licenseExpirationDate)! <= 30) ||
      (getDaysLeft(v.fitnessExpirationDate) !== null &&
        getDaysLeft(v.fitnessExpirationDate)! <= 30)
  );

  // Remove notification and persist in localStorage
  const handleRemove = (id: string) => {
    const updated = [...removed, id];
    setRemoved(updated);
    localStorage.setItem(REMOVED_KEY, JSON.stringify(updated));
  };

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
            <li
              key={v._id}
              className="p-4 border rounded bg-yellow-50 flex items-center justify-between"
            >
              <div>
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
              </div>
              {/* Remove Button */}
              <button
                className="  text-red-500 hover:text-red-700 font-bold text-lg flex flex-col items-center"
                title="Remove notification"
                onClick={() => handleRemove(v._id)}
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationPage;
