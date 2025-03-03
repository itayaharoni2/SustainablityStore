import { useUserContext } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";

const MainLayout = () => {
  const { isAuthenticated, isLoading } = useUserContext();
  const [isMounted, setIsMounted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (!isAuthenticated && !isLoading && isMounted) {
      navigate("/sign-in");
    }
  }, [isAuthenticated, isLoading, navigate, isMounted]);

  if (!isAuthenticated && !isLoading) {
    return null;
  }

  return (
    <div className="p-4 min-h-screen">
      <div className="m-2">
        <Link to="/">
          <img src="/logo.png" alt="logo" width={80} height={80} />
        </Link>
      </div>
      <Outlet />
    </div>
  );
};

export default MainLayout;
