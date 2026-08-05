<img width="1225" height="735" alt="image" src="https://github.com/user-attachments/assets/fad9633c-7f74-4107-bbdc-e6c1a76953fb" />


<div align="center">

# Onsus — Serverless E-Commerce on AWS

A responsive React storefront and administration dashboard integrated with a serverless AWS backend.

<p>
  <img src="https://img.shields.io/badge/AWS-Serverless-FF9900?style=for-the-badge&logo=amazonwebservices&logoColor=white" alt="AWS Serverless" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=111827" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite-6-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 6" />
  <img src="https://img.shields.io/badge/CI%2FCD-GitHub_Actions-2088FF?style=for-the-badge&logo=githubactions&logoColor=white" alt="GitHub Actions" />
</p>

<p>
  <img src="https://img.shields.io/badge/CloudFront-8C4FFF?style=flat-square&logo=amazoncloudfront&logoColor=white" alt="Amazon CloudFront" />
  <img src="https://img.shields.io/badge/S3-569A31?style=flat-square&logo=amazons3&logoColor=white" alt="Amazon S3" />
  <img src="https://img.shields.io/badge/Cognito-DD344C?style=flat-square&logo=amazoncognito&logoColor=white" alt="Amazon Cognito" />
  <img src="https://img.shields.io/badge/API_Gateway-FF4F8B?style=flat-square&logo=amazonapigateway&logoColor=white" alt="Amazon API Gateway" />
  <img src="https://img.shields.io/badge/Lambda-FF9900?style=flat-square&logo=awslambda&logoColor=white" alt="AWS Lambda" />
  <img src="https://img.shields.io/badge/DynamoDB-4053D6?style=flat-square&logo=amazondynamodb&logoColor=white" alt="Amazon DynamoDB" />
  <img src="https://img.shields.io/badge/CloudWatch-FF4F8B?style=flat-square&logo=amazoncloudwatch&logoColor=white" alt="Amazon CloudWatch" />
</p>

</div>

---

## Overview

Onsus is an electronics e-commerce application built with React and Vite. The frontend communicates with AWS services through Amazon API Gateway and AWS Lambda, uses Amazon Cognito for customer and administrator authentication, stores application data in Amazon DynamoDB, and uploads product images directly to Amazon S3 through presigned URLs.

The repository also includes a GitHub Actions workflow that builds the frontend, synchronizes the generated `dist/` directory to an S3 hosting bucket, and invalidates the associated CloudFront distribution.

> [!IMPORTANT]
> This repository contains the **frontend application, AWS client integration, and frontend deployment workflow**. Lambda source code, DynamoDB definitions, Cognito configuration, queues, topics, networking resources, and infrastructure-as-code are provisioned separately and are not included here.

## Architecture

<p align="center">
  <img src="docs/architecture/aws-topology.png" alt="Onsus AWS serverless architecture topology" width="100%" />
</p>

The diagram represents the **target AWS topology**:

1. Customers and administrators access the application over HTTPS.
2. AWS WAF can protect the CloudFront distribution.
3. CloudFront serves the React build stored in an S3 frontend bucket.
4. Amazon Cognito handles sign-in, token refresh, Google Hosted UI, and administrator group membership.
5. The frontend sends bearer tokens to Amazon API Gateway.
6. API Gateway invokes Lambda functions for products, cart, wishlist, profile, checkout, contact forms, and presigned upload URLs.
7. Lambda functions read and write application data in DynamoDB.
8. Product images are uploaded directly to S3 using short-lived presigned URLs and may be distributed through CloudFront.
9. CloudWatch receives backend logs and metrics.
10. SQS and SNS can be used asynchronously for contact notifications or other background workflows.

## Repository Scope

| Area | Status | Notes |
|---|---:|---|
| React storefront | Included | Product browsing, product details, cart, wishlist, checkout, contact, and authentication pages |
| Admin dashboard | Included | Product CRUD, image upload, customer orders, and contact messages |
| Cognito client integration | Included | Email/password, Google redirect, token refresh, and `admin` group checks |
| API Gateway client layer | Included | Centralized Axios clients and route configuration |
| S3 presigned image uploads | Included | Admin requests an upload URL and sends the file directly to S3 |
| S3 + CloudFront deployment | Included | Automated through GitHub Actions |
| Lambda functions | External | Required backend implementation is not stored in this repository |
| DynamoDB tables | External | Expected by the API contracts |
| WAF, SQS, SNS, and VPC | Target/optional | Displayed in the architecture but not provisioned by this repository |
| Payment processing | Not included | The checkout submits a purchase request but does not integrate a payment provider |

## Features

