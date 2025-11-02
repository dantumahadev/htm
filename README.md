
# Artisan Ally: An AI-Powered Empowerment Platform

<p align="center">
  <img src="https://raw.githubusercontent.com/google/aistudio/main/apps/demos/artisan-ally/artisan-ally-logo.png" alt="Artisan Ally Logo" width="120">
</p>

<p align="center">
  <strong>An all-in-one platform to empower local artisans by enhancing their digital presence, providing financial tools, connecting them with volunteers, and protecting their craft's intellectual property.</strong>
</p>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#technology-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#license">License</a>
</p>

---

## 🌟 About The Project

Artisan Ally is more than just a marketplace; it's a complete ecosystem designed to bridge the gap between traditional craftsmanship and the digital world. The platform addresses the core challenges faced by local artisans, such as limited market access, lack of digital skills, financial constraints, and the need to preserve cultural heritage.

By leveraging the power of Google's Gemini AI, Artisan Ally provides a suite of intelligent tools that act as a co-pilot for artisans, helping them create, market, and sell their products globally. Simultaneously, it creates a vibrant community by connecting artisans with skilled volunteers and conscious consumers, fostering a collaborative environment where craft meets opportunity.

## ✨ Key Features

The platform is built around a multi-role architecture, providing tailored experiences for Artisans, Volunteers, and Customers.

### For Artisans 🎨
- **AI Market Assistant**: Generate compelling product names, descriptions, and categories from a simple photo or voice note. Includes multi-language support.
- **AI Photo Studio**: Transform basic product photos into professional, e-commerce-ready images with AI-powered backgrounds and lighting adjustments.
- **AI Pricing Advisor**: Get data-driven price suggestions based on real-time web comparisons using Google Search grounding.
- **AI Video Ad Creator**: Automatically generate short, engaging promotional videos for products from a simple text story, powered by the Veo model.
- **Digital Provenance**: Mint digital certificates of authenticity for each craft, protecting intellectual property and adding value for buyers.
- **Finance Hub**: Create and manage crowdfunding campaigns to raise funds for materials, equipment, or workshop expansion.
- **Volunteer Hub**: Post projects (e.g., "need help with logo design") and connect with skilled volunteers who can help grow your business.
- **Direct-to-Customer**: Manage your own storefront, chat directly with customers, and handle bargain requests.

### For Volunteers 🤝
- **Project Marketplace**: Browse and apply for skill-based projects posted by artisans, such as photography, marketing, graphic design, and content writing.
- **Profile Showcase**: Highlight your skills, motivation, and completed projects to connect with artisans.
- **Collaboration Tools**: Communicate with artisans via built-in chat and manage project progress.
- **Digital Certificates**: Receive verifiable certificates of contribution from artisans upon project completion, building your portfolio and impact history.

### For Customers 🛍️
- **Curated Marketplace**: Discover and purchase unique, handcrafted items directly from artisans.
- **Meet the Artisan**: Explore artisan profiles, read their stories, and watch videos about their craft to connect with the products on a deeper level.
- **Bargaining System**: Engage directly with artisans by making offers on products that support negotiation.
- **AI Stylist**: Visualize how a product might look in different aesthetic settings (e.g., Minimalist, Bohemian) using generative AI.
- **Verified Authenticity**: Shop with confidence by viewing the digital certificate of authenticity linked to a product.
- **Multi-Role Experience**: Easily switch views to see the platform as an artisan or volunteer.

## 🛠️ Technology Stack

This project is built with a modern, scalable, and AI-first technology stack.

