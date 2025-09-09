import "./globals.css";
import type { PropsWithChildren } from "react";

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body>
        <h1>Hello Testing Ora</h1>
        {children}
      </body>
    </html>
  );
}
