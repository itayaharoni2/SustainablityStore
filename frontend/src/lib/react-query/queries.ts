import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { absoluteServerUrl } from "../utils";
import { Activities, IUser, Order, OrderItem, Product, Review } from "@/types";
import { CategoryEnum } from "@/types";
import { ProductState } from "@/schemas/products";

enum QueryKeys {
  GET_PRODUCTS = "getProducts",
  GET_PRODUCT_BY_ID = "getProductById",
  GET_PRODUCT_BY_FILTERS = "getProductsByFilters",
  GET_ADMIN_PRODUCTS = "getAdminProducts",
  GET_SEARCH_RESULTS = "getSearchResults",
  GET_USERS_ACTIVITIES = "getUsersActivities",
  GET_CURRENT_USER_ACTIVITIES = "getCurrentUserActivities",
  GET_USER_ORDERS = "getUserOrders",
  GET_REVIEWS = "getReviews",
}

export const useGetProducts = (category?: CategoryEnum) => {
  return useQuery({
    queryKey: [QueryKeys.GET_PRODUCTS],
    queryFn: async () => {
      const response = await axios.get(
        absoluteServerUrl(`/products?category=${category}`),
        {
          withCredentials: true,
        }
      );

      return response.data.products as Product[];
    },
  });
};

export const useGetProductById = (productId: string) => {
  return useQuery({
    queryKey: [QueryKeys.GET_PRODUCT_BY_ID, productId],
    queryFn: async () => {
      const response = await axios.get(
        absoluteServerUrl(`/products/${productId}`),
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        return response.data.product as Product;
      }

      return null;
    },
  });
};

interface ProductResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

export const useGetProductsByFilters = (filters: ProductState) => {
  return useInfiniteQuery<ProductResponse, Error>({
    queryKey: [QueryKeys.GET_PRODUCT_BY_FILTERS, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const { data } = await axios.get(absoluteServerUrl("/products/filters"), {
        params: {
          category: {
            name: filters.category.name,
            selected: filters.category.selected,
          },
          sort: filters.sort,
          price: [filters.price.range[0], filters.price.range[1]],
          page: pageParam,
          pageSize: filters.pageSize, // You can adjust this or make it dynamic
        },
        withCredentials: true,
      });
      return data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.currentPage < lastPage.pagination.totalPages) {
        return lastPage.pagination.currentPage + 1;
      }
      return undefined;
    },
    initialPageParam: 1, // Add the initialPageParam property
  });
};

export const useGetAdminProducts = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_ADMIN_PRODUCTS],
    queryFn: async () => {
      const response = await axios.get(absoluteServerUrl("/admin/products"), {
        withCredentials: true,
      });

      return response.data.products as Product[];
    },
  });
};

interface SearchResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
  };
}

interface SearchParams {
  q: string;
  page?: number;
  pageSize?: number;
}

export const useSearchProducts = (searchParams: SearchParams) => {
  return useQuery({
    queryKey: [QueryKeys.GET_SEARCH_RESULTS, searchParams],
    queryFn: async () => {
      const { data } = await axios.get<SearchResponse>(
        absoluteServerUrl("/products/search"),
        {
          params: searchParams,
          withCredentials: true,
        }
      );

      return data;
    },
    enabled: !!searchParams.q,
  });
};

export const useUsersActivities = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_USERS_ACTIVITIES],
    queryFn: async () => {
      const response = await axios.get(
        absoluteServerUrl("/admin/user/activities"),
        {
          withCredentials: true,
        }
      );

      return response.data.activities as (Activities & { user: IUser })[];
    },
  });
};

export const useCurrentUserActivities = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_CURRENT_USER_ACTIVITIES],
    queryFn: async () => {
      const response = await axios.get(absoluteServerUrl("/user/activities"), {
        withCredentials: true,
      });

      return response.data.activities as (Activities & { user: IUser })[];
    },
  });
};

export const useGetUserOrders = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_USER_ORDERS],
    queryFn: async () => {
      const response = await axios.get(absoluteServerUrl("/order/get-orders"), {
        withCredentials: true,
      });

      return response.data.orders as (Order & {
        items: (OrderItem & { product: Product })[];
      })[];
    },
  });
};

export const useGetReviews = () => {
  return useQuery({
    queryKey: [QueryKeys.GET_REVIEWS],
    queryFn: async () => {
      const response = await axios.get(absoluteServerUrl("/review"), {
        withCredentials: true,
      });

      return response.data.data as (Review & {
        user: IUser;
      })[];
    },
  });
};
