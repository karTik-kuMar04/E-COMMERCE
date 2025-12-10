import './globals.css';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';

export const metadata = {
  title: 'BookStore - Your Favorite Books',
  description: 'Discover and purchase your favorite books',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
