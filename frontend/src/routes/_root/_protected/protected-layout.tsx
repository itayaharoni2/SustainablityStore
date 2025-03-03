import { useUserContext } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const ProtectedLayout = () => {
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

  return <Outlet />;
};

export default ProtectedLayout;
