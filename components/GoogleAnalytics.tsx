'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import ReactGA from 'react-ga4';

export default function GoogleAnalytics({ GA_MEASUREMENT_ID }: { GA_MEASUREMENT_ID: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    ReactGA.initialize(GA_MEASUREMENT_ID);
  }, [GA_MEASUREMENT_ID]);

  useEffect(() => {
    const url = pathname + searchParams.toString();
    ReactGA.send({ hitType: 'pageview', page: url });
  }, [pathname, searchParams]);

  return null;
}
