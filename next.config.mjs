import withSerwistInit from "@serwist/next";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  turbopack: {},
}

// A revision string that changes on every build so browsers refresh precached
// pages instead of serving stale ones.
const revision = process.env.VERCEL_GIT_COMMIT_SHA || Date.now().toString()

// Every surah page is statically generated, so we can precache all of them at
// install time. Without this, the service worker only cached pages the user had
// already visited, which broke offline reading for the rest of the Quran.
const additionalPrecacheEntries = [
  { url: "/", revision },
  ...Array.from({ length: 114 }, (_, i) => ({
    url: `/surah/${i + 1}`,
    revision,
  })),
]

const withSerwist = withSerwistInit({
  swSrc: "app/sw.ts",
  swDest: "public/sw.js",
  additionalPrecacheEntries,
  disable: process.env.NODE_ENV === "development",
});

export default withSerwist(nextConfig)
