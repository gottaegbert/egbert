import "../styles/global.scss";
import type { AppProps } from "next/app";
import { StoreProvider } from '../utils/Store'
import { Analytics } from '@vercel/analytics/react';
import MainPreloaderWrapper from '../components/MainPreloader/MainPreloaderWrapper'
import NextNProgress from 'nextjs-progressbar'
import { AnimatePresence } from 'framer-motion'
// import AppLayout from '../components/AppLayout'

function MyApp({ Component, pageProps }: AppProps) {
  const onExitComplete = () => {
    history.scrollRestoration = 'manual'
    window.scrollTo({ top: 0 })
  }
  return (
    <>
      {/* <Component {...pageProps} /> */}

      <StoreProvider>
        {/* <AppLayout> */}
          <NextNProgress color="#2fbe12" />
          <div id="portal"></div>
          <MainPreloaderWrapper />
          <AnimatePresence onExitComplete={onExitComplete} mode="wait">
            <Component {...pageProps}/>
          </AnimatePresence>
        {/* </AppLayout> */}
      </StoreProvider>

      <Analytics />
    </>
  );
}


export default MyApp;
