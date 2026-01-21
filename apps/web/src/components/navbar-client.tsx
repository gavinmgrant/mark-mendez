"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@workspace/ui/components/accordion";
import { Button, buttonVariants } from "@workspace/ui/components/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@workspace/ui/components/navigation-menu";
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Sheet, SheetTrigger } from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { Menu } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { useIsMobile } from "@/hooks/use-is-mobile";
import type { QueryNavbarDataResult } from "@/lib/sanity/sanity.types";
import { capitalizeAllLetters } from "@/utils";

import { Logo } from "./logo";
import { SanityButtons } from "./sanity-buttons";
import { SanityIcon } from "./sanity-icon";
interface MenuItem {
  title: string;
  description: string;
  icon: JSX.Element;
  href?: string;
}

function MenuItemLink({
  item,
  setIsOpen,
}: {
  item: MenuItem;
  setIsOpen?: (isOpen: boolean) => void;
}) {
  return (
    <Link
      className={cn(
        "flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-accent hover:text-accent-foreground items-center focus:bg-accent focus:text-accent-foreground",
      )}
      aria-label={`Link to ${item.title ?? item.href}`}
      onClick={() => setIsOpen?.(false)}
      href={item.href ?? "/"}
    >
      {item.icon}
      <div className="">
        <div className="text-sm font-semibold">{item.title}</div>
        <p className="text-sm leading-snug text-muted-foreground line-clamp-2">
          {item.description}
        </p>
      </div>
    </Link>
  );
}

