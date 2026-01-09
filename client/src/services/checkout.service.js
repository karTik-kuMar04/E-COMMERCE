import apiClient from "@/lib/apiClient";

export const checkoutCartApi = () => {
  return apiClient.post("/user/checkout/cart");
};

export const checkoutSingleBookApi = (formatId, quantity = 1) => {
  return apiClient.post("/user/checkout/book", {
    formatId,
    quantity
  });
};
