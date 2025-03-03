import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { MaxWidthWrapper } from "./max-width-wrapper";
import { buttonVariants } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { Cart } from "./cart";
import UserAccountNav from "./user-account-nav";
import { useUserContext } from "@/context/auth-context";

const navLinks = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Your Reviews",
    href: "/testimonials",
  },
  {
    label: "Learn More",
    href: "/learn-more",
  },
  {
    label: "About Us",
    href: "/about",
  },
  {
    label: "Carbon Footprint Calculator",
    href: "/carbon-footprint-calculator",
  },
  {
    label: "Water Usage Calculator",
    href: "/water-usage-calculator",
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUserContext();

  return (
    <div className="bg-gray-50 border border-b">
      <MaxWidthWrapper className="px-8 py-4">
        <nav className="grid grid-cols-3">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger>
              <Menu size={24} />
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col gap-4 pt-12">
              <SheetTitle hidden={true} /> <SheetDescription hidden={true} />
              {/* This is a hidden title & description (required by radix ui)*/}
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  onClick={() => setIsOpen(false)}
                  to={link.href}
                  className={buttonVariants({
                    variant: "ghost",
                    className: "!justify-start",
                  })}
                >
                  {link.label}
                </Link>
              ))}
              {!user ? (
                <div className="lg:hidden flex flex-col gap-4">
                  <Link
                    to="/sign-in"
                    className={buttonVariants({
                      variant: "ghost",
                      className: "!justify-start",
                    })}
                  >
                    Sign in
                  </Link>

                  <Link
                    to="/sign-up"
                    className={buttonVariants({
                      variant: "ghost",
                      className: "!justify-start",
                    })}
                  >
                    Create account
                  </Link>
                </div>
              ) : null}
            </SheetContent>
          </Sheet>

          <Link to="/" className="flex items-center gap-1 mx-auto">
            <img
              src="/logo.png"
              alt="logo"
              className="w-12 sm:w-16 h-12 sm:h-16"
            />
          </Link>

          <div className="flex items-center ml-auto">
            {user ? (
              <>
                <UserAccountNav />
              </>
            ) : (
              <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-end lg:space-x-6">
                <Link
                  to="/sign-in"
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                >
                  Sign in
                </Link>

                <span className="h-6 w-px bg-gray-200" aria-hidden="true" />

                <Link
                  to="/sign-up"
                  className={buttonVariants({
                    variant: "ghost",
                  })}
                >
                  Create account
                </Link>
                <div className="flex lg:ml-6">
                  <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
                </div>
              </div>
            )}

            <div className="ml-4 flow-root lg:ml-6">
              <Link to="/search" className="p-2 -m-2">
                <Search
                  aria-hidden="true"
                  className="h-6 w-6 flex-shrink-0 text-gray-400 hover:text-gray-500"
                />
              </Link>
            </div>
            <div className="flex lg:ml-6">
              <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
            </div>
            <div className="ml-4 flow-root lg:ml-6">
              <Cart />
            </div>
          </div>
        </nav>
      </MaxWidthWrapper>
    </div>
  );
};

export default Navbar;