### Storefront

- Responsive electronics catalog
- Product details and image galleries
- Shopping cart with local fallback and authenticated API synchronization
- Wishlist with local fallback and authenticated API synchronization
- Customer registration and sign-in using Cognito
- Google sign-in through Cognito Hosted UI
- Checkout and order submission
- Contact form and newsletter subscription
- Route-based navigation with React Router

### Administration

- Administrator authorization through the Cognito `admin` group
- Product creation, editing, deletion, and search
- Main, hover, and gallery image uploads
- Direct-to-S3 uploads using presigned URLs
- Customer order listing
- Contact-message listing
- Protected `/admin/*` routes

### Delivery

- Vite production build
- Automatic deployment from the `main` branch
- S3 synchronization using `aws s3 sync`
- CloudFront cache invalidation after deployment

## Technology Stack

| Layer | Technologies |
|---|---|
| UI | React 19, Bootstrap 5, Sass, Swiper, PhotoSwipe |
| Build tooling | Vite 6, SWC, ESLint |
| Routing | React Router 7 |
| Authentication | AWS Amplify Auth, Amazon Cognito |
| HTTP client | Axios |
| API layer | Amazon API Gateway and AWS Lambda |
| Data | Amazon DynamoDB |
| Object storage | Amazon S3 |
| CDN | Amazon CloudFront |
| Monitoring | Amazon CloudWatch |
| CI/CD | GitHub Actions |

## Project Structure

```text
.
├── .github/
│   └── workflows/
│       └── deploy.yml              # Build and deploy to S3/CloudFront
├── public/                         # Static assets, styles, fonts, and images
├── src/
│   ├── api/                        # API clients and service wrappers
│   ├── auth/                       # Cognito session helpers
│   ├── components/                 # Storefront and dashboard components
│   ├── config/
│   │   ├── amplify.js              # Cognito/Amplify configuration
│   │   └── api.js                  # API base URLs and route paths
│   ├── context/                    # Auth, catalog, cart, and wishlist state
│   ├── data/                       # Static UI data
│   ├── pages/
│   │   ├── admin/                  # Protected administration pages
│   │   ├── auth/                   # Login and registration
│   │   └── products/               # Cart, wishlist, and checkout
│   ├── App.jsx                     # Application routes
│   └── main.jsx                    # React entry point
├── .env.example
├── package.json
├── topologyAWS.MD
├── topologyAWS2.MD
└── vite.config.js
```

## Prerequisites

- Node.js 18 or later
- npm
- An Amazon Cognito User Pool and App Client
- An API Gateway deployment connected to the required Lambda functions
- DynamoDB tables used by those Lambda functions
- An S3 bucket for product images
- An S3 hosting bucket and CloudFront distribution for frontend deployment

## Local Setup

```bash
git clone https://github.com/AhmadKhalil05/onsus-aws-serverless-ecommerce.git
cd onsus-aws-serverless-ecommerce

npm install
cp .env.example .env
npm run dev
```

The development server will be available at:

```text
http://localhost:5173
```

## Environment Variables

Create a `.env` file from `.env.example` and replace every placeholder with values from your AWS environment.

```dotenv
# API Gateway
VITE_API_BASE_URL=https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/YOUR_STAGE
VITE_API_AUTH_TOKEN_TYPE=id

# API routes
VITE_PRODUCTS_ENDPOINT=/products
VITE_ADMIN_PRODUCTS_ENDPOINT=/admin
VITE_WISHLIST_ENDPOINT=/wishlist
VITE_PROFILE_ENDPOINT=/profile
VITE_CART_ENDPOINT=/cart
VITE_CONTACT_ENDPOINT=/contact
VITE_UPLOAD_ENDPOINT=/upload
VITE_PURCHASE_ENDPOINT=/purchase
VITE_NEWSLETTER_ENDPOINT=/newsletter/subscribe

# Optional separate newsletter API
VITE_NEWSLETTER_BASE_URL=

# Amazon Cognito
VITE_COGNITO_USER_POOL_ID=YOUR_REGION_XXXXXXXXX
VITE_COGNITO_USER_POOL_CLIENT_ID=YOUR_APP_CLIENT_ID
VITE_COGNITO_HOSTED_UI_DOMAIN=YOUR_DOMAIN.auth.YOUR_REGION.amazoncognito.com
```

`VITE_API_AUTH_TOKEN_TYPE` accepts:

- `id` — sends the Cognito ID token
- `access` — sends the Cognito access token

The selected token must match the configuration of the API Gateway authorizer.

## Expected API Contract

