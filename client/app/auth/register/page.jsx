import { Suspense } from "react";
import Register from "./register";

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="p-10">Loading order...</div>}>
      <Register />
    </Suspense>
  )
}