import axios from "axios";
import { absoluteServerUrl } from "./utils";
import { IUser } from "@/types";

export const getCurrentUser = async () => {
  const response = await axios.post(
    absoluteServerUrl("/auth/get-user"),
    {},
    { withCredentials: true }
  );

  if (!response.data.success) return null;

  return response.data.user as IUser;
};
