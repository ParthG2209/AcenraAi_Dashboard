# Acenra Mini Dashboard

A simple full-stack app I built for managing devices. Has Firebase login, MongoDB for storing stuff, and uses Tavily API to search for device info online.

## Demo

![Demo](demo.gif)

## What it does

- Login/signup with Firebase
- Add, edit, delete devices
- Look up device info from the web (Tavily API)
- Basic dashboard UI

## Stack

Backend:
- Node + Express
- MongoDB (running locally)
- Tavily for external searches

Frontend:
- React with Vite
- Firebase auth
- React Router

## Getting started

You'll need:
- Node (v16+)
- MongoDB running locally
- MongoDB Compass (optional but helpful)
- Firebase project with email/password enabled
- Tavily API key

### MongoDB setup

Just make sure MongoDB is running on `mongodb://localhost:27017/`. The app creates the database automatically.

### Backend

```bash
cd backend
npm install
```

Make a `.env` file in backend folder:

```env
PORT=5000
MONGO_URI_BASE=mongodb://localhost:27017/
DB_NAME=acenra_dashboard
TAVILY_API_KEY=tvly_your_actual_key_here
```

Start it:

```bash
npm run dev
```

Backend runs on port 5000 (or whatever you set in .env)

### Frontend

```bash
cd frontend
npm install
```

Firebase config is already in the code (it's safe to expose these keys).

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Using it

1. Sign up with any email/password
2. Login
3. Add devices (name, location, online/offline)
4. Click on a device to see details
5. Use "Refresh External Info" to search for device info online

## API stuff

### Device endpoints
- `GET /devices` - get all devices
- `GET /devices/:id` - get one device
- `POST /devices` - create device
- `PUT /devices/:id` - update device
- `DELETE /devices/:id` - delete device
- `GET /devices/:id/external` - search Tavily for device info


## Notes

Firebase keys in the frontend are fine to expose. The Tavily key stays on the backend which is good.
