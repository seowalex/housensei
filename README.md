# 2021-final-project-2021-final-group-01
2021-final-project-2021-final-group-1 created by GitHub Classroom

## Development

This repository is a monorepo containing both the frontend and the backend in their respective folders.

### Requirements

* Node.js (tested on v14.17.6)
* PostgreSQL (tested on v13.4)

The following step is common for both the `frontend` and `backend` folder.

1. Install all dependencies and setup the pre-commit hooks:

```bash
npm install
``` 

### Backend

1. Populate the `.env` file (following the `.env.example` file) with the generated VAPID keys. If the default user (`postgres`) and password (`postgres`) does exist, edit the variables in the `.env` file as well.

2. Create the database:

```bash
npm run db:create
```

2. [Optional] Seed the database:

```bash
npm run db:seed
```

4. Start the development server:

```bash
npm run dev
```

