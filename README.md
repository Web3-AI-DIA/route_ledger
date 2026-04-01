# RouteLedger

Non-custodial cross-chain payment router built with Next.js.

## Architecture Overview

RouteLedger is a full-stack Next.js application designed to facilitate seamless cross-chain asset transfers.

- **Frontend**: Next.js (App Router) with Tailwind CSS and Framer Motion for a smooth user experience.
- **Wallet Integration**: Reown AppKit (WalletConnect) for EVM and Solana, and Xaman (Xumm) for XRPL.
- **Routing Engine**: Powered by the ChangeNOW API for cross-chain liquidity and routing.
- **Backend**: Next.js API routes with Zod validation, Upstash rate limiting, and Pino structured logging.
- **Database**: Firebase Firestore for storing transfer requests and user data.
- **Monitoring**: Sentry for error tracking and Google Analytics for user behavior analysis.

## Setup Instructions

### Prerequisites

- Node.js 20+
- npm or yarn
- Firebase Project
- ChangeNOW API Key
- Upstash Redis (for rate limiting)
- Reown Project ID
- Sentry DSN
- Google Analytics Measurement ID

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/routeledger.git
   cd routeledger
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.example` to `.env.local` and fill in the required values.

4. Run the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

The following environment variables are required:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API Key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase Auth Domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase Storage Bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase Messaging Sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase App ID |
| `NEXT_PUBLIC_REOWN_PROJECT_ID` | Reown Project ID |
| `CHANGENOW_API_KEY` | ChangeNOW API Key |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST Token |
| `SENTRY_DSN` | Sentry DSN |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN (Public) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Google Analytics Measurement ID |

## Production Readiness

- **Security**: Firestore Security Rules are implemented to ensure data privacy and integrity.
- **Robustness**: Zod validation is used for all API requests.
- **Rate Limiting**: Upstash rate limiting protects API routes from abuse.
- **Logging**: Pino provides structured logging for easier debugging in production.
- **Monitoring**: Sentry and Google Analytics are integrated for real-time monitoring.
- **CI/CD**: GitHub Actions are configured for automated testing, linting, building, and deployment.
- **Backups**: Automated Firestore backups should be enabled in the Firebase Console.

## Testing

- **Linting**: `npm run lint`
- **Building**: `npm run build`
- **Lighthouse**: Automated Lighthouse checks are integrated into the CI/CD pipeline.
