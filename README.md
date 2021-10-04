# Housensei

## Development

This repository is a monorepo containing both the frontend and the backend in their respective folders.

### Requirements

- Node.js (tested on v14.18.0)
- PostgreSQL (tested on v14.0)

The following step is common for both the `frontend` and `backend` folder.

1. Install all dependencies and setup the pre-commit hooks:

```bash
npm install
```

### Backend

1. (Optional) Populate the `.env` file (following the `.env.example` file) if the default user (`postgres`) and password (`postgres`) does exist.

2. Create and seed the database:
Import BTO excel file to file path src/database/data/HDB-BTO-Prices-List.xls

```bash
npm run db:create
```

and

```bash
npm run db:seed src/database/data/HDB-BTO-Prices-List.xls
```

3. Start the development server:

```bash
npm run dev
```

4. [In Long Term] To clear and import new data into BTO table
Specify file path to excel file in command line arguments
```bash
npm run db:seed-bto src/database/data/HDB-BTO-Prices-List.xls
```

### Frontend

1. Start the development server:

```bash
npm run dev
```

### Production

You may also choose to run the app in production mode.

1. Build the frontend and backend:

```bash
cd frontend
npm run build
cd ../backend
npm run build
```

2. Inside the `backend` folder, start the production server:

```bash
npm start
```
