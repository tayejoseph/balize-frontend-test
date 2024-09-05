import "./globals.css";
import type { PropsWithChildren } from "react";
import { QueryProvider } from "../components";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
