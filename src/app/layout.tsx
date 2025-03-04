import "@/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Flatoinator3000",
  description:
    "We bully our good friend hehe :) She allowed it so don't worry :)",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pl" className={GeistSans.variable} suppressHydrationWarning>
      <head />
      <body className="flex min-h-screen flex-col items-center justify-between bg-background font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          storageKey="theme-preference" // Add a storage key
          enableColorScheme={true} // Explicitly enable color scheme
        >
          {children}
          <footer className="flex w-full items-center justify-center gap-5 border-t-2 p-4 text-center">
            <span>
              {" "}
              Built by Jakub Rudnik. Source code on{" "}
              <a
                className="font-medium text-primary underline underline-offset-4"
                href="https://github.com/Jakub-Rudnik/flatoinator3000"
                target="_blank"
              >
                github
              </a>
            </span>
            <ModeToggle />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
