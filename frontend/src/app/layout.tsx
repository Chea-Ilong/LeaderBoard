import './globals.css';
import NavBar from '@/components/NavBar';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50">
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
