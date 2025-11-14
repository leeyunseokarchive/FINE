# FINE App

This is a React Native application built with Expo.

## Getting Started

Follow these steps to set up and run the project locally.

### Prerequisites

Make sure you have Node.js and npm (or Yarn) installed. It's recommended to use a Node.js version supported by Expo.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd FINE
    ```
    (Replace `<repository-url>` with the actual URL of your repository.)

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Running the App

You can run the app on a web browser, Android, or iOS device/simulator.

1.  **Start the Expo development server:**
    ```bash
    npm start
    # or
    yarn start
    ```
    This will open a new tab in your browser with the Expo Dev Tools.

2.  **Run on a specific platform:**

    -   **Web:**
        ```bash
        npm run web
        # or
        yarn web
        ```

    -   **Android:**
        ```bash
        npm run android
        # or
        yarn android
        ```
        (Requires an Android emulator or a physical Android device connected and set up for development.)

    -   **iOS:**
        ```bash
        npm run ios
        # or
        yarn ios
        ```
        (Requires Xcode and an iOS simulator or a physical iOS device connected and set up for development.)

### Project Structure

-   `app/`: Contains the main application screens and navigation.
-   `components/`: Reusable UI components.
-   `assets/`: Static assets like images.
-   `constants/`: Application-wide constants.
-   `hooks/`: Custom React hooks.
-   `src/`: Source code for configuration, data, and stores.

---