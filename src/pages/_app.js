import { Provider } from '@/components/ui/provider';
import '@/styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <Provider>
      <Component {...pageProps} />
    </Provider>
  );
}