function MobileNavbarAccordionColumn({
  column,
  setIsOpen,
}: {
  column: NonNullable<NonNullable<QueryNavbarDataResult>["columns"]>[number];
  setIsOpen: (isOpen: boolean) => void;
}) {
  if (column.type !== "column") return null;
  return (
    <AccordionItem value={column.title ?? column._key} className="border-b-0">
      <AccordionTrigger className="mb-4 py-0 font-semibold hover:no-underline hover:bg-accent hover:text-accent-foreground pr-2 rounded-md">
        <div
          className={cn(buttonVariants({ variant: "ghost" }), "justify-start")}
        >
          {column.title}
        </div>
      </AccordionTrigger>
      <AccordionContent className="mt-2">
        {column.links?.map((item) => (
          <MenuItemLink
            key={item._key}
            setIsOpen={setIsOpen}
            item={{
              description: item.description ?? "",
              href: item.href ?? "",
              icon: <SanityIcon icon={item.icon} className="size-5 shrink-0" />,
              title: item.name ?? "",
            }}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  );
}

function MobileNavbar({ navbarData }: { navbarData: QueryNavbarDataResult }) {
  const { logo, siteTitle, columns, buttons } = navbarData ?? {};
  const [isOpen, setIsOpen] = useState(false);

  const path = usePathname();

  // biome-ignore lint/correctness/useExhaustiveDependencies: This is intentional
  useEffect(() => {
    setIsOpen(false);
  }, [path]);
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <div className="flex justify-end">
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <Menu className="size-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
      </div>
      <SheetContent className="overflow-y-auto z-[9999]">
        <SheetHeader>
          <SheetTitle>
            {logo ? (
              <Logo src={logo} alt={siteTitle} priority />
            ) : (
              <Link href="/" className="text-sm font-semibold tracking-widest">
                {capitalizeAllLetters(siteTitle)}
              </Link>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mb-8 mt-8 flex flex-col gap-4">
          {columns?.map((column) => {
            if (column.type === "link") {
              return (
                <Link
                  key={`column-link-${column.name}-${column._key}`}
                  href={column.href ?? ""}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "justify-start",
                  )}
                >
                  {column.name}
                </Link>
              );
            }
            return (
              <Accordion
                type="single"
                collapsible
                className="w-full"
                key={column._key}
              >
                <MobileNavbarAccordionColumn
                  column={column}
                  setIsOpen={setIsOpen}
                />
              </Accordion>
            );
          })}
        </div>

        <div className="border-t pt-4">
          <SanityButtons
            buttons={buttons ?? []}
            buttonClassName="w-full"
            className="flex mt-2 flex-col gap-3"
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

function NavbarColumnLink({
  column,
}: {
  column: NonNullable<NonNullable<QueryNavbarDataResult>["columns"]>[number];
}) {
  if (column.type !== "link") return null;
  return (
    <NavigationMenuLink
      asChild
      className={cn(
        navigationMenuTriggerStyle(),
        "text-muted-foreground dark:text-neutral-300",
      )}
    >
      <Link
        aria-label={`Link to ${column.name ?? column.href}`}
        href={column.href ?? ""}
      >
        {column.name}
      </Link>
    </NavigationMenuLink>
  );
}

function NavbarColumn({
  column,
}: {
  column: NonNullable<NonNullable<QueryNavbarDataResult>["columns"]>[number];
}) {
  if (column.type !== "column") return null;
  return (
    <NavigationMenuList>
      <NavigationMenuItem className="text-muted-foreground dark:text-neutral-300">
        <NavigationMenuTrigger>{column.title}</NavigationMenuTrigger>
        <NavigationMenuContent>
          <ul className="w-80 p-3">
            {column.links?.map((item) => (
              <li key={item._key}>
                <MenuItemLink
                  item={{
                    description: item.description ?? "",
                    href: item.href ?? "",
                    icon: (
                      <SanityIcon
                        icon={item.icon}
                        className="size-5 shrink-0"
                      />
                    ),
                    title: item.name ?? "",
                  }}
                />
              </li>
            ))}
          </ul>
        </NavigationMenuContent>
      </NavigationMenuItem>
    </NavigationMenuList>
  );
}

export function DesktopNavbar({
  navbarData,
}: {
  navbarData: QueryNavbarDataResult;
}) {
  const { columns, buttons } = navbarData ?? {};

  return (
    <div>
      <div className="justify-self-end flex items-center gap-4">
        <NavigationMenu className="flex items-center gap-0">
          {columns?.map((column) =>
            column.type === "column" ? (
              <NavbarColumn key={`nav-${column._key}`} column={column} />
            ) : (
              <NavbarColumnLink key={`nav-${column._key}`} column={column} />
            ),
          )}
        </NavigationMenu>

        <SanityButtons
          buttons={buttons ?? []}
          className="flex items-center gap-4"
          buttonClassName="rounded-md"
        />
      </div>
    </div>
  );
}

const ClientSideNavbar = ({
  navbarData,
}: {
  navbarData: QueryNavbarDataResult;
}) => {
  const isMobile = useIsMobile(1024);

  if (isMobile === undefined) {
    return null; // Return null on initial render to avoid hydration mismatch
  }

  return isMobile ? (
    <MobileNavbar navbarData={navbarData} />
  ) : (
    <DesktopNavbar navbarData={navbarData} />
  );
};

function SkeletonMobileNavbar() {
  return (
    <div className="lg:hidden">
      <div className="flex justify-end">
        <div className="h-12 w-12 rounded-md bg-muted animate-pulse" />
      </div>
    </div>
  );
}

function SkeletonDesktopNavbar() {
  return (
    <div className="hidden lg:grid w-full">
      <div className="justify-self-end">
        <div className="flex items-center gap-4">
          <div className="h-12 w-[100px] rounded-md bg-muted animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function NavbarSkeletonResponsive() {
  return (
    <>
      <SkeletonMobileNavbar />
      <SkeletonDesktopNavbar />
    </>
  );
}

// Dynamically import the navbar with no SSR to avoid hydration issues
export const NavbarClient = dynamic(() => Promise.resolve(ClientSideNavbar), {
  ssr: false,
  loading: () => <NavbarSkeletonResponsive />,
});
