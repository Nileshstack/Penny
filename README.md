# PennyPilot

PennyPilot is a MERN expense tracker with registration, login, transaction history, filtering, and analytics. The React application is deployed separately from the Express API; MongoDB Atlas stores user and transaction records.

## Requirements

- Node.js 22.x and npm
- A MongoDB Atlas database, or another reachable MongoDB deployment
- Git and a GitHub repository for deployment

## Local setup

1. Clone the repository and install both dependency sets:

   ```powershell
   git clone <your-github-repository-url>
   cd PennyPilot
   npm install
   npm --prefix client install
   ```

2. Copy `.env.example` to `.env`. Set `MONGO_URL` to your database connection string and replace `JWT_KEY` with a random secret of at least 32 characters. Keep `.env` private and out of Git.

   ```powershell
   Copy-Item .env.example .env
   ```
3. In one terminal, start the API from the repository root:

   ```powershell
   npm start
   ```

4. In another terminal, start the frontend:

   ```powershell
   cd client
   npm start
   ```

   The checked-in `client/.env.development` points the frontend to `http://localhost:8080/api`. Alternatively, run `npm run dev` from the repository root to start both services.

The API listens on `0.0.0.0` using `PORT` (default `8080`). The database connection is awaited before it begins listening. `GET /api/health` returns database readiness without exposing connection details.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `PORT` | No | API listener port; defaults to `8080` (Render sets this automatically). |
| `NODE_ENV` | No | Set to `production` on the deployed API. |
| `MONGO_URL` | Yes | MongoDB connection URI; never expose it to the frontend. |
| `JWT_KEY` | Yes | Private JWT signing secret; use at least 32 random characters in production. |
| `CLIENT_ORIGINS` | Production | Comma-separated exact browser origins allowed by API CORS, without trailing slashes. |
| `REACT_APP_API_URL` | Production frontend | Public API base URL, for example `https://<render-service>.onrender.com/api`. CRA embeds this value in the frontend build; it must not contain secrets. |

Generate a secret locally with Node:

```powershell
node -e "console.log(require('crypto').randomBytes(48).toString('base64url'))"
```

The server accepts the existing `MONGO_URL` and `JWT_KEY` names. Legacy accounts with plaintext passwords are upgraded to bcrypt hashes after a successful login; new registrations are hashed immediately. Existing browser sessions must log in again to receive a signed token.

## Tests and production build

From the repository root, run backend checks:

```powershell
npm test
npm audit
```

Build and test the frontend from `client`:

```powershell
npm test -- --watchAll=false
npm run build
npm audit
```

The production frontend output is `client/build`. It is not served by the API server; deploy it as a separate static site.

The full frontend audit still reports advisories in the Create React App 5 build/test dependency tree. A compatible non-breaking `npm audit fix` cannot remove those advisories; `npm audit --omit=dev` reports zero vulnerabilities in the deployed frontend runtime dependency set. Review or replace the legacy build toolchain before treating the entire build pipeline as security-clean.

## Deploy the API to Render

1. Push the project to GitHub and create a Render **Web Service** connected to that repository.
2. Set the service root directory to the repository root, runtime to Node.js 22, build command to `npm ci`, and start command to `npm start`.
3. Set these Render environment variables:
   - `NODE_ENV=production`
   - `MONGO_URL` to the Atlas URI
   - `JWT_KEY` to a newly generated random secret (32+ characters)
   - `CLIENT_ORIGINS` to the exact Vercel production origin(s), comma-separated; for example `https://<your-project>.vercel.app,https://<your-custom-domain>`
4. Do not set a fixed `PORT`; Render supplies it. The service binds to `0.0.0.0`.
5. Verify `https://<your-render-service>.onrender.com/api/health` reports HTTP 200 and `"database":"connected"`.

## Deploy the frontend to Vercel

1. Import the GitHub repository as a Vercel project and set **Root Directory** to `client`.
2. Use the Create React App build command `npm run build` and output directory `build`. Vercel can install dependencies using the client lockfile.
3. Set the Vercel environment variable `REACT_APP_API_URL` to `https://<your-render-service>.onrender.com/api`.
4. Deploy or redeploy after setting the environment variable. CRA values are compiled into the static build; changing the value requires a new deployment.
5. Add the production and any preview/custom frontend origins to Render's `CLIENT_ORIGINS` as appropriate. Use exact `https://` origins, not API URLs or paths.

## Configure MongoDB Atlas

1. Create a database and a dedicated database user with only the privileges the app needs. Use a strong password.
2. Add the Render service's outbound IP addresses to Atlas **Network Access** when available. Render outbound addresses depend on the service/plan; use the documented ranges for your service.
3. If a stable outbound allowlist is not available, Atlas may require a broader network rule. Treat that as a security tradeoff: limit database-user privileges, use a unique strong password, and monitor/rotate credentials.
4. Copy the Atlas connection string into Render's `MONGO_URL`, replacing the sample username, password, cluster, and database. URL-encode reserved characters in credentials.
5. Never put `MONGO_URL`, Atlas credentials, or `JWT_KEY` in Vercel variables prefixed with `REACT_APP_`, source code, or this README.

## Post-deployment smoke checks

- `GET /api/health` returns 200 with a connected database.
- Register a test user, log in, and confirm the response contains a token but no password.
- Confirm refresh keeps the authenticated dashboard available; log out and confirm the dashboard redirects to login.
- Add, view, edit, and delete a test transaction; check filters and analytics.
- Confirm a request without a bearer token is rejected and a second account cannot view, edit, or delete the first account's transactions.
- Confirm the browser can call the API from the configured Vercel origin and an unrelated origin is rejected.
- Check Render logs for startup/database errors and Vercel build logs for the embedded API URL.

## Troubleshooting

- **API does not start:** check that `MONGO_URL` and `JWT_KEY` are set in the backend environment and that Atlas accepts the Render network connection.
- **Health endpoint reports 503:** the API is alive but MongoDB is not connected; check the Atlas URI, database user, allowlist, and Render logs.
- **Frontend reports network/CORS errors:** check `REACT_APP_API_URL` ends with `/api`, redeploy Vercel after changing it, and add the exact frontend origin to `CLIENT_ORIGINS`.
- **Vercel calls a stale API:** environment variables are embedded at build time; trigger a new deployment.
- **Authentication fails after deployment:** verify `JWT_KEY` is consistently configured on the backend. Changing it invalidates existing tokens; users must log in again.
- **MongoDB URI authentication fails:** URL-encode reserved characters in the database username/password and confirm the target database name.
