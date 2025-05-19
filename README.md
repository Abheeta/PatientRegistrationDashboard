# Patient Dashboard

Find the demo [here](https://patient-registration-dashboard-7ya2.vercel.app/)

A patient dashboard built with React, TypeScript making use of [PGLite](https://pglite.dev/docs/about), a WASM-based postgres build that can be run on a browser. This application provides an intuitive interface to manage and view patient-related data.

## Features

- Register patients in a database table running on your browser using PGLite.
- Persist the patients table in IndexedDb.
- Live sync between multiple tabs, e.g., writing from one tab will be immediately synced on another tab without the need for a refresh, or any user interaction.
- Check out all the patient details currently stored with an intuitive viewer
- Run raw SQL queries to make sense of your data.

## Getting Started

### Installation

Install dependencies:

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

### Linting

Check for lint issues:

```bash
npm run lint
```

### Production Build

Generate a production build:

```bash
npm run build
```

---
