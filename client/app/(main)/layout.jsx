import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto w-full px-6 py-12">{children}</main>
      <Footer />
    </>
  );
}
