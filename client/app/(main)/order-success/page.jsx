import { Suspense } from "react";
import OrderSuccess from "./orderSuccess";

export default function orderSuccessPage() {
  return(
    <Suspense fallback={<div className="p-10">Loading...</div>}>
      <OrderSuccess />
    </Suspense>
  )
}