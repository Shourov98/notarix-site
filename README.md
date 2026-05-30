# Notarix Site

Frontend application for the `notarix-site` project, built with Next.js App Router.

## Getting Started

Run the development server:

```bash
pnpm dev
```

Open `http://localhost:3000` in the browser.

## Project Structure

```text
notarix-site/
├── package.json
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── jsconfig.json
├── next.config.mjs
├── eslint.config.mjs
├── postcss.config.mjs
├── public/
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── landing_page/
│       └── hero_image.png
├── src/
│   ├── app/
│   │   ├── favicon.ico
│   │   ├── globals.css
│   │   ├── layout.js
│   │   ├── (landing)/
│   │   │   ├── layout.js
│   │   │   ├── page.js
│   │   │   ├── contact/
│   │   │   │   └── page.js
│   │   │   ├── legal-validity/
│   │   │   │   └── page.js
│   │   │   ├── security/
│   │   │   │   └── page.js
│   │   │   ├── terms-of-use/
│   │   │   │   └── page.js
│   │   │   └── trust/
│   │   │       └── page.js
│   │   ├── dashboard-client/
│   │   │   ├── layout.js
│   │   │   ├── page.js
│   │   │   ├── documents/
│   │   │   │   └── page.js
│   │   │   ├── messages/
│   │   │   │   └── page.js
│   │   │   ├── orders/
│   │   │   │   ├── page.js
│   │   │   │   ├── new/
│   │   │   │   │   └── page.js
│   │   │   │   └── [id]/
│   │   │   │       ├── page.js
│   │   │   │       ├── NCOrderView.js
│   │   │   │       └── RONOrderView.js
│   │   │   ├── payments/
│   │   │   │   └── page.js
│   │   │   └── settings/
│   │   │       ├── layout.js
│   │   │       ├── page.js
│   │   │       ├── notifications/
│   │   │       │   └── page.js
│   │   │       ├── payments/
│   │   │       │   └── page.js
│   │   │       ├── profile-details/
│   │   │       │   └── page.js
│   │   │       └── security/
│   │   │           └── page.js
│   │   ├── document/
│   │   │   └── [id]/
│   │   │       └── page.js
│   │   └── session/
│   │       └── [id]/
│   │           └── page.js
│   └── components/
│       ├── contact_page/
│       │   └── RequestAccessForm.js
│       ├── dashboard-client/
│       │   ├── ActiveOrderCard.js
│       │   ├── ActivityFeed.js
│       │   ├── DocumentsTable.js
│       │   ├── Navbar.js
│       │   ├── OrderDistribution.js
│       │   ├── OrdersTable.js
│       │   ├── PaymentsStats.js
│       │   ├── PaymentsTable.js
│       │   ├── RecentOrders.js
│       │   ├── Sidebar.js
│       │   └── StatsOverview.js
│       ├── landing_page/
│       │   ├── CTASection.js
│       │   ├── Features.js
│       │   ├── Footer.js
│       │   ├── Hero.js
│       │   ├── HowItWorks.js
│       │   ├── Navbar.js
│       │   ├── TrustSection.js
│       │   └── UserRoles.js
│       ├── terms_page/
│       │   └── TermsSidebar.js
│       └── trust_page/
│           ├── ComplianceStandards.js
│           ├── PlatformProtection.js
│           ├── PrivacyFirst.js
│           └── TrustCTA.js
└── README.md
```

## Notes

- `src/app/(landing)` contains public marketing and informational pages.
- `src/app/dashboard-client` contains the client dashboard experience.
- `src/components` contains reusable UI sections grouped by page area.
