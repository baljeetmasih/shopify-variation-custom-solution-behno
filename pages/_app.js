import AppBridgeProvider from "@/components/providers/AppBridgeProvider";
import { AppProvider as PolarisProvider } from "@shopify/polaris";
import "@shopify/polaris/build/esm/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import Link from "next/link";
import '../styles/global.css';

export default function App({ Component, pageProps }) {
  return (
    <>
      <PolarisProvider
        i18n={translations}
        features={{
          polarisSummerEditions2023: true,
        }}
      >
        <AppBridgeProvider>
          <ui-nav-menu>
            <Link href="/debug/data">All Pairs</Link>
            <Link href="/debug/pairs/create">Create pair</Link>
            <Link href="/debug/billing">Billing API</Link>
          </ui-nav-menu>
          <Component {...pageProps} />
        </AppBridgeProvider>
      </PolarisProvider>
    </>
  );
}
