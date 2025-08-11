import type { Metadata, Viewport } from "next";
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
    description: "Memorize things the most pure way using spaced repetition",
    manifest: "/manifest.json",
    icons: {
        icon: [
            { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" },
            { url: "/icons/icon-512x512.png", sizes: "512x512", type: "image/png" }
        ],
        apple: [
            { url: "/icons/icon-192x192.png", sizes: "192x192", type: "image/png" }
        ]
    },
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "Memento",
        startupImage: [
            {
                url: "/icons/icon-512x512.png",
                media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)"
            },
            {
                url: "/icons/icon-512x512.png",
                media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)"
            },
            {
                url: "/icons/icon-512x512.png",
                media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)"
            }
        ]
    },
    other: {
        "mobile-web-app-capable": "yes",
        "apple-mobile-web-app-capable": "yes",
        "apple-mobile-web-app-status-bar-style": "default",
        "apple-mobile-web-app-title": "Memento",
        "msapplication-TileColor": "#000000",
        "msapplication-config": "/browserconfig.xml"
    }
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "#000000"
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang='en' className='dark'>
            <Head>
                <link rel='icon' href='/favicon.svg' type='image/svg+xml' sizes='any' />
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta name="apple-mobile-web-app-title" content="Memento" />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="theme-color" content="#000000" />
                <meta name="msapplication-TileColor" content="#000000" />
            </Head>
            <body className={`${montserrat.variable} antialiased`}>
                <ReduxProvider>{children}</ReduxProvider>
                <Toaster />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                            if ('serviceWorker' in navigator) {
                                window.addEventListener('load', function() {
                                    navigator.serviceWorker.register('/sw.js')
                                        .then(function(registration) {
                                            console.log('SW registered: ', registration);
                                        })
                                        .catch(function(registrationError) {
                                            console.log('SW registration failed: ', registrationError);
                                        });
                                });
                            }
                        `,
                    }}
                />
            </body>
        </html>
    );
}
