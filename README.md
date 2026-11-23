# prepPilot.AI

PrepPilot.AI helps job candidates practice with questions tailored to a target role, experience level, and topics. Users can review answers and explanations, save sessions, and pin questions to revisit.

The frontend uses React and Tailwind CSS. The backend uses Express, MongoDB, JWT authentication, and Gemini.

## Run locally

1. Copy `backend/.env.example` to `backend/.env`. Set `MONGO_URI` and a private `JWT_SECRET`. Set `GEMINI_API_KEY` to enable question generation and explanations. The default model is `gemini-2.5-flash`. Set `GEMINI_MODEL` to switch models.
2. In `backend`, run `npm ci` and `npm start`.
3. In `frontend`, run `npm ci` and `npm run dev`. Open `http://localhost:5173`.

Vite forwards API calls to port 5000 by default. Set `VITE_BASE_URL` before building the frontend to point to a different backend.

## Render and Vercel

Use `backend` as the Render root directory, `npm ci` as the build command and `npm start` as the start command. Use `/health` as the health-check path. It returns HTTP 200 when MongoDB and authentication are ready, or 503 while unavailable. Set `PRODUCTION_URL` to your Vercel site's origin.

Set `GEMINI_API_KEY` in the Render backend environment and redeploy the backend to rotate the key. For a backend hosted on Vercel, set the variable in that backend project.

Use `frontend` as the Vercel root directory and set `VITE_BASE_URL` to your Render service origin. Redeploy the frontend after changing it.
