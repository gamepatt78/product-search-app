# Product Search

A small, responsive product discovery app inspired by the supplied demo. It fetches products from the public [DummyJSON Products API](https://dummyjson.com/docs/products), then lets you search, filter by category, sort results, and open product details.

The app loads the complete DummyJSON catalog except the vehicle and motorcycle categories, showing 24 items at a time. The catalog count reflects the available non-vehicle products and can change if the public API dataset changes. About and Contact sections are included; Contact links to this repository's issue tracker.

## Run locally

```powershell
npm ci
npm run dev
```

The app needs an internet connection to load product data and images. Product prices are displayed in USD to match the API.

## Build

```powershell
npm run build
```

## Deploy to Firebase Hosting

Build the app, then deploy the generated `dist` folder:

```powershell
npm run build
firebase.cmd deploy --only hosting
```

Firebase Hosting serves the frontend files; product records continue to load from DummyJSON, so a Firebase database is not required. To publish your own 1,000-item static catalog instead, add that catalog to the app and rebuild before deploying.
