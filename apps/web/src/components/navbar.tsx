import Link from "next/link";

import { sanityFetch } from "@/lib/sanity/live";
import { queryNavbarData } from "@/lib/sanity/query";
import type { QueryNavbarDataResult } from "@/lib/sanity/sanity.types";
import { capitalizeAllLetters } from "@/utils";

import { Logo } from "./logo";
import { NavbarClient, NavbarSkeletonResponsive } from "./navbar-client";

export async function NavbarServer() {
  const navbarData = await sanityFetch({ query: queryNavbarData });
  return <Navbar navbarData={navbarData.data} />;
}

export function Navbar({ navbarData }: { navbarData: QueryNavbarDataResult }) {
  const { logo, siteTitle } = navbarData ?? {};

  return (
    <section className="py-3 md:border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="grid grid-cols-[auto_1fr] items-center gap-4">
          {logo ? (
            <Logo src={logo} alt={siteTitle} priority />
          ) : (
            <Link
              href="/"
              className="text-md lg:text-lg font-semibold tracking-widest"
            >
              {capitalizeAllLetters(siteTitle)}
            </Link>
          )}
          <NavbarClient navbarData={navbarData} />
        </nav>
      </div>
    </section>
  );
}

export function NavbarSkeleton() {
  return (
    <header className="h-[75px] py-4 md:border-b">
      <div className="container mx-auto px-4 md:px-6">
        <nav className="grid grid-cols-[auto_1fr] items-center gap-4">
          <div className="h-[40px] w-[170px] rounded animate-pulse bg-muted" />
          <NavbarSkeletonResponsive />
        </nav>
      </div>
    </header>
  );
}
