# Raindeer Social - LinkedIn AI Generator (v2)

This document outlines the full-stack architecture and feature set of the Raindeer Social LinkedIn post generator built with React (Vite) and Node.js (Express).

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Zustand, Framer Motion, FullCalendar.
- **Backend**: Node.js, Express, Prisma ORM, NeonDB (PostgreSQL).
- **Authentication**: JWT & bcryptjs.
- **APIs Used**: 
  - **Groq API** (`llama3-8b-8192`): Used to generate high-quality LinkedIn post content based on brand tone and images.
  - **ImageKit**: Used to store user uploaded images securely.
  - **ScraperAPI**: Used to bypass bot protections and scrape the user's provided website for context.

## Application Flow

1. **Authentication (`Landing.jsx`)**
   - User registers or logs in with their email and password.
   - The backend validates and returns a JWT token which is stored in Zustand (`isAuthenticated`).
   
2. **Brand Onboarding (`BrandSetup.jsx`)**
   - Only for newly registered brands.
   - Asks for brand category, website, product, USP, audience, and tone.
   - **ScraperAPI** extracts context from the given website URL.
   - **Step 6**: "Social Connection". The user connects their LinkedIn account (simulated via boolean flag in the DB). Other platforms are marked "Coming Soon".

3. **Admin Dashboard (`Dashboard.jsx`)**
   - The central hub after login/onboarding. Contains two tabs:
   - **Photo Library**: Displays all uploaded photos. Users can click "Upload Photos" to open the `ImageUpload` component in a modal, which handles uploading multiple photos to ImageKit.
   - **Content Calendar**: The `ContentCalendar` component.

4. **Generating Posts (`ContentCalendar.jsx`)**
   - **Click-to-Generate Flow**:
     1. The user clicks on an empty date cell in the FullCalendar.
     2. A modal opens showing their uploaded photos.
     3. The user selects a photo.
     4. The system sends `brandId`, `imageId`, and `date` to `POST /api/generate`.
     5. The Groq AI crafts a post using the exact context scraped from the website + the image description + the exact brand tone.
     6. A `LinkedInPreview` modal instantly appears with the generated result.

5. **LinkedIn Preview (`LinkedInPreview.jsx`)**
   - An exact UI clone of a LinkedIn post preview.
   - It displays the generated text and the image.
   - Users can click **Push to LinkedIn** which updates the post status to `PUBLISHED`.

## Running Locally
1. **Database / Backend**:
   - `cd raindeer-backend`
   - Ensure `.env` is populated with `DATABASE_URL`, `IMAGEKIT` keys, `GROQ_API_1`, `SCRAPER_API_KEY`, and `JWT_SECRET`.
   - `npx prisma db push`
   - `npx prisma generate`
   - `npm run start` (Runs on port 3001)
   
2. **Frontend**:
   - `cd raindeer-frontend`
   - `npm install`
   - `npm run dev` (Runs on port 5173)
