import { Routes as ReactRouterRoutes, Route } from "react-router-dom";
import HomePage from "./components/HomePage";
import WishlistsPage from "./components/WishlistsPage";
import SettingsPage from "./components/SettingsPage";

/**
 * File-based routing.
 * @desc File-based routing that uses React Router under the hood.
 * To create a new route create a new .jsx file in `/pages` with a default export.
 *
 * Some examples:
 * * `/pages/index.jsx` matches `/`
 * * `/pages/blog/[id].jsx` matches `/blog/123`
 * * `/pages/[...catchAll].jsx` matches any URL not explicitly matched
 *
 * @param {object} pages value of import.meta.glob(). See https://vitejs.dev/guide/features.html#glob-import
 *
 * @returns {Routes} `<Routes/>` from React Router, with a `<Route/>` for each file in `/pages`
 */
export default function Routes({ pages }) {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/wishlists" element={<WishlistsPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </ReactRouterRoutes>
  );
}