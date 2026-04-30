# Onsus Electronics - AWS Ready Frontend

React + Vite storefront prepared for AWS integration with:
- Amazon Cognito authentication (Amplify)
- API Gateway + Lambda services
- S3-hosted frontend/static assets

## Features Covered

- Products listing + admin CRUD integration
- Auth flows with Cognito (email/password + Google Hosted UI)
- Wishlist integration
- Contact form integration
- Fake-buy cart flow (frontend/local storage)

## Quick Start

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

Production:

```bash
npm run build
npm run preview
```

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill values from your AWS resources (Cognito + API Gateway)

Core variables:
- `VITE_API_BASE_URL` - API Gateway stage base URL
- `VITE_API_AUTH_TOKEN_TYPE` - `id` or `access` (depends on API Gateway authorizer expectation)
- `VITE_PRODUCTS_ENDPOINT` - products route path (for example `/products` or `/admin/products`)
- `VITE_WISHLIST_ENDPOINT` - wishlist route path (default `/wishlist`)
- `VITE_PROFILE_ENDPOINT` - profile route path (default `/profile`)
- `VITE_CART_ENDPOINT` - cart route path (default `/cart`)
- `VITE_CONTACT_ENDPOINT` - contact Lambda route
- `VITE_NEWSLETTER_ENDPOINT` - newsletter Lambda route
- `VITE_NEWSLETTER_BASE_URL` - optional separate API base for newsletter
- `VITE_COGNITO_USER_POOL_ID`
- `VITE_COGNITO_USER_POOL_CLIENT_ID`
- `VITE_COGNITO_HOSTED_UI_DOMAIN`

### Cognito values from your console

From your screenshot/config:
- App client ID: `XXXXXXXXXXXXXXXXXXXXXX`
- Region: `us-east-1`
- App client name: `react-client`

You still need to copy the exact **User pool ID** (`us-east-1_...`) and **Domain** from Cognito UI into `.env`.

## Cognito Setup (AWS Console)

For your `react-client` app client:
1. In Cognito app client, add callback URL:
   - local: `http://localhost:5173/`
   - production: your CloudFront URL (for example `https://d84l1y8p4kdic.cloudfront.net/`)
2. Add logout URL:
   - local: `http://localhost:5173/`
   - production: `https://d84l1y8p4kdic.cloudfront.net/`
3. In OAuth scopes, include at least:
   - `openid`
   - `email`
   - `profile`
4. If using Google, configure provider under Cognito "Social and external providers".

## Backend Link (API Gateway + Lambda)

1. Protect routes with Cognito authorizer.
2. Frontend sends `Authorization: Bearer <token>` automatically from `src/api/http.js`.
3. Choose token type in `.env`:
   - `VITE_API_AUTH_TOKEN_TYPE=id` for ID token authorizers
   - `VITE_API_AUTH_TOKEN_TYPE=access` for access token authorizers
4. Enable CORS on each route (`OPTIONS`) for your frontend domain.

## One Place For API Integration

All routes and API base URLs are centralized in:
- `src/config/api.js`

All HTTP service wrappers are in:
- `src/api/`

When connecting new Lambda routes, update `src/config/api.js` and service files under `src/api/` only.

## Current Service Mapping

- Products: `src/api/products.js`
- Wishlist: `src/api/wishlist.js`
- Profile: `src/api/profile.js`
- Cart: `src/api/cart.js`
- Contact + Newsletter: `src/api/contact.js`
- Shared client/interceptors: `src/api/http.js`

## AWS Deployment Notes

- Frontend: deploy `dist/` to S3 (or Amplify Hosting)
- API: expose Lambda functions through API Gateway
- Auth: configure Cognito User Pool + App Client + Hosted UI callback URLs
- CORS: allow your frontend domain on API Gateway routes
- Authorization: protected routes use Bearer token from Cognito (`id` or `access` token by env config)

## Recommended Next AWS Steps

1. Create Lambda routes for `contact` and `newsletter`
2. Add admin delete product Lambda route and wire it in `src/api/products.js`
3. Store product images in S3 and save full image URLs in product payload
