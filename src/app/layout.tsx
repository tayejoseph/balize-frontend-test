import "./globals.css";
import type { PropsWithChildren } from "react";
// import { QueryProvider } from "../components";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <h1>Hello Testing Ora</h1>
        {/* <QueryProvider>{children}</QueryProvider> */}
      </body>
    </html>
  );
}
