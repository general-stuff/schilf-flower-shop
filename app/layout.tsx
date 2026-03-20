import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Flower Shop",
  description: "Order beautiful bouquets online",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
