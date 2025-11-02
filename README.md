<h1 align="center">Artisan Ally: An AI-Powered Empowerment Platform</h1>

<p align="center">
  <strong>An all-in-one platform to empower local artisans by enhancing their digital presence, providing financial tools, connecting them with volunteers, and protecting their craft's intellectual property.</strong>
</p>

<p align="center">
  <img alt="License" src="https://img.shields.io/badge/license-MIT-blue.svg"/>
  <img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white"/>
  <img alt="Firebase" src="https://img.shields.io/badge/Firebase-10-FFCA28?logo=firebase&logoColor=black"/>
  <img alt="Gemini API" src="https://img.shields.io/badge/Gemini_API-v1-4285F4?logo=google&logoColor=white"/>
</p>

<p align="center">
  <a href="#-the-vision">The Vision</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-technology-stack--architecture">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-future-roadmap">Future Roadmap</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 🌟 The Vision

Artisan Ally is more than just a marketplace; it's a complete digital ecosystem designed to bridge the gap between traditional craftsmanship and the global digital economy. We recognize that local artisans possess immense talent and cultural heritage but often face significant barriers: limited market access, a lack of digital marketing skills, financial constraints, and the risk of intellectual property theft.

Our mission is to dismantle these barriers. By leveraging the power of Google's Gemini AI, Artisan Ally provides a suite of intelligent tools that act as a personal co-pilot for artisans, simplifying every step from product photography to global sales. Simultaneously, we cultivate a vibrant community by connecting these artisans with skilled volunteers and conscious consumers, fostering a collaborative environment where craft, culture, and opportunity converge.

## ✨ Key Features

The platform is built around a multi-role architecture, providing tailored, empowering experiences for Artisans, Volunteers, and Customers.

### For Artisans 🎨
The Artisan Dashboard is a powerful control center designed to automate complexities and amplify creativity.

-   **🤖 AI Market Assistant**: Generate compelling product names, descriptions, and categories in multiple languages from a simple photo or voice note.
    -   *Tech: Gemini 2.5 Flash (Multimodal Input)*
-   **📸 AI Photo Studio**: Transform basic product photos into professional, e-commerce-ready images with AI-powered backgrounds and lighting adjustments.
    -   *Tech: Gemini 2.5 Flash Image*
-   **💹 AI Pricing Advisor**: Get data-driven price suggestions based on real-time web comparisons for similar products.
    -   *Tech: Gemini 2.5 Flash with Google Search Grounding*
-   **🎬 AI Video Ad Creator**: Automatically generate short, engaging promotional videos from a simple text story about a product or the artisan's journey.
    -   *Tech: Veo 3.1 Fast*
-   **🛡️ Digital Provenance**: Mint unique digital certificates of authenticity for each craft, protecting intellectual property and adding verifiable value for buyers.
-   **💰 Finance Hub**: Create and manage crowdfunding campaigns to raise funds for materials, equipment, or workshop expansion.
-   **🤝 Volunteer Hub**: Post projects (e.g., "need help with logo design") and connect with skilled volunteers who can help grow your business.
-   **💬 Direct-to-Customer**: Manage a personalized storefront, chat directly with customers, and handle bargain requests to foster relationships.

### For Volunteers 🤝
A purposeful platform for skilled individuals to create a tangible impact.

-   **📋 Project Marketplace**: Browse and apply for skill-based projects posted by artisans, such as photography, marketing, graphic design, and content writing.
-   **👤 Profile Showcase**: Highlight your skills, professional experience, and completed projects to connect with artisans seeking your expertise.
-   **📈 Impact Tracking**: See your contributions come to life and help artisans thrive in the digital marketplace.
-   **📜 Digital Certificates**: Receive verifiable certificates of contribution from artisans upon project completion, building a portfolio of social impact.

### For Customers 🛍️
A marketplace that connects you to the story behind the product.

-   **🛒 Curated Marketplace**: Discover and purchase unique, handcrafted items directly from talented artisans around the world.
-   **🧑‍🎨 Meet the Artisan**: Go beyond the product. Explore artisan profiles, read their personal stories, and watch videos about their craft.
-   **💸 Bargaining System**: Engage directly with artisans by making fair offers on products that support negotiation.
-   **🔮 AI Stylist**: Unsure how an item fits your home or style? Use generative AI to visualize a product in different aesthetic settings (e.g., Minimalist, Bohemian).
    -   *Tech: Gemini 2.5 Flash Image*
-   **✅ Verified Authenticity**: Shop with confidence by viewing the digital certificate of authenticity linked to each protected product.

## 👥 Target Audience

Artisan Ally is designed for three key groups who form our collaborative ecosystem:

1.  **Local & Traditional Artisans**: Craftsmen and women who are experts in their art form but may lack the resources or digital literacy to access a global market.
2.  **Skilled Volunteers**: Professionals and students in fields like design, marketing, photography, and business who want to use their skills for meaningful, high-impact social good.
3.  **Conscious Consumers**: Buyers who value authenticity, storytelling, and ethical sourcing, and wish to support small-scale creators and preserve cultural heritage.

