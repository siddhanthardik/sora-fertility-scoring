/**
 * robots.js — Next.js App Router metadata file
 *
 * Next.js automatically serves this as /robots.txt at build time.
 * See: https://nextjs.org/docs/app/api-reference/file-conventions/metadata/robots
 *
 * Rules:
 *  - Allow all public-facing marketing & tool pages
 *  - Block private/internal paths: /api, /superadmin, /crm, /clinic (dashboard), /widget
 */
export default function robots() {
  return {
    rules: [
      {
        // General crawlers — allow everything except internal routes
        userAgent: "*",
        allow: [
          "/",
          "/about",
          "/blog/",
          "/contact",
          "/fertility-assessment",
          "/pcos-assessment",
          "/tools/",
          "/tools/due-date-calculator",
          "/tools/egg-freezing-planner",
          "/tools/bmi-calculator",
          "/tools/ovulation-calculator",
          "/tools/period-calculator",
          "/privacy-policy",
          "/terms-of-service",
          "/cookie-policy",
          "/sample-report",
          "/book-appointment",
        ],
        disallow: [
          "/api/",
          "/superadmin/",
          "/crm/",
          "/clinic/",    // clinic dashboard (login, settings, billing)
          "/widget/",    // embeddable widget pages
          "/_next/",     // Next.js internals
        ],
      },
    ],
    sitemap: "https://sorafertility.com/sitemap.xml",
    host: "https://sorafertility.com",
  };
}
