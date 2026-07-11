<h1 align="center">Artisan Ally: An AI-Powered Empowerment Platform</h1>

<p align="center">
  <a href="#-the-vision">The Vision</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-technology-stack--architecture">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-future-roadmap">Future Roadmap</a> •
  <a href="#-app-gallery">App Gallery</a> •
  <a href="#-contributing">Contributing</a>
</p>

---

## 🌟 The Vision

Artisan Ally is more than just a marketplace; it's a complete digital ecosystem designed to bridge the gap between traditional craftsmanship and the global digital economy. We recognize that local artisans face unique barriers: limited access to online tools, intellectual property protection, and promotional resources.

Our mission is to dismantle these barriers. By leveraging the power of Google's Gemini AI, Artisan Ally provides a suite of intelligent tools that act as a personal co-pilot for artisans, simplifying complex tasks and amplifying their reach.

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

| Category      | Technology                                                                                                   | Why We Chose It                                                       |
| :------------ | :----------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| **Frontend**  | [React](https://reactjs.org/) (v19) with [TypeScript](https://www.typescriptlang.org/) & [Tailwind CSS](https://tailwindcss.com/) | For building a fast, modern, and maintainable component-based UI       |
| **Backend**   | [Firebase](https://firebase.google.com/) (Firestore, Auth)                                                     | Provides a serverless, real-time NoSQL database (Firestore) perfect for dynamic, scalable apps |
| **AI/ML**     | [Google Gemini API](https://ai.google.dev/gemini-api)                                                        | The core of our intelligent features. We use a suite of Gemini models for multimodal input/output |
| **State**     | React Context API                                                                                            | For centralized and simplified global state management (`AppContext.tsx`) |

## 🚀 Future Roadmap

We are just getting started! Our roadmap includes integrating more advanced technologies to further empower our users:

-   **🗣️ Real-Time Voice Negotiation**: Integrate **Gemini Live API** to enable real-time, voice-to-voice chat and bargaining between customers and artisans, with instant translation capabilities.
-   **🧠 Personalized Recommendation Engine**: Implement a recommendation system using embeddings or advanced AI to suggest products to customers, and potential volunteer-artisan pairings based on skills/interests.
-   **🌐 Advanced Web3 Integration**: Move beyond simple digital certificates to a fully decentralized system using NFTs on an eco-friendly blockchain to give artisans true ownership and royalty rights.
-   **📈 Artisan Analytics Dashboard**: Provide artisans with an AI-powered analytics dashboard that offers insights into sales trends, customer demographics, and marketing effectiveness, with actionable guidance.
-   **📦 AI-Powered Logistics**: Integrate AI to help artisans calculate shipping costs, find the most efficient carriers, and generate shipping labels, simplifying a major operational hurdle.

---

## 🖼️ App Gallery

Below are screenshots from the live application, showcasing key features and user interfaces. For a full experience, visit the [deployed website](https://final-artisan-ally-97173971420.us-west1.run.app).

<div align="center">

<img src="https://github.com/Hassan010103/ArtisanAlly-Upgraded/raw/main/images/aa_landingPage.jpg" alt="Landing Page" width="330" style="margin:8px;" />
<img src="https://github.com/Hassan010103/ArtisanAlly-Upgraded/raw/main/images/Artisan_Dashboard.jpg" alt="Artisan Dashboard" width="330" style="margin:8px;" />
<img src="https://github.com/Hassan010103/ArtisanAlly-Upgraded/raw/main/images/Artisan_Video_generation.jpg" alt="Artisan Video Generation" width="330" style="margin:8px;" />
<img src="https://github.com/Hassan010103/ArtisanAlly-Upgraded/raw/main/images/Photo_Studio.jpg" alt="Photo Studio" width="330" style="margin:8px;" />
<img src="https://github.com/Hassan010103/ArtisanAlly-Upgraded/raw/main/images/Customer_Dashboard.jpg" alt="Customer Dashboard" width="330" style="margin:8px;" />
<img src="https://github.com/Hassan010103/ArtisanAlly-Upgraded/raw/main/images/MarketPlace.jpg" alt="Marketplace" width="330" style="margin:8px;" />
<img src="https://github.com/Hassan010103/ArtisanAlly-Upgraded/raw/main/images/ProductDescription.jpg" alt="Product Description" width="330" style="margin:8px;" />
<img src="https://github.com/Hassan010103/ArtisanAlly-Upgraded/raw/main/images/Training_section.jpg" alt="Training Section" width="330" style="margin:8px;" />
<img src="https://github.com/Hassan010103/ArtisanAlly-Upgraded/raw/main/images/Volunteer_Dashboard.jpg" alt="Volunteer Dashboard" width="330" style="margin:8px;" />
<img src="https://github.com/Hassan010103/ArtisanAlly-Upgraded/raw/main/images/Volunteer_Hub.jpg" alt="Volunteer Hub" width="330" style="margin:8px;" />

</div>

---

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

