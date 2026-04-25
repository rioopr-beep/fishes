import './globals.css';
export const metadata = { title: 'Abyssal Descent — rprtx' };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
