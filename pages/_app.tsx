import '../styles/global.scss';
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react';
import StickyCursor from '../components/StickyCursor';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      <StickyCursor stickyElement={undefined} />
      <Analytics />
    </>
  );
}

export default MyApp;
