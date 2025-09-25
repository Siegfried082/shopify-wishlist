import "@shopify/polaris/build/esm/styles.css";
import { AppProvider } from "@shopify/polaris";
import enTranslations from "@shopify/polaris/locales/en.json";

/**
 * A component to configure Polaris.
 * A thin wrapper around AppProvider that provides additional functionality to the app.
 */
export function PolarisProvider({ children }) {
  return (
    <AppProvider i18n={enTranslations}>
      {children}
    </AppProvider>
  );
}