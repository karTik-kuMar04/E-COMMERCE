
import './globals.css';

export const metadata = {
  title: 'BookStore',
  description: 'Discover books'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

