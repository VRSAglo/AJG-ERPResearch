import type { ReactNode } from "react";

export const metadata = {
  title: "ERP Research Prototype",
  description: "Service-ticket and scheduling technology research",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
