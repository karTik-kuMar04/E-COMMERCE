import apiClient from "@/lib/apiClient.js";

export const homeBooks = async () => {
  return await apiClient.get("/book/home")
};


export const getBookById = async (id) => {
    return await apiClient.get(`/book/${id}`);
}