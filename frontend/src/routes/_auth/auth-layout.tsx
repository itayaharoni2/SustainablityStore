import { useUserContext } from "@/context/auth-context";
import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext();
  const [isMounted, setIsMounted] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useEffect(() => {
    if (isAuthenticated && isMounted) {
      navigate("/");
    }
  }, [isAuthenticated, navigate, isMounted]);

  if (isAuthenticated) {
    return null;
  }

  return <Outlet />;
};

export default AuthLayout;
