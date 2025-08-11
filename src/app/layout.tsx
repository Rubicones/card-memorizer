import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import { ReduxProvider } from "@/lib/store/provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const montserrat = Montserrat({
    variable: "--font-montserrat",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Memento - Card Learning App",
    description: "Memorize things the most pure way using spaced repetition. A powerful flashcard app with offline support and spaced repetition learning.",
    keywords: ["flashcards", "memorization", "spaced repetition", "learning", "study", "education", "pwa"],
    authors: [{ name: "Memento Team" }],
    creator: "Memento",
    publisher: "Memento",
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    openGraph: {
        title: "Memento - Card Learning App",
        description: "Memorize things the most pure way using spaced repetition",
        url: "https://memento-app.com",
        siteName: "Memento",
        images: [
            {
                url: "/icons/icon-512x512.png",
                width: 512,
                height: 512,
                alt: "Memento App Icon",
            },
        ],
        locale: "en_US",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Memento - Card Learning App",
        description: "Memorize things the most pure way using spaced repetition",
        images: ["/icons/icon-512x512.png"],
    },
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
        "apple-mobile-web-app-status-bar-style": "black-translucent",
        "apple-mobile-web-app-title": "Memento"
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
            <head>
                <link rel="manifest" href="/manifest.json" />
                <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
                <link rel="icon" href="/favicon.svg" type="image/svg+xml" sizes="any" />
                
                {/* Essential PWA Meta Tags */}
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
                <meta name="apple-mobile-web-app-title" content="Memento" />
                <meta name="application-name" content="Memento" />
                <meta name="theme-color" content="#000000" />
                <meta name="format-detection" content="telephone=no" />
                <meta name="msapplication-tap-highlight" content="no" />
            </head>
            <body className={`${montserrat.variable} antialiased`}>
                <ReduxProvider>{children}</ReduxProvider>
                <Toaster />
                {process.env.NODE_ENV === "production" && (
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
                )}
            </body>
        </html>
    );
}
