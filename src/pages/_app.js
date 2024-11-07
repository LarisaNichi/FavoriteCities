import { Provider } from '@/components/ui/provider';
import Layout from '../components/layout';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  );
}
