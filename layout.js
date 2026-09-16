import "./globals.css";

export const metadata = {
  title: "RPA Backlog",
  description: "RPA talep ve backlog demo uygulaması",
};

export default function RootLayout({ children }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
