"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { navLinks } from "@/constants";
import { SignedIn, UserButton, SignedOut } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <header className="header">
      <Link href={"/"} className="flex  items-center gap-2 md:py-2">
        <Image
          src={"/assets/images/logo-text.svg"}
          alt="logo"
          height={28}
          width={180}
        />
      </Link>
      <nav className="flex gap-2">
        <SignedIn>
          <UserButton />
          <Sheet>
            <SheetTrigger>
              <Image
                src={"/assets/icons/menu.svg"}
                alt="menu icon"
                width={32}
                height={32}
                className="cursor-pointer"
              />
            </SheetTrigger>
            <SheetContent className="sheet-content sm:w-72">
              <>
                <Image
                  src={"/assets/images/logo-text.svg"}
                  alt="logo"
                  width={152}
                  height={23}
                />
                <ul
                  style={{ gap: "1rem" }}
                  className="header-nav_elements pb-2"
                >
                  {navLinks.map((l) => {
                    const isActuve = l.route === pathname;
                    return (
                      <li
                        key={l.route}
                        className={` ${
                          isActuve && "gradient-text"
                        } p-18 flex whitespace-nowrap text-dark-700`}
                      >
                        <Link
                          className="sidebar-link cursor-pointer"
                          href={l.route}
                        >
                          <Image
                            src={l.icon}
                            width={24}
                            height={24}
                            alt="logo"
                          />
                          {l.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            </SheetContent>
          </Sheet>
        </SignedIn>
        <SignedOut>
          <Button asChild className="button bg-purple-gradient bg-cover">
            <Link href={"/sign-in"}>Login</Link>
          </Button>
        </SignedOut>
      </nav>
    </header>
  );
};

export default MobileNav;
