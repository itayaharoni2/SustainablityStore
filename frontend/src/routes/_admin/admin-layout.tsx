import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useUserContext } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";

const sidebarNavItems = [
  {
    title: "Products",
    href: "/admin",
  },
  {
    title: "User Activities",
    href: "/admin/user/activities",
  },
];

const AdminLayout = () => {
  const { user, isAuthenticated, isLoading } = useUserContext();

  const [isMounted, setIsMounted] = useState(false);

  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isLoading && isMounted) {
      navigate("/sign-in");
    }
  }, [isAuthenticated, isLoading, navigate, isMounted]);

  useEffect(() => {
    if (isAuthenticated && !user?.isAdmin && isMounted) {
      navigate("/");
    }
  }, [isAuthenticated, navigate, user, isMounted]);

  if (isLoading) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isAuthenticated && !user?.isAdmin) {
    return null;
  }

  return (
    <div className="space-y-6 p-10 pb-16">
      <Link to="/" className="flex items-center gap-1 mx-auto">
        <img src="/logo.png" alt="logo" className="w-12 sm:w-16 h-12 sm:h-16" />
      </Link>
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Admin Dashboard</h2>
        <p className="text-muted-foreground">Manage your website from here.</p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {sidebarNavItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  buttonVariants({ variant: "ghost" }),
                  pathname === item.href
                    ? "bg-muted hover:bg-muted"
                    : "hover:bg-transparent hover:underline",
                  "justify-start"
                )}
              >
                {item.title}
              </Link>
            ))}
          </nav>{" "}
        </aside>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
