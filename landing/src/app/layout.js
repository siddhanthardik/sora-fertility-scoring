import "./globals.css";
import Script from "next/script";

export const metadata = {
  title: "SORA Fertility | Private Fertility Risk Awareness Tool",
  description: "Take a private, evidence-aligned fertility risk awareness check and receive clear fertility signals, referral guidance, and optional ovarian reserve context.",
  keywords: "fertility test, fertility assessment, fertility risk check, FertiSTAT, ovarian reserve, AMH, FSH, AFC, pregnancy planning",
  openGraph: {
    title: "SORA Fertility | Private Fertility Risk Awareness Tool",
    description: "Confidential fertility risk awareness with private server-side scoring.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/sora-logo.png" sizes="any" />
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <Script id="google-tag-manager" strategy="afterInteractive">
            {`
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
            `}
          </Script>
        )}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7005681470580247"
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body>
        {process.env.NEXT_PUBLIC_GTM_ID && (
          <noscript>
            <iframe 
              src={`https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}`}
              height="0" 
              width="0" 
              style={{ display: "none", visibility: "hidden" }}
            ></iframe>
          </noscript>
        )}
        {children}
      </body>
    </html>
  );
}
