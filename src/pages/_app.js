import { SessionProvider } from 'next-auth/react';
import { Provider } from '@/components/ui/provider';
import Layout from '../components/layout';
import '@/styles/globals.css';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  return (
    <SessionProvider session={session}>
      <Provider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </Provider>
    </SessionProvider>
  );
}
