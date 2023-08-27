"use client";

import { AuthUser } from "@/app/api/auth/[...nextauth]/authOptions";
import Image from "@/components/Image";
import Button from "@/components/atomic/Button";
import { useSession, signOut, signIn } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

export default function AccountButton() {
  const session: any = useSession();
  const [showDropdown, setShowDropdown] = useState(false);

  const toggleDropdown = () => {
    setShowDropdown((prev) => !prev);
  };

  const dropdownRef: React.RefObject<HTMLDivElement> = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownRef]);

  const signedIn = session && session.status === "authenticated";

  if (!signedIn) {
    return <Button onClick={() => signIn("spotify")}>sign in</Button>;
  }

  const { user }: { user: AuthUser } = session.data;

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="m-2 h-8 w-8 overflow-hidden rounded-full"
        onClick={toggleDropdown}
      >
        <Image
          src={user?.image ?? `https://via.placeholder.com/40`}
          width={40}
          height={40}
          alt={`${user?.name} pfp`}
          className="object-cover h-full w-full"
          priority
          quality={100}
        />
      </div>
      <div
        className={`absolute flex flex-col right-0 border rounded-md border-theme-100 divide-y divide-theme-100 bg-theme-700 transition-opacity duration-75 overflow-hidden ${
          showDropdown ? "opacity-100" : "opacity-0"
        }`}
      >
        <button
          className="hover:bg-theme-600 whitespace-nowrap py-2 px-3"
          onClick={() => signOut()}
        >
          sign out
        </button>
      </div>
    </div>
  );
}
