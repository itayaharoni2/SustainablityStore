import { SignInSchema, SignUpSchema } from "@/schemas/auth";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import axios from "axios";
import { absoluteServerUrl } from "../utils";
import { ContactSchema, reviewSchema, SettingsSchema } from "@/schemas";
import { addOrEditProduct } from "@/schemas/products";
import { toast } from "sonner";

export const useCreateUserAccount = () => {
  return useMutation({
    mutationFn: async (user: z.infer<typeof SignUpSchema>) => {
      const response = await axios.post(
        absoluteServerUrl("/auth/sign-up"),
        user,
        { withCredentials: true }
      );

      return response.data as {
        success: boolean;
        error?: string;
      };
    },
  });
};

export const useSignInAccount = () => {
  return useMutation({
    mutationFn: async (user: z.infer<typeof SignInSchema>) => {
      const response = await axios.post(
        absoluteServerUrl("/auth/sign-in"),
        user,
        { withCredentials: true }
      );

      return response.data as {
        success: boolean;
        error?: string;
      };
    },
  });
};

export const useSignOutAccount = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        absoluteServerUrl("/auth/sign-out"),
        {},
        { withCredentials: true }
      );

      return response.data as {
        success: boolean;
        error?: string;
      };
    },
  });
};

export const useUpdateUserAccount = () => {
  return useMutation({
    mutationFn: async (information: z.infer<typeof SettingsSchema>) => {
      const response = await axios.post(
        absoluteServerUrl("/auth/update-user"),
        information,
        { withCredentials: true }
      );

      return response.data as {
        success: boolean;
        error?: string;
      };
    },
  });
};

export const useContact = () => {
  return useMutation({
    mutationFn: async (contact: z.infer<typeof ContactSchema>) => {
      const response = await axios.post(
        absoluteServerUrl("/contact"),
        contact,
        { withCredentials: true }
      );

      return response.data as {
        success: boolean;
        error?: string;
      };
    },
  });
};

export const useAddProduct = () => {
  return useMutation({
    mutationFn: async (product: z.infer<typeof addOrEditProduct>) => {
      if (!product.image) {
        return { success: false, error: "Please upload an image" };
      }

      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price.toString());
      formData.append("category", product.category);
      formData.append("image", product.image[0]);

      const response = await axios.post(
        absoluteServerUrl("/admin/product/add"),
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data as {
        success: boolean;
        error?: string;
      };
    },
  });
};

export const useEditProduct = () => {
  return useMutation({
    mutationFn: async (
      product: z.infer<typeof addOrEditProduct> & { id: string }
    ) => {
      const formData = new FormData();

      formData.append("id", product.id);
      formData.append("name", product.name);
      formData.append("description", product.description);
      formData.append("price", product.price.toString());
      formData.append("category", product.category);
      formData.append("image", product.image?.[0] ?? "");

      const response = await axios.post(
        absoluteServerUrl("/admin/product/edit"),
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data as {
        success: boolean;
        error?: string;
      };
    },
  });
};

export const useDeleteProduct = () => {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await axios.delete(
        absoluteServerUrl("/admin/product/delete"),
        {
          data: { id },
          withCredentials: true,
        }
      );

      return response.data as {
        success: boolean;
        error?: string;
      };
    },
  });
};

export const usePlaceOrder = () => {
  return useMutation({
    mutationFn: async () => {
      const response = await axios.post(
        absoluteServerUrl("/order"),
        {},
        { withCredentials: true } // Include credentials if your backend requires authentication
      );

      if (response.status !== 201) {
        throw new Error("Failed to place order");
      }

      return response.data as {
        success: boolean;
        error?: string;
      };
    },
  });
};

export const useLeaveReview = () => {
  return useMutation({
    mutationFn: async (reviewData: z.infer<typeof reviewSchema>) => {
      const response = await axios.post(
        absoluteServerUrl("/review"),
        reviewData,
        { withCredentials: true }
      );

      return response.data as {
        success: boolean;
        error?: string;
      };
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Review submitted successfully");
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    },
  });
};
