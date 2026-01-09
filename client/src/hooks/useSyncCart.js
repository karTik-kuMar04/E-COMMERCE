import apiClient from "@/lib/apiClient";
import useCartStore from "@/stores/cartStore";

export const useSyncCart = () => {
  const setCart = useCartStore((s) => s.setCart);

  const syncCart = async () => {
    try {
        const res = await apiClient.get("/user/cart");
        
        if (res.data.success) {
        const normalized = res.data.cart.map(item => ({
            formatId: item.format_id,
            bookId: item.book_id,
            title: item.title,
            authors: item.authors,
            images: item.images,
            format: item.format,
            price: Number(item.price),
            stock: item.stock,
            quantity: item.quantity
        }));

        setCart(normalized);
        }
    } catch (err) {
        console.error("syncCart failed:", err?.response?.data || err);
    }
  };


  return syncCart;
};