| Method | Route | Purpose | Authentication |
|---|---|---|---|
| `GET` | `/products` | List and filter products | API dependent |
| `POST` | `/admin` | Create a product | Admin bearer token |
| `PUT` | `/admin?productId=...` | Update a product | Admin bearer token |
| `DELETE` | `/admin?productId=...` | Delete a product | Admin bearer token |
| `GET` | `/wishlist` | Load customer wishlist | Customer bearer token |
| `POST` | `/wishlist` | Add a wishlist item | Customer bearer token |
| `DELETE` | `/wishlist?productId=...` | Remove a wishlist item | Customer bearer token |
| `GET` | `/cart` | Load customer cart | Customer bearer token |
| `PUT` | `/cart` | Replace customer cart | Customer bearer token |
| `DELETE` | `/cart` | Clear customer cart | Customer bearer token |
| `GET` | `/profile` | Load customer profile | Customer bearer token |
| `PUT` | `/profile` | Update customer profile | Customer bearer token |
| `GET` | `/upload` | Request a presigned S3 upload URL | Admin bearer token |
| `POST` | `/purchase` | Create an order from the authenticated cart | Customer bearer token |
| `GET` | `/purchase` | List customer orders | Admin bearer token |
| `POST` | `/contact` | Submit a customer message | API dependent |
| `GET` | `/contact` | List customer messages | Admin bearer token |
| `POST` | `/newsletter/subscribe` | Subscribe an email address | API dependent |

## Available Scripts

```bash
npm run dev
```

Starts the Vite development server.

```bash
npm run build
```

Creates the optimized production build inside the `dist/` directory.

```bash
npm run preview
```

Runs a local preview of the production build.

```bash
npm run lint
```

Runs ESLint to check the project code.

## Cognito Configuration

Configure the Cognito App Client with:

- Local callback URL: `http://localhost:5173/`
- Local sign-out URL: `http://localhost:5173/`
- Production callback URL: the CloudFront application URL
- Production sign-out URL: the CloudFront application URL
- OAuth scopes: `openid`, `email`, and `profile`
- Google as an identity provider when social sign-in is required
- A Cognito group named `admin` for administrator accounts

## AWS Deployment

The workflow located at:

```text
.github/workflows/deploy.yml
```

runs whenever code is pushed to the `main` branch.

Add the following repository secrets in GitHub:

| Secret | Purpose |
|---|---|
| `AWS_ACCESS_KEY_ID` | AWS credential used by the deployment workflow |
| `AWS_SECRET_ACCESS_KEY` | AWS credential used by the deployment workflow |
| `S3_BUCKET_NAME` | S3 bucket that hosts the frontend |
| `CLOUDFRONT_DISTRIBUTION_ID` | CloudFront distribution invalidated after deployment |

Deployment workflow:

```text
Checkout
   ↓
Install dependencies
   ↓
Build React application
   ↓
Configure AWS credentials
   ↓
Upload dist/ to Amazon S3
   ↓
Invalidate Amazon CloudFront cache
```

For production environments, prefer GitHub OpenID Connect with a restricted IAM role instead of long-lived AWS access keys.

## Security Notes

- Enforce authorization inside API Gateway and Lambda.
- Frontend route protection is not a security boundary.
- Validate the Cognito issuer, audience, client ID, token use, expiration, and administrator group.
- Keep S3 buckets private and serve frontend assets through CloudFront.
- Restrict presigned upload URLs by expiration, object prefix, file type, and maximum size.
- Configure CORS only for trusted local and production origins.
- Never commit `.env` files, AWS credentials, secrets, or private keys.
- Use a trusted payment provider for real transactions.
- Never process raw credit-card data directly inside this frontend.

## Recommended Repository Metadata

### Repository Name

```text
onsus-aws-serverless-ecommerce
```

### Repository Description

```text
A React electronics storefront and admin dashboard integrated with a serverless AWS architecture using Cognito, API Gateway, Lambda, DynamoDB, S3, and CloudFront.
```

### Suggested Topics

```text
aws
serverless
react
vite
ecommerce
aws-lambda
amazon-cognito
api-gateway
dynamodb
amazon-s3
cloudfront
github-actions
```

## Roadmap

- Add infrastructure-as-code using AWS CDK, SAM, or Terraform
- Move GitHub Actions authentication to AWS OIDC
- Add automated frontend and API integration tests
- Add a real payment provider
- Add order-status management
- Add dead-letter queues for failed asynchronous events
- Add CloudWatch dashboards and alarms
- Add structured Lambda logging
- Add AWS WAF managed rules and rate limiting

## License

No license is currently included.

Add a `LICENSE` file before publicly distributing the application or accepting external contributions.
