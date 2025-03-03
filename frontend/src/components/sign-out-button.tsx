import { useUserContext } from "@/context/auth-context";
import { useSignOutAccount } from "@/lib/react-query/mutations";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignOutButton = ({ children }: { children: React.ReactNode }) => {
  const { mutateAsync } = useSignOutAccount();

  const navigate = useNavigate();
  const { checkAuthUser } = useUserContext();

  const onClick = async () => {
    const data = await mutateAsync();

    if (data?.success) {
      toast.success("Signed Out successfully");
      checkAuthUser();
      return navigate("/");
    }

    toast.error("Sign Out failed");
  };

  return <span onClick={onClick}>{children}</span>;
};

export default SignOutButton;
