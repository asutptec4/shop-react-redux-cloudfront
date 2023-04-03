import axios, { AxiosError } from "axios";
import React from "react";
import { useQuery, useQueryClient, useMutation } from "react-query";
import API_PATHS from "~/constants/apiPaths";
import { CartItem } from "~/models/CartItem";
import { Product } from "../models/Product";

export function useCart() {
  return useQuery<CartItem[], AxiosError>("cart", async () => {
    const res = await axios.get<{ result: CartItem[] }>(
      `${API_PATHS.cart}/profile/cart`,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      }
    );
    const items = res.data.result;
    for (const item of items) {
      const product = await axios.get<{ result: Product }>(
        `${API_PATHS.bff}/products/${item.productId}`
      );
      item.product = product.data.result;
    }
    return res.data.result;
  });
}

export function useCartData() {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<CartItem[]>("cart");
}

export function useInvalidateCart() {
  const queryClient = useQueryClient();
  return React.useCallback(
    () => queryClient.invalidateQueries("cart", { exact: true }),
    []
  );
}

export function useUpsertCart() {
  return useMutation((values: CartItem) =>
    axios.put<{ result: CartItem[] }>(
      `${API_PATHS.cart}/profile/cart`,
      values,
      {
        headers: {
          Authorization: `Basic ${localStorage.getItem("authorization_token")}`,
        },
      }
    )
  );
}
