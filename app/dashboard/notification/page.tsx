"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { TrashIcon } from "@heroicons/react/24/outline";
import { get } from "http";

// import { sendSmsNotification } from "../../lib/twilio/twilioServer";
interface Vehicle {
  _id: string;
  model: string;
  registrationNumber: string;
  licenseExpirationDate: string;
  fitnessExpirationDate: string;
  taxTokenExpirationDate?: string;
  routePermitExpirationDate?: string;
  mobileNumber?: string; // Add this field
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
const POLL_INTERVAL = 10 * 60 * 1000; // 10 minutes

const NotificationPage = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [removed, setRemoved] = useState<string[]>([]);
  const notifiedRef = useRef<Set<string>>(new Set()); // To avoid duplicate SMS

  // Load removed notifications from localStorage
  useEffect(() => {
    const removedIds = JSON.parse(localStorage.getItem(REMOVED_KEY) || "[]");
    setRemoved(removedIds);
  }, []);

  // Fetch vehicles on mount and at intervals
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
    const interval = setInterval(fetchVehicles, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // Filter out removed notifications
  const filteredVehicles = vehicles.filter((v) => !removed.includes(v._id));

  const expiringSoon = filteredVehicles.filter(
    (v) =>
      (getDaysLeft(v.licenseExpirationDate) !== null &&
        getDaysLeft(v.licenseExpirationDate)! <= 30) ||
      (getDaysLeft(v.fitnessExpirationDate) !== null &&
        getDaysLeft(v.fitnessExpirationDate)! <= 30) ||
      (v.taxTokenExpirationDate !== undefined &&
        getDaysLeft(v.taxTokenExpirationDate) !== null &&
        getDaysLeft(v.taxTokenExpirationDate)! <= 30) ||
      (v.routePermitExpirationDate !== undefined &&
        getDaysLeft(v.routePermitExpirationDate) !== null &&
        getDaysLeft(v.routePermitExpirationDate)! <= 30)
  );

  // Remove notification and persist in localStorage
  const handleRemove = (id: string) => {
    const updated = [...removed, id];
    setRemoved(updated);
    localStorage.setItem(REMOVED_KEY, JSON.stringify(updated));
  };

  // Helper to check if expired
  const isExpired = (dateStr?: string) =>
    dateStr ? getDaysLeft(dateStr) <= 0 : false;

  // Auto notification effect (runs on vehicles update)
  useEffect(() => {
    expiringSoon.forEach((v) => {
      if (!v.mobileNumber) return;

      let expiredFields: string[] = [];
      if (isExpired(v.licenseExpirationDate)) expiredFields.push("লাইসেন্স");
      if (isExpired(v.fitnessExpirationDate)) expiredFields.push("ফিটনেস");
      if (isExpired(v.taxTokenExpirationDate))
        expiredFields.push("ট্যাক্স টোকেন");
      if (isExpired(v.routePermitExpirationDate))
        expiredFields.push("রুট পারমিট");

      // Only notify if not already notified in this session
      if (expiredFields.length > 0 && !notifiedRef.current.has(v._id)) {
        const msg = `গাড়ি ${v.registrationNumber} এর ${expiredFields.join(
          ", "
        )} মেয়াদ শেষ হয়েছে। দয়া করে দ্রুত নবায়ন করুন।`;

        (async () => {
          await fetch("/api/send-sms", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: v.mobileNumber, message: msg }),
          });
          notifiedRef.current.add(v._id);
        })();
      }
    });
  }, [expiringSoon]);

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
                {v.taxTokenExpirationDate &&
                  (getDaysLeft(v.taxTokenExpirationDate)! <= 0 ? (
                    <div className="text-red-600">
                      Tax Token expired before{" "}
                      {Math.abs(getDaysLeft(v.taxTokenExpirationDate))} day(s) (
                      {v.taxTokenExpirationDate})
                    </div>
                  ) : (
                    getDaysLeft(v.taxTokenExpirationDate)! <= 30 && (
                      <div className="text-red-600">
                        Tax Token will expire within{" "}
                        {getDaysLeft(v.taxTokenExpirationDate)} day(s) (
                        {v.taxTokenExpirationDate})
                      </div>
                    )
                  ))}
                {v.routePermitExpirationDate &&
                  (getDaysLeft(v.routePermitExpirationDate)! <= 0 ? (
                    <div className="text-red-600">
                      Route Permit expired before{" "}
                      {Math.abs(getDaysLeft(v.routePermitExpirationDate))}{" "}
                      day(s) ({v.routePermitExpirationDate})
                    </div>
                  ) : (
                    getDaysLeft(v.routePermitExpirationDate)! <= 30 && (
                      <div className="text-red-600">
                        Route Permit will expire within{" "}
                        {getDaysLeft(v.routePermitExpirationDate)} day(s) (
                        {v.routePermitExpirationDate})
                      </div>
                    )
                  ))}
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
