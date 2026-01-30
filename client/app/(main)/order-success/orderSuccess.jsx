'use client';

import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { Button, Card } from "@/components/ui/UI";
import { useEffect } from "react";

export default function OrderSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get("orderId");

  // Auto redirect after 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer); // cleanup
  }, [router]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
    >
      <Card className="max-w-md w-full p-8 text-center space-y-6 shadow-lg">
        
        <div className="flex justify-center">
          <CheckCircle className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900">
          Order Placed Successfully!
        </h1>

        <p className="text-gray-600">
          Thank you for your purchase. Your order has been placed and is being processed.
        </p>

        {orderId && (
          <div className="bg-gray-100 rounded-lg py-3 px-4 text-sm">
            <strong>Order ID:</strong> {orderId}
          </div>
        )}

        <p className="text-sm text-gray-500">
          Redirecting to homepage in 2 seconds...
        </p>

        <div className="flex gap-4 pt-4">
          <Button
            variant="primary"
            className="flex-1"
            onClick={() => router.push("/account")}
          >
            View Orders
          </Button>

          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => router.push("/books")}
          >
            Continue Shopping
          </Button>
        </div>

      </Card>
    </motion.div>
  );
}