## 🛠️ Technology Stack & Architecture

This project is built with a modern, scalable, and AI-first technology stack, chosen for its rapid development capabilities and powerful features.

| Category      | Technology                                                                                                    | Why We Chose It                                                                                                                                                                                                                                                                                       |
| :------------ | :------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend**  | [React](https://reactjs.org/) (v19) with [TypeScript](https://www.typescriptlang.org/) & [Tailwind CSS](https://tailwindcss.com/) | For building a fast, modern, and maintainable component-based UI. TypeScript ensures type safety and scalability, while Tailwind CSS allows for rapid, utility-first styling.                                                                                                   |
| **Backend**   | [Firebase](https://firebase.google.com/) (Firestore, Auth)                                                      | Provides a serverless, real-time NoSQL database (Firestore) perfect for features like live chat and notifications, along with a secure and easy-to-use authentication system. It allows us to focus on frontend features while Firebase handles backend complexity.               |
| **AI/ML**     | [Google Gemini API](https://ai.google.dev/gemini-api)                                                         | The core of our intelligent features. We use a suite of Gemini models for their powerful multimodal capabilities, including text generation, image understanding, image editing, video generation, and grounded generation with Google Search for real-time data. |
| **State**     | React Context API                                                                                             | For centralized and simplified global state management (`AppContext.tsx`), providing a single source of truth for user data, application state, and core functionalities, eliminating prop-drilling and enhancing code readability.                                         |

## 🚀 Future Roadmap

We are just getting started! Our roadmap includes integrating more advanced technologies to further empower our users:

-   **🗣️ Real-Time Voice Negotiation**: Integrate **Gemini Live API** to enable real-time, voice-to-voice chat and bargaining between customers and artisans, with instant translation capabilities.
-   **🧠 Personalized Recommendation Engine**: Implement a recommendation system using embeddings or advanced AI to suggest products to customers, and potential volunteer-artisan pairings based on skills and needs.
-   **🌐 Advanced Web3 Integration**: Move beyond simple digital certificates to a fully decentralized system using NFTs on an eco-friendly blockchain to give artisans true ownership and royalty rights on secondary sales.
-   **📈 Artisan Analytics Dashboard**: Provide artisans with an AI-powered analytics dashboard that offers insights into sales trends, customer demographics, and marketing effectiveness, with actionable suggestions for growth.
-   **📦 AI-Powered Logistics**: Integrate AI to help artisans calculate shipping costs, find the most efficient carriers, and generate shipping labels, simplifying a major operational hurdle.

## ⚡ Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later recommended)
-   `npm` or `yarn` package manager

### Installation & Setup

1.  **Clone the Repository**
    ```sh
    git clone https://github.com/google/aistudio.git
    cd apps/demos/artisan-ally
    ```

2.  **Install Dependencies**
    ```sh
    npm install
    ```

3.  **Set up Firebase**
    -   Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    -   In your project dashboard, go to **Build > Firestore Database**, create a database, and select a location.
    -   Inside Firestore, create a new database with the ID `ananyaa`.
    -   Go to **Build > Authentication**, click "Get started", and enable the **Email/Password** and **Google** sign-in providers.
    -   Navigate to **Project Settings** (click the gear icon ⚙️) > **General** tab.
    -   Under "Your apps", create a new Web App.
    -   Copy the `firebaseConfig` object and paste it into `src/firebaseConfig.ts`.

4.  **Set up Google Gemini API Key**
    -   Obtain an API key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    -   Create a new file named `.env` in the root of the project (`/artisan-ally`).
    -   Add your API key to the `.env` file:
        ```env
        API_KEY=YOUR_GEMINI_API_KEY
        ```
    > **Important**: For video generation features (`Veo`), the Google Cloud project associated with your API key must have **Billing enabled** and the **Vertex AI API** enabled.

5.  **Run the Development Server**
    This project is designed to run in development environments like AI Studio. If you're using a standard local setup with Vite or Create React App, you would run:
    ```sh
    npm start
    ```

The application should now be running on your local server!

## 📁 Project Structure

The codebase is organized into a modular structure to maintain clarity and scalability. Key directories include:

-   `src/components`: Contains reusable UI components, organized by `common`, `customer`, and `layout`.
-   `src/contexts/AppContext.tsx`: The heart of the application, providing global state management.
-   `src/pages`: Contains all top-level page components, organized by user role where necessary.
-   `src/services/geminiService.ts`: A dedicated service layer that abstracts all interactions with the Google Gemini API.
-   `src/lib/translations.ts`: Centralized localization strings for multi-language support.

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

Please read our `CONTRIBUTING.md` for details on our code of conduct and the process for submitting pull requests.

## 📄 License

This project is licensed under the MIT License. See the `LICENSE` file for more information.
