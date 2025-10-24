# TalentQuest: The Gamified Tech Talent Ecosystem

Welcome to TalentQuest, a production-ready web application that redefines the career journey for tech talent in Tunisia and beyond. This project is a gamified ecosystem where students can build their digital identity, complete quests to level up their skills, and connect with recruiters in a dynamic, engaging way.

## Project Overview

TalentQuest is built on a modern, robust technology stack, featuring a React frontend and a custom Node.js backend. This project was migrated from a Backend-as-a-Service (BaaS) to a fully custom backend to ensure long-term stability and control.

### Key Features

*   **Gamified Onboarding:** A conversational AI, "Aria," guides users through a unique onboarding experience, extracting skills, traits, and career aspirations through a chat-based interface.
*   **Dynamic Job Board:** A minimalist, card-based job board that matches users with relevant opportunities based on their skills and preferences.
*   **Digital Identity:** A comprehensive user profile that showcases skills, achievements, traits, and career vision, all of which are built and enhanced through in-app activities.
*   **Skill Quests:** A planned feature where users can complete coding challenges and tutorials to earn XP, level up, and unlock new skills.

## Technology Stack

*   **Frontend:**
    *   React 18 with TypeScript
    *   Vite for a fast and modern development experience
    *   Tailwind CSS for a utility-first styling workflow
    *   Zustand for lightweight global state management
    *   React Router for client-side routing
    *   Axios for making HTTP requests to the backend
*   **Backend:**
    *   Node.js with Express.js for a robust and scalable API
    *   PostgreSQL for a powerful and reliable relational database
    *   JSON Web Tokens (JWT) for secure, stateless authentication
    *   `bcryptjs` for hashing user passwords

## Getting Started

Follow these instructions to set up and run the TalentQuest application in your local development environment.

### Prerequisites

*   Node.js (v18 or higher)
*   npm
*   A running PostgreSQL database instance

### 1. Clone the Repository

```bash
git clone https://github.com/eya226/talentquests.git
cd talentquests
```

### 2. Set Up the Backend

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Install backend dependencies:**
    ```bash
    npm install
    ```

3.  **Set up the database:**
    *   Connect to your PostgreSQL database.
    *   Run the SQL script in `backend/db/schema.sql` to create the `profiles` table.

4.  **Create the `.env` file:**
    *   Create a new file named `.env` in the `backend` directory.
    *   Add the following environment variables to the file:
        ```
        DATABASE_URL=postgresql://<user>:<password>@<host>:<port>/<database>
        JWT_SECRET=<your-long-random-jwt-secret>
        ```
    *   Replace the placeholders with your actual database connection string and a long, random string for your JWT secret.

5.  **Start the backend server:**
    ```bash
    node index.js
    ```
    The backend server will start on port 5000.

### 3. Set Up the Frontend

1.  **Navigate to the root directory:**
    ```bash
    cd ..
    ```

2.  **Install frontend dependencies:**
    ```bash
    npm install
    ```

3.  **Start the frontend development server:**
    ```bash
    npm run dev
    ```
    The frontend application will be available at `http://localhost:5173`.

### 4. Running the Application

Once both the backend and frontend servers are running, you can open your browser to `http://localhost:5173` to use the application. You will be able to sign up, log in, complete the onboarding process, and view your profile.