- **Frontend**: [React](https://reactjs.org/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/)
- **Backend & Database**: [Firebase](https://firebase.google.com/) (Firestore, Authentication)
- **AI & Machine Learning**: [Google Gemini API](https://ai.google.dev/gemini-api)
  - `gemini-2.5-flash` for text generation, transcription, and multi-modal analysis.
  - `gemini-2.5-flash-image` for AI-powered image editing (Photo Studio & AI Stylist).
  - `veo-3.1-fast-generate-preview` for text-to-video ad generation.
  - Google Search grounding for real-time data retrieval (Price Advisor).
- **State Management**: React Context API

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)
- `npm` or `yarn` package manager

### Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/your-username/artisan-ally.git
    cd artisan-ally
    ```

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Set up Firebase**
    - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    - In your project, go to the **Firestore Database** section, create a database, and select a location.
    - Inside Firestore, create a new database with the ID `ananyaa`.
    - Go to the **Authentication** section, click the "Get started" button, and enable the **Email/Password** and **Google** sign-in providers.
    - Navigate to your Project Settings (click the gear icon ⚙️) and under the "General" tab, find your "SDK setup and configuration".
    - Copy the `firebaseConfig` object and paste it into `src/firebaseConfig.ts`.

4.  **Set up Google Gemini API Key**
    - Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    - Create a new file named `.env` in the root of the project.
    - Add your API key to the `.env` file:
      ```env
      API_KEY=YOUR_GEMINI_API_KEY
      ```
    > **Note**: For video generation features, ensure that the Google Cloud project associated with your API key has **Billing enabled** and the **Vertex AI API** is enabled.

5.  **Run the Development Server**
    The project is configured to run directly in a compatible development environment like AI Studio. If you are setting it up locally with a standard React toolchain (like Vite or Create React App), you would typically run:
    ```sh
    npm start
    ```

The application should now be running on your local server!

## 📁 Project Structure

The codebase is organized into a modular structure to maintain clarity and scalability.

```
/
├── public/
├── src/
│   ├── components/
│   │   ├── common/         # Reusable UI components (Button, Card, etc.)
│   │   ├── customer/       # Components specific to the customer view
│   │   └── layout/         # Main layout components (Header, Sidebar)
│   ├── contexts/
│   │   └── AppContext.tsx  # Global state management for the entire app
│   ├── hooks/
│   │   └── useLocalization.tsx # Hook for multi-language support
│   ├── lib/
│   │   ├── initialData.ts  # Sample data for fallback and seeding
│   │   └── translations.ts # All localization strings
│   ├── pages/
│   │   ├── customer/       # Pages for the customer-facing app
│   │   ├── ArtisanProfilePage.tsx
│   │   ├── ChatPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── FinancePage.tsx
│   │   ├── LandingPage.tsx
│   │   ├── LoginPage.tsx
│   │   ├── MarketplacePage.tsx # The AI Market Assistant page for artisans
│   │   ├── NftPage.tsx         # Digital Provenance/Certificate minting
│   │   ├── PhotoStudioPage.tsx
│   │   ├── ... (and all other top-level pages)
│   ├── services/
│   │   └── geminiService.ts # Centralized functions for all Gemini API calls
│   ├── styles/
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   ├── App.tsx             # Main app component with routing logic
│   ├── firebaseConfig.ts   # Firebase initialization
│   └── index.tsx           # Application entry point
├── .env                    # Environment variables (local)
└── README.md
```

## 🏛️ Architectural Concepts

### Global State Management
The application relies heavily on the **React Context API** for global state management. `AppContext.tsx` is the heart of the application, providing a centralized store for:
- User authentication and profile data (`currentUser`).
- All major data collections (products, projects, users).
- UI state (active page, selected product/user).
- Core functionalities (chat, bargaining, connections, etc.).

This approach avoids prop-drilling and keeps the component logic clean and focused on presentation.

### Service Layer
All interactions with the Google Gemini API are abstracted into a dedicated service layer in `src/services/geminiService.ts`. This design pattern offers several advantages:
- **Separation of Concerns**: Components are not directly responsible for making API calls.
- **Reusability**: API functions can be easily reused across different parts of the application.
- **Maintainability**: If the API changes, updates only need to be made in one place.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
