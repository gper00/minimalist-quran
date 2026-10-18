import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, RuntimeCaching, SerwistGlobalConfig } from "serwist";
import { CacheFirst, ExpirationPlugin, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: WorkerGlobalScope;

// Tafsir files are fetched on demand, so they are not precached. Cache them
// after the first open to keep the dialog usable offline.
const tafsirCaching: RuntimeCaching = {
  matcher: ({ url }) => url.pathname.startsWith("/data/tafsir/"),
  handler: new CacheFirst({
    cacheName: "tafsir",
    plugins: [new ExpirationPlugin({ maxEntries: 30, maxAgeSeconds: 60 * 60 * 24 * 90 })],
  }),
};

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [tafsirCaching, ...defaultCache],
});

serwist.addEventListeners();
