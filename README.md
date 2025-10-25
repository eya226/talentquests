# TalentQuest: The Gamified Mobile App for Tech Talent

Welcome to the official repository for TalentQuest, a native mobile application for iOS and Android that transforms the career journey into a gamified adventure.

## Project Overview

TalentQuest is a full-stack application built with a React Native (Expo) frontend and a custom Node.js backend. It provides a unique, chat-based onboarding experience with an AI mentor, a dynamic job board, and a comprehensive digital identity profile for users.

### Core Technologies

*   **Mobile App (Frontend):**
    *   React Native (with Expo)
    *   JavaScript
    *   React Navigation for screen management
    *   Axios for API communication

*   **Server (Backend):**
    *   Node.js & Express.js
    *   PostgreSQL for the database
    *   JWT (JSON Web Tokens) for secure authentication

## How to Launch the Application

This guide will walk you through setting up and running the complete TalentQuest application, including the backend server and the mobile app.

---

### **Step 1: Set Up the PostgreSQL Database**

This project requires a PostgreSQL database. We recommend using a free, managed service like **Neon** or **Supabase**, as they are easy to set up and provide a connection string.

1.  **Create a Database:**
    *   Sign up for a free account at [neon.tech](https://neon.tech) or [supabase.com](https://supabase.com).
    *   Create a new project and a new PostgreSQL database.

2.  **Run the Schema Script:**
    *   In your database provider's dashboard, find the **SQL Editor**.
    *   Copy the entire content of the `backend/db/schema.sql` file from this project.
    *   Paste the SQL into the editor and **run the script**. This will create the necessary `profiles` table.

3.  **Get Your Connection String:**
    *   Navigate to your database settings and find the **connection string** (also called a connection URL). It will start with `postgresql://`.
    *   **Copy this string.** You will need it in the next step.

---

### **Step 2: Configure and Run the Backend Server**

The backend server connects to your database and provides the API for the mobile app.

1.  **Navigate to the Backend:**
    ```bash
    cd backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Create the `.env` File:**
    *   In the `backend` directory, create a new file named `.env`.
    *   Add the following two lines to this file:
        ```env
        DATABASE_URL="YOUR_DATABASE_CONNECTION_STRING"
        JWT_SECRET="YOUR_LONG_RANDOM_SECRET_STRING"
        ```
    *   Replace `"YOUR_DATABASE_CONNECTION_STRING"` with the actual connection string you copied from your database provider.
    *   Replace `"YOUR_LONG_RANDOM_SECRET_STRING"` with a long, random string you create (you can use a password generator for this).

4.  **Start the Server:**
    ```bash
    node index.js
    ```
    The server will start and should print `Server is running on port 5000`. Leave this terminal window running.

---

### **Step 3: Launch the Mobile App**

The mobile app is built with Expo and can be run on your physical device without any complex setup.

1.  **Install the Expo Go App:**
    *   On your personal iOS or Android phone, open the App Store or Google Play Store and install the **"Expo Go"** app.

2.  **Open a New Terminal:**
    *   Leave your backend server running. Open a **new** terminal window.

3.  **Navigate to the Project Root:**
    *   Make sure you are in the root directory of the `talentquests` project (not the `backend` directory).

4.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

5.  **Start the Expo Development Server:**
    ```bash
    npm start
    ```
    After a moment, a **QR code** will appear in your terminal.

6.  **Open the App on Your Phone:**
    *   Open the **Expo Go** app on your phone.
    *   Scan the QR code from your terminal.

The TalentQuest mobile app will now open on your phone, fully connected to your running backend. You can now create an account, log in, and use the application.
