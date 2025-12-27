# Welcome to React Router!

[![Deployed with Alchemy](https://alchemy.run/alchemy-badge.svg)](https://alchemy.run)

A modern, production-ready template for building full-stack React applications using React Router.

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Previewing the Production Build

Preview the production build locally:

```bash
npm run preview
```

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

Deployment is done using the Wrangler CLI.

To build and deploy directly to production:

```sh
npm run deploy
```

To deploy a preview URL:

```sh
npx wrangler versions upload
```

You can then promote a version to production after verification or roll it out progressively.

```sh
npx wrangler versions deploy
```

## CI

```bash
ALCHEMY_PASSWORD=your-encryption-password
ALCHEMY_STATE_TOKEN=your-state-token
CLOUDFLARE_API_TOKEN=your-cloudflare-api-token
CLOUDFLARE_EMAIL=your-cloudflare-email
```

in Settings -> Secrets -> Actions -> New repository secret.

Now add 'production' and 'staging' environments in github as well, by going to Settings -> Environments -> New environment. Add secrets there. You will no longer manage secrets in the workers dashboard, it will all be consolidated here.

all preview environments (PRs) will use the staging environment variable.

Now add the newly added secrets to the github actions workflow under `env`.

PUBLIC_ secrets are meant to be public, so you can just hardcode them in alchemy.run.ts

# Add Secrets

Secrets will no longer be managed in the workers dashboard, it will all be consolidated here.

- Add a secret to `.env`
- Add a the secret with a placeholder value in `.env.example`
- Add the newly added secret under `ReactRouter`s `bindings` in `alchemy.run.ts`. If its a secret, use `alchemy.secret(process.env.SECRET)`. If its a public value, use `process.env.PUBLIC_VALUE` with a default value.
- Add the newly added secret under `deploy.yml` under `env`.
- Lastly, add the newly added secret to both `staging` and `production` environments in github.

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
