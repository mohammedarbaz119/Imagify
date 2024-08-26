"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { navLinks } from "@/constants";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
const SideBar = () => {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="flex flex-col size-full gap-3">
        <Link href={"/"} className="sidebar-logo">
          <Image
            src={"/assets/images/logo-text.svg"}
            alt="logo"
            width={180}
            height={26}
          />
        </Link>
        <nav className="sidebar-nav">
          <SignedIn>
            <ul className="sidebar-nav_elements pb-2">
              {navLinks.slice(0, 6).map((l) => {
                const isActuve = l.route === pathname;
                return (
                  <li
                    key={l.route}
                    className={`sidebar-nav_element group ${
                      isActuve
                        ? "bg-purple-gradient text-white"
                        : "text-gray-700"
                    }`}
                  >
                    <Link className="sidebar-link" href={l.route}>
                      <Image
                        src={l.icon}
                        width={20}
                        height={20}
                        alt="logo"
                        className={`${isActuve ?? "brightness-200"}`}
                      />
                      {l.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <ul className="sidebar-nav_elements">
              {navLinks.slice(6).map((l) => {
                const isActuve = l.route === pathname;
                return (
                  <li
                    key={l.route}
                    className={`sidebar-nav_element group ${
                      isActuve
                        ? "bg-purple-gradient text-white"
                        : "text-gray-700"
                    }`}
                  >
                    <Link className="sidebar-link" href={l.route}>
                      <Image
                        src={l.icon}
                        width={20}
                        height={20}
                        alt="logo"
                        className={`${isActuve ?? "brightness-200"}`}
                      />
                      {l.label}
                    </Link>
                  </li>
                );
              })}
              <li className="flex-center cursor-pointer gap-2 p-3">
                <UserButton showName />
              </li>
            </ul>
          </SignedIn>
          <SignedOut>
            <Button asChild className="button bg-purple-gradient bg-cover">
              <Link href={"/sign-in"}>Login</Link>
            </Button>
          </SignedOut>
        </nav>
      </div>
    </aside>
  );
};

export default SideBar;
