# Acenra Mini Dashboard

A full-stack demo application with Firebase Authentication, MongoDB CRUD operations, and Tavily Search API integration.

## Features

- 🔐 Firebase Authentication (Email/Password)
- 📊 Device Management (CRUD operations)
- 🔍 External device lookup via Tavily Search API
- 🎨 Clean, responsive UI
- 🔒 Protected routes for authenticated users

## Tech Stack

**Backend:**
- Node.js + Express
- MongoDB (local) + Mongoose
- Tavily Search API integration
- CORS enabled

**Frontend:**
- React + Vite
- Firebase Web SDK v9
- React Router
- Axios

## Prerequisites

- Node.js (v16 or higher)
- npm
- MongoDB installed locally
- MongoDB Compass (for database management)
- Firebase project with email/password authentication enabled
- Tavily API key

## Setup Instructions

### 1. MongoDB Setup

1. Ensure MongoDB is running locally on `mongodb://localhost:27017/`
2. Open MongoDB Compass and connect to the local instance
3. The application will automatically create the `acenra_dashboard` database

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGO_URI_BASE=mongodb://localhost:27017/
DB_NAME=acenra_dashboard
TAVILY_API_KEY=tvly_your_key_here
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

The Firebase configuration is already included in `src/firebase.js`. No additional setup needed.

Start the frontend development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173` (Vite default)

## Usage

1. **Sign Up**: Create a new account using email and password
2. **Sign In**: Log in with your credentials
3. **Manage Devices**: 
   - View all devices in the dashboard
   - Add new devices with name, location, and status
   - Edit existing devices
   - Delete devices
4. **External Lookup**: Click on a device to view details and fetch external information via Tavily Search API

## API Endpoints

### Devices
- `GET /devices` - Get all devices
- `GET /devices/:id` - Get device by ID
- `POST /devices` - Create new device
- `PUT /devices/:id` - Update device
- `DELETE /devices/:id` - Delete device
- `GET /devices/:id/external` - Fetch external information via Tavily

## Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI_BASE` - MongoDB connection base URL
- `DB_NAME` - Database name
- `TAVILY_API_KEY` - Your Tavily API key

## Development

- Backend uses `nodemon` for hot reload during development
- Frontend uses Vite's fast HMR (Hot Module Replacement)
- MongoDB Compass can be used to view and manage the database directly

## Project Structure

See project structure in the generated files.

## Security Notes

- Firebase API keys in frontend are safe to expose (they're public identifiers)
- Tavily API key is kept server-side only
- Implement Firebase ID token verification on backend for production
- Consider adding rate limiting and input sanitization for production use

## License

MIT