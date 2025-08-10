import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { ReduxProvider } from "@/lib/store/provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import Head from "next/head";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Memento",
    description: "Memorize things the most pure way",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' className='dark'>
            <Head>
                <link rel='icon' href='/favicon.svg' sizes='any' />
            </Head>
            <body className={`${montserrat.variable} antialiased`}>
                <ReduxProvider>{children}</ReduxProvider>
                <Toaster />
            </body>
        </html>
    );
}
