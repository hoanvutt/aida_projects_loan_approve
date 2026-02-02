import "./globals.css";

export const metadata = {
  title: "Loan Decision | Demo UI",
  description: "Single-page UI for Loan Decision API",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
