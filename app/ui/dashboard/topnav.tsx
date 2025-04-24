"use client";
import Image from "next/image";
import { useState } from "react";

type UserInfo = {
  name: string;
  user_role: string;
  email: string;
  image_url?: string;
};

export default function TopNav({ userInfo }: { userInfo: UserInfo }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  return (
    <div className="relative flex items-center justify-between p-4 bg-gray-50 mb-2 rounded-lg shadow-sm">
      <div className="flex items-center gap-4 justify-end w-full">
        <div
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer "
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <Image
            src={"/user-avatar.png"}
            alt={`${userInfo?.name}'s profile`}
            width={30}
            height={30}
            className="rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{userInfo?.name}</span>
          <span className="text-xs text-gray-500">{userInfo?.email}</span>
        </div>
      </div>
      {isDropdownOpen && (
        <div className="absolute right-0 top-16 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1 px-1">
            <div className="flex flex-col text-gray-700 group rounded-md w-full px-2 py-2 text-sm hover:bg-teal-100 hover:text-teal-900">
              <span className="text-sm font-medium">{userInfo?.name}</span>
              <span className="text-xs font-medium text-teal-400">
                {userInfo?.user_role}
              </span>
              <span className="text-xs text-gray-500">{userInfo?.email}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
