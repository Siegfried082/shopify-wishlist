import { useMemo } from "react";
import { Provider } from "@shopify/app-bridge-react";
import { Banner, Layout, Page } from "@shopify/polaris";

/**
 * A component to configure App Bridge.
 * A thin wrapper around AppBridgeProvider that provides additional functionality to the app.
 * Initializes App Bridge and ensures that it is ready before rendering the app.
 */
export function AppBridgeProvider({ children }) {
  const appBridgeConfig = useMemo(
    () => ({
      host: new URLSearchParams(location.search).get("host") || window.__SHOPIFY_DEV_HOST,
      apiKey: import.meta.env.VITE_SHOPIFY_API_KEY,
      forceRedirect: true,
    }),
    []
  );

  if (!appBridgeConfig.host) {
    const bannerProps = !appBridgeConfig.host
      ? {
          title: "Missing Shopify App Bridge host",
          children: (
            <>
              Your app is running outside the Shopify Admin. Please ensure
              your app is being accessed from the Shopify Admin or provide a valid host parameter.
            </>
          ),
        }
      : {
          title: "Missing Shopify App Bridge API key",
          children: (
            <>
              Your app is missing the Shopify App Bridge API key. Please check that VITE_SHOPIFY_API_KEY is set.
            </>
          ),
        };

    return (
      <Page>
        <Layout>
          <Layout.Section>
            <div style={{ marginTop: "100px" }}>
              <Banner {...bannerProps} status="critical" />
            </div>
          </Layout.Section>
        </Layout>
      </Page>
    );
  }

  return (
    <Provider config={appBridgeConfig}>
      {children}
    </Provider>
  );
}