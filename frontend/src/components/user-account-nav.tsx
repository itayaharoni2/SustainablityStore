"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserContext } from "@/context/auth-context";
import SignOutButton from "./sign-out-button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Link } from "react-router-dom";

const UserAccountNav = () => {
  const { user } = useUserContext();

  console.log(user);

  if (!user) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="overflow-visible">
        <Avatar className="cursor-pointer">
          <AvatarImage
            src={`https://avatar.vercel.sh/vercel.svg?text=${user.name[0]?.toUpperCase()}`}
            alt={user.name}
            className="rounded-full"
          />
          <AvatarFallback className="cursor-pointer">
            {user.name[0]?.toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-white w-60" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-0.5 leading-none">
            <p className="font-medium text-sm text-black">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>
        </div>

        <DropdownMenuSeparator />
        {user.isAdmin && (
          <Link to="/admin">
            <DropdownMenuItem className="cursor-pointer">
              Admin
            </DropdownMenuItem>
          </Link>
        )}
        <Link to="/orders">
          <DropdownMenuItem className="cursor-pointer">
            Orders
          </DropdownMenuItem>
        </Link>
        <Link to="/activities">
          <DropdownMenuItem className="cursor-pointer">
            Activities
          </DropdownMenuItem>
        </Link>
        <Link to="/settings">
          <DropdownMenuItem className="cursor-pointer">
            Settings
          </DropdownMenuItem>
        </Link>

        <DropdownMenuSeparator />

        <SignOutButton>
          <DropdownMenuItem className="cursor-pointer">
            Sign Out
          </DropdownMenuItem>
        </SignOutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserAccountNav;
