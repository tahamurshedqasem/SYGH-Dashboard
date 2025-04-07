import "./globals.css";

export const metadata = {
  title: "Responsive Dashboard",
  description: "With collapsible sidebar using Tailwind",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
