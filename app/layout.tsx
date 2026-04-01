import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { Providers } from '@/components/Providers';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'RouteLedger',
  description: 'Non-custodial cross-chain payment router',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Suspense fallback={null}>
          {GA_MEASUREMENT_ID && <GoogleAnalytics GA_MEASUREMENT_ID={GA_MEASUREMENT_ID} />}
        </Suspense>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}

