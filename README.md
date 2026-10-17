# Product Search

A responsive product-discovery app built with React and Vite. Browse the [live app](https://product-search-app-929a5.web.app/) or visit the [GitHub repository](https://github.com/gamepatt78/product-search-app).

## Features

- Search products by name, description, brand, or category
- Filter by category and sort by price, name, or rating
- View product details, ratings, and availability
- Browse products from a public product catalog. Vehicle and motorcycle products are not included.
- Load results 24 at a time
- Responsive layout with an About section and interactive category browsing
- Loading, error, and no-results states

Product prices, reviews, and availability may differ from retailer listings and should be verified before purchase. Catalog content and images are retrieved over the internet and may change as the catalog is updated. Firebase Hosting serves the app; a Firebase database is not required.

## Requirements

- Node.js 20 or newer
- npm

## Run locally

From this folder, install dependencies and start the development server:

```powershell
npm ci
npm run dev
```

If PowerShell blocks the npm script, use the Windows command shim:

```powershell
npm.cmd ci
npm.cmd run dev
```

Vite prints the local URL in the terminal, usually `http://localhost:5173`.

## Build

Create a production build in `dist/`:

```powershell
npm run build
```

## Deploy to Firebase Hosting

The Firebase project configuration is included in this repository. Install the [Firebase CLI](https://firebase.google.com/docs/cli) and sign in first if you have not already done so. In PowerShell, the `.cmd` form avoids execution-policy errors:

```powershell
firebase.cmd login
npm.cmd run build
firebase.cmd deploy --only hosting
```

The public site is [product-search-app-929a5.web.app](https://product-search-app-929a5.web.app/). The `main` branch also has Firebase Hosting GitHub Actions workflows configured: pushes deploy to the live site, and pull requests get a preview deployment.
