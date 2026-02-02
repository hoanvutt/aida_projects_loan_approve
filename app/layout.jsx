import "./globals.css";

export const metadata = {
  title: "Loan Approval UI",
  description: "Test UI for Loan Approval ML API"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900">
        {children}
      </body>
    </html>
  );
}
