import { Suspense } from "react";
import Login from "./login";

export default function LoginPage() {
  return(
    <Suspense fallback={<div className="p-10">Loading order...</div>}>
      <Login />
    </Suspense>
  )
}