# Notarix Site

Frontend application for the `notarix-site` project, built with Next.js App Router.

## Deployment target

The final production target is **AWS** (ECS Fargate behind ALB + CloudFront, or AWS Amplify). The site is currently hosted on **Vercel** as a temporary stand-in while AWS infrastructure is being provisioned. `vercel.json` configures the install (`pnpm install --no-frozen-lockfile`) and build (`next build`) commands.

When migrating from Vercel to AWS:

- Use Node.js 20 runtime, port 3000.
- The app is fully self-contained — no external runtime services other than the Notarix backend.
- Point `NEXT_PUBLIC_API_BASE_URL` and `NEXT_PUBLIC_API_PREFIX` at the AWS-hosted backend origin.
- WebSocket traffic flows over the same HTTPS origin (Socket.IO falls back to long polling if WS isn't available).

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
