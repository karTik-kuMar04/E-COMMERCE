import AuthProvider from 'src/Providers/AuthProvider';
import './globals.css';

export const metadata = {
  title: 'InkVerse',
  description: 'Discover books',
  icons: {
    icon: [
      {
        url: "/inkverse-icon.png",
        sizes: "32x32",
        type: "image/png",
      },
    ],
    // This adds a high-res version specifically for Apple/Mobile devices
    apple: {
      url: "/inkverse-icon.png",
      sizes: "180x180",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

