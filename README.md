# ChiVogue

ChiVogue is a restaurant directory with a Vue/Vite frontend, an Express API, and MongoDB Atlas. It has four routed pages: Home, Search Restaurant, Best Quality, and About Us. Search and Best Quality load live records from the API; restaurant creation, editing, and deletion also require the API and database.

## Deployment (recommended: Vercel full-stack)

Deploy from the **repository root** so Vercel can build `frontend/` and run `backend/server.js` together. The root `vercel.json` routes `/api/*` to the Express server and sends page routes such as `/search`, `/best`, and `/about` to the Vue SPA.

Before production deployment, configure the MongoDB Atlas connection string as a Vercel **Production** environment variable. Do not rely on `backend/.env` in production; local `.env` files are not deployed and must not be committed.

```sh
# Run from the repository root; first-time setup only
npx vercel login
npx vercel link
npx vercel env add MONGO_URI production
```

When prompted, paste the Atlas connection string into the CLI prompt (not into source code or chat). The app accepts either `MONGO_URI` or `MONGODB_URI`. `MONGODB_DB` is optional and defaults to `chivogue`.

Then deploy:

```sh
npx vercel --prod
```

If the project was previously connected to Netlify, that configuration (`netlify.toml`) builds only the static frontend and does **not** deploy the Express API. Use the Vercel deployment above for a single-origin deployment of both the website and API, or separately host an API and point `VITE_API_BASE_URL` at that API's HTTPS origin.

After deploying, check these URLs on your deployed domain:

- `/api/health` should return HTTP 200 with JSON containing `"ok": true` and `"databaseConnected": true`.
- `/api/restaurants` should return JSON containing `items` and `total`.
- `/search`, `/best`, and `/about` should load directly and after refresh.

If `/api/health` reports `databaseConfigured: false`, add `MONGO_URI` to the Vercel Production environment and redeploy. If it reports `databaseConnected: false`, check the Atlas database user's permissions and Atlas Network Access for the deployment's outbound connections.

Do not set `VITE_API_BASE_URL` to `localhost` in production. Leave it unset for the same-origin Vercel deployment.

## Data and API

- `/api/restaurants` supports search, cuisine/borough filters, sorting, and pagination.
- `/api/restaurants/best` ranks restaurants by rating.
- `/api/restaurants/summary/cuisines` and `/api/restaurants/summary/boroughs` provide filter and summary data.
- Restaurant records are stored in the MongoDB `chivogue.restaurants` collection.
- Photos added from Search Restaurant are stored as data URLs in the restaurant record; use appropriately sized images.

### Import the professor's JSON into Atlas

The JSON file is a one-time import source; the running site reads and writes MongoDB Atlas. Set `MONGO_URI` or `MONGODB_URI` in `backend/.env` for local seeding, allow your local IP in Atlas Network Access, and run this from the `backend` folder:

```sh
node seed.js "/path/to/professor-restaurants.json"
```

The import script stops without changing an already populated collection. Only use `--replace` when you explicitly intend to replace the collection:

```sh
node seed.js "/path/to/professor-restaurants.json" --replace
```

Imported records without a restaurant star rating remain unrated; the app does not invent ratings.

## Run locally

Set `MONGO_URI` in `backend/.env`, then start the backend and frontend in separate terminals:

```sh
cd backend
npm install
npm start
```

```sh
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the frontend terminal (usually `http://localhost:8080`). Vite proxies `/api` calls to the backend on port 5000.

Before redeploying, verify the source and production build:

```sh
npm --prefix backend test
npm --prefix frontend ci
npm --prefix frontend run build
```

Do not commit the Atlas connection string. Back up the Atlas collection before replacing it.
"# ChiVogue" 
