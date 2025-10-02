import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense, type ReactNode } from "react";
import { type Metadata } from "next";
import { DraftModeNotification } from "@/ui/components/DraftModeNotification";
import { FirebaseAuthProvider } from "@/components/auth/FirebaseAuthProvider";
import "@/lib/env-validation"; // Validate environment variables

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Modern Ecommerce Store",
	description: "Premium ecommerce experience with Arabic and English support, powered by Saleor and Clerk.",
	metadataBase: process.env.NEXT_PUBLIC_STOREFRONT_URL
		? new URL(process.env.NEXT_PUBLIC_STOREFRONT_URL)
		: undefined,
};

export default function RootLayout(props: { children: ReactNode }) {
	const { children } = props;

	return (
        <html lang="en" className="min-h-dvh">
          <body className={`${inter.className} min-h-dvh`}>
            <FirebaseAuthProvider>
              {children}
              <Suspense>
                <DraftModeNotification />
              </Suspense>
            </FirebaseAuthProvider>
          </body>
        </html>
	);
}
