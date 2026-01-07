'use client';

import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import { ToastProvider } from "src/context/ToastContext";

export default function MainLayout({ children }) {
  return (
    <ToastProvider>
      <Header />
      <main>{children}</main>
      <Footer />
    </ToastProvider>
  );
}
