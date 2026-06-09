import "./globals.css";

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
      </head>
      <body>{children}</body>
    </html>
  );
}
