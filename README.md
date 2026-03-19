# Weather Forecaster

Wind Forecast Monitoring is a full-stack analytics dashboard that compares predicted wind power with actual wind generation, helping users quickly understand forecast performance.

## Production Links
- Frontend: https://weather-forecaster-orcin.vercel.app/
- Backend API: https://weather-forecaster-sogc.onrender.com
- Backend Health Check: https://weather-forecaster-sogc.onrender.com/health

## Features
- Interactive forecast vs actual chart
- Prediction error trend chart
- Filter bar with quick ranges, custom dates, and forecast delay
- Plain-language quick summary for non-technical users
- Insight cards and advanced horizon analysis
- Sortable, paginated raw data table with CSV export

## Tech Stack
- Frontend: React, TypeScript, Vite, Tailwind CSS, Recharts, React Query
- Backend: Node.js, Express, Axios

## Project Structure
- `frontend/`: Dashboard UI and client-side logic
- `backend/`: API server and data processing services
- `WindForecastAnalysis.ipynb`: Exploratory analysis notebook

## Local Development
1. Start backend:

```bash
cd backend
npm install
npm start
```

2. Start frontend:

```bash
cd frontend
npm install
npm run dev
```

3. Open:
- `http://localhost:5173`

## Deployment Notes
- Deploy backend first and copy its base URL.
- Set `VITE_API_BASE_URL` in frontend deployment to point to backend.
- Deploy frontend after environment configuration.
