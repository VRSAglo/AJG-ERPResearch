import type { ReactNode } from "react";
import "./globals.css";
import SiteNavigation from "../components/SiteNavigation";


export const metadata = {
  title: "ERP Research Prototype",
  description: "Service-ticket and scheduling technology research",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
          <body>
          <SiteNavigation />
              {children}
          </body>
    </html>
  );
}
