# Calorie & BMR Tracker

A responsive web application to calculate and track your Basal Metabolic
Rate (BMR), daily calorie goals, and log meals.\
Built with React, TypeScript, Firebase, and Vite.

## Live Demo

You can try the live version of the app here:\
<https://calorie-bmr-tracker.netlify.app>

## Features

-   User authentication (Firebase)
-   Profile setup with weight, height, age, gender, and activity level
-   Automatic BMR and TDEE calculation
-   Customizable daily calorie goal
-   Meal logging with calories and timestamps
-   Daily summary with progress tracking
-   Responsive design for mobile and desktop
-   Toast notifications for actions
-   Loading spinners and modal feedback

## Tech Stack

-   **React + TypeScript** -- Frontend framework and typing
-   **Vite** -- Build tool for fast development
-   **Firebase** -- Authentication and Firestore database
-   **CSS** -- Custom styling with responsive breakpoints

## Installation

1.  Clone the repository:

    ``` bash
    git clone https://github.com/logandeveloper1000/calorie-bmr-tracker.git
    cd calorie-bmr-tracker
    ```

2.  Install dependencies:

    ``` bash
    npm install
    ```

3.  Create a `.env` file in the root directory and configure your
    Firebase credentials:

    ``` env
    VITE_API_KEY=your_firebase_api_key
    VITE_AUTH_DOMAIN=your_firebase_auth_domain
    VITE_PROJECT_ID=your_firebase_project_id
    VITE_STORAGE_BUCKET=your_firebase_storage_bucket
    VITE_MESSAGING_SENDER_ID=your_firebase_sender_id
    VITE_APP_ID=your_firebase_app_id
    ```

4.  Start the development server:

    ``` bash
    npm run dev
    ```

5.  Open the app in your browser at `http://localhost:5173`.

## Deployment

This project is deployed with **Netlify**.\
To deploy your own version: - Push your repository to GitHub - Connect
it with Netlify - Add your environment variables in the Netlify
dashboard

The live version is available here:\
<https://calorie-bmr-tracker.netlify.app>

## License

This project is licensed under the MIT License.
