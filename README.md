# CST-438_Project2_Front_end


##  Overview
This project is the **front-end application** for a Job Tracking system. It provides a user interface that allows users to manage job applications, track progress, and interact with a backend API.

The application is built using modern JavaScript tools and communicates with a backend service that handles authentication, job entries, job applications, and notes.

---

## Team

Brandon Hernandez-Cano

Raphael Berjaoui

Rigoberto Rayon

Sungmin Park

---

## Tech Stack

- React

- React-Router-DOM

- Vite

- CSS

- Native Fetch


--- 

## Run locally

## Run locally

1. Clone the repository and open the frontend folder:

```powershell
cd CST-438_Project2_Front_end
```

2. Install dependencies:

```powershell
npm install
```

3. Create or update the `.env` file in the frontend root with the backend URL:

```env
VITE_API_URL=https://backend-project2-production.up.railway.app
VITE_FRONTEND_URL=http://localhost:3000
```

4. Start the frontend development server:

```powershell
npm run dev
```

5. Open the app locally:

- Frontend: `http://localhost:3000`


---

## Features

### Authentication
- OAuth-based login system
- User session handling
- Redirect handling

### Dashboard
- Displays user-specific data after login
- Entry point after authentication

### Job Entry Management
- Add new job entries
- View job entries
- Edit and update job details

### Job Applications
- Track applications tied to job entries
- Update application status

### Notes System
- Add and manage notes for job applications

### User Management (Admin UI)
- View users
- Manage user roles



## Purpose
The purpose of this project is to:

- Provide a clean and functional UI for managing job applications
- Demonstrate front-end development skills using modern frameworks/tools
- Integrate with a backend REST API
- Support user authentication (OAuth)
- Allow users to track, update, and organize job-related data efficiently

---

## Features

### Authentication
- OAuth-based login system
- User session handling
- Redirect handling

### Dashboard
- Displays user-specific data after login
- Entry point after authentication

### Job Entry Management
- Add new job entries
- View job entries
- Edit and update job details

### Job Applications
- Track applications tied to job entries
- Update application status

### Notes System
- Add and manage notes for job applications

### User Management (Admin UI)
- View users
- Manage user roles
